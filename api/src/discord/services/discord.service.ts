import { ForbiddenException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { Account, DiscordChannel, User } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { AllowedMentionsTypes, APIGuildMember, APIMessage, APIThreadChannel, codeBlock, ThreadAutoArchiveDuration } from 'discord.js';
import { IAccountService } from 'src/account/services/account.service';
import { MyLoggerService } from 'src/mylogger/mylogger.service';
import { IPokemonService } from 'src/pokemon/services/pokemon.service';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { ITradeService } from 'src/trade/services/trade.service';
import { ChannelTypes, DISCORD_BASE_URL, Services, TradeTypes } from 'src/utils/constants';
import { DiscordPartialServer, Pokemon, UserDto } from 'src/utils/types';
import { getPokemonShortName } from 'src/utils/utils';

type UserWithAccount = {
  id: number;
  username: string;
  discordId: string;
  accounts: Account[];
};

export interface IDiscordService {
  /**
   * Send a trade message between author and user in Discord
   * This will contain information about the Pokemon being traded and what author can offer in response.
   * @param pokemonId ID of Pokemon
   * @param author Author of message
   * @param user User to send message to
   */
  sendTradeMessage(pokemonId: number, author: User, user: UserDto): Promise<string>;
}

@Injectable()
export class DiscordService implements IDiscordService {
  private readonly logger = new MyLoggerService(DiscordService.name);

  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService,
    @Inject(Services.ACCOUNT) private readonly accountService: IAccountService,
    @Inject(Services.POKEMON) private readonly pokemonService: IPokemonService,
    @Inject(Services.TRADE) private readonly tradeService: ITradeService
  ) { }

  //#region Database
  /**
   * Get a list of Discord channels that we can send trade messages in.
   * @param servers List of Discord servers to search
   * @returns List of Discord channels
   */
  private async getChannelsForTrading(servers: DiscordPartialServer[]) {
    return await this.prisma.discordChannel.findMany({
      where: {
        serverId: { in: servers.map(s => s.id) },
        channelTypeId: ChannelTypes.TradeMessage
      },
      orderBy: {
        id: 'asc'
      }
    });
  }
  //#endregion Database

  //#region Server
  /**
   * Get the Discord servers that the bot is in
   * @returns A list of servers
   */
  private async getBotServers() {
    const response = await axios.get<DiscordPartialServer[]>(`${DISCORD_BASE_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
      },
    });
    return response.data;
  }

  /**
   * Get the Discord servers that the user is in
   * @param user user to find servers for
   * @returns A list of servers
   */
  private async getUserServers(user: User) {
    if (!user.accessToken) {
      throw new ForbiddenException('Cannot access Discord');
    }
    const response = await axios.get<DiscordPartialServer[]>(`${DISCORD_BASE_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    return response.data;
  }

  /**
   * Get the Discord servers that the user and bot are both in
   * @param user user to find mutual servers for
   * @returns A list of servers
   */
  private async getMutualServers(user: User) {
    const botServers = await this.getBotServers();
    const userServers = await this.getUserServers(user);
    const userServerIds = new Set(userServers.map(g => g.id));
    let mutualServers = botServers.filter(server => userServerIds.has(server.id));
    
    console.log(`${mutualServers.length } mutual servers found.`);
    return mutualServers;
  }
  //#endregion Server

  //#region Member
  /**
   * Check whether a user is a member of a Discord server
   * @param serverId ID of Discord server
   * @param user user to check
   * @returns whether a user is a member or not
   */
  private async isMember(serverId: string, user: UserDto) {
    try {
      const { data: member } = await axios.get<APIGuildMember>(`${DISCORD_BASE_URL}/guilds/${serverId}/members/${user.discordId}`, {
        headers: {
          Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
        },
      });
      return member.user.id === user.discordId;
    }
    catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === HttpStatus.NOT_FOUND) return false;
      }
      throw error;
    }
  }
  //#endregion Member

  //#region Thread
  /**
   * Find a private thread between users or if one isn't found, create one.
   * @param channelId ID of Discord channel
   * @param messageId ID of Discord message
   * @param threadName Name of thread
   * @param pokemon Pokemon we're trying to create a thread for
   * @returns Thread channel
   */
  private async findOrCreateThread(author: User, user: UserDto, channel: DiscordChannel, pokemon: Pokemon) {
    type Threads = {
      threads: APIThreadChannel[];
    }
    let newThreadName = `|[${author.discordId}],[${user.discordId}]`;
    newThreadName = getPokemonShortName(pokemon).slice(0,100-newThreadName.length) + newThreadName;
    // go through active threads
    let { data: { threads: threadsFound } } = await axios.get<Threads>(`${DISCORD_BASE_URL}/guilds/${channel.serverId}/threads/active`, {
      headers: {
        Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
      },
    });
    threadsFound = threadsFound.filter(t => 
      t.parent_id === channel.channelId &&
        t.name.includes(`[${author.discordId}]`) &&
        t.name.includes(`[${user.discordId}]`)
    );
    if (threadsFound.length === 0) {
      // go through private threads
      const { data: { threads: archivedThreads } } = await axios.get<Threads>(`${DISCORD_BASE_URL}/channels/${channel.channelId}/threads/archived/private`, {
        headers: {
          Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
        },
      });
      threadsFound = archivedThreads.filter(t => 
        t.name.includes(`[${author.discordId}]`) &&
        t.name.includes(`[${user.discordId}]`)
      );
    }
    if (threadsFound.length > 0) {
      let threadFound = threadsFound[0];
      try {
        // try renaming but it's OK if it fails
        const { data } = await axios.patch<APIThreadChannel>(`${DISCORD_BASE_URL}/channels/${threadFound.id}`, {
          name: newThreadName,
        }, {
          headers: {
            Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
          },
        });
        threadFound = data;
      }
      catch (error) { }
      return threadFound;
    }

    // create thread if needed
    const { data: thread } = await axios.post<APIThreadChannel>(`${DISCORD_BASE_URL}/channels/${channel.channelId}/threads`, {
      name: newThreadName,
      auto_archive_duration: ThreadAutoArchiveDuration.OneDay
    }, {
      headers: {
        Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
      },
    });
    return thread;
  }
  //#endregion Thread

  //#region Message
  /**
   * Have the bot send a message in a Discord channel
   * @param channelId ID of Discord channel
   * @param content message to send
   */
  private async message(channelId: string, content: string) {
    const { data: message } = await axios.post<APIMessage>(`${DISCORD_BASE_URL}/channels/${channelId}/messages`, {
      content: content,
      allowed_mentions: {
        parse: [AllowedMentionsTypes.User]
      }
    }, {
      headers: {
        Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
      },
    });
    return message;
  }

  /**
   * Send a message about a Pokemon to a thread channel
   * @param threadChannel Channel to send message in
   * @param pokemon Pokemon we're messaging about
   * @param author Author and the linked accounts
   * @param user User and the linked accounts
   */
  async sendPokemonMessage(threadChannel: APIThreadChannel, pokemon: Pokemon, author: UserWithAccount, user: UserWithAccount) {
    const pokemonName = getPokemonShortName(pokemon);
    let content = `Hi <@${user.discordId}>!\n` +
      `<@${author.discordId}> is looking to trade for your ${pokemonName}.\n`;

    const authorOfferedTrades = author.accounts.length === 0 ? [] :
      await this.tradeService.getPokemonTradeMatchesForAccount(pokemon, author.accounts[0]);
    if (authorOfferedTrades.length > 0) {
      const userRequestedTrades = user.accounts.length === 0 ? [] :
        await this.tradeService.getTrades({
          tradeTypeId: TradeTypes.Request,
          accountId: user.accounts[0].id,
          pokemonCardDex: { rarityId: pokemon.rarityId }
        });
      content += `**Trade matches you might be interested in:**\n`;
      let remaining = 1980 - content.length - codeBlock('diff','').length;
      const notRequested = [];
      let offeredTradesStr = '';
      for (const trade of authorOfferedTrades) {
        if (userRequestedTrades.find(t => t.pokemonId === trade.pokemonId)) {
          let tradeStr = `+ ${getPokemonShortName(trade.pokemonCardDex)}\n`;
          if (tradeStr.length <= remaining) {
            offeredTradesStr += tradeStr;
            remaining -= tradeStr.length;
          } 
          else {
            remaining = -1;
            break;
          }
        }
        else {
          notRequested.push(`- ${getPokemonShortName(trade.pokemonCardDex)}\n`);
        }
      }
      if (remaining > 0) {
        for (const tradeStr of notRequested) {
          if (tradeStr.length <= remaining) {
            offeredTradesStr += tradeStr;
            remaining -= tradeStr.length;
          }
          else {
            remaining = -1;
            break;
          }
        }
      }
      if (remaining < 0) {
        offeredTradesStr += '... and more\n';
      }
      
      content += codeBlock("diff", offeredTradesStr);
    }
    else {
      content += `You can chat with them here to see what they can offer in return.`;
    }
    await this.message(threadChannel.id, content);
  }
  //#endregion Message

  async sendTradeMessage(pokemonId: number, author: User, user: UserDto) {
    const servers = await this.getMutualServers(author);
    if (servers.length === 0) {
      throw new NotAcceptableException('User is not in any Discord servers the bot is in.');
    }
    const channels = await this.getChannelsForTrading(servers);
    if (channels.length === 0) {
      throw new NotAcceptableException('No Discord server is set up for bot to send a message in.');
    }

    const authorAccounts = await this.accountService.getAccounts({userId: author.id});
    if (authorAccounts.length === 0) {
      throw new InternalServerErrorException(`Author's account is not found`);
    }
    const userAccounts = await this.accountService.getAccounts({userId: user.id});
    if (userAccounts.length === 0) {
      throw new InternalServerErrorException(`User's account is not found`);
    }

    const pokemon = await this.pokemonService.getPokemon(pokemonId);
    const messageContent = `${author.username} requested ${getPokemonShortName(pokemon)} from ${user.username}`;
    
    let numServerIsMember = 0;
    for (const channel of channels) {
      const isMember = await this.isMember(channel.serverId, user);
      if (isMember) {
        numServerIsMember++;
        try {
          const threadChannel = await this.findOrCreateThread(author, user, channel, pokemon);
          await this.sendPokemonMessage(
            threadChannel,
            pokemon,
            {
              ...author,
              accounts: authorAccounts
            },
            {
              ...user,
              accounts: userAccounts
            }
          );

          await this.message(channel.channelId, messageContent);
          return 'Message sent. Check your Discord.';
        }
        catch (error) {
          if (error instanceof AxiosError) {
            this.logger.error(error.toJSON(), DiscordService.name);
          }
          else {
            this.logger.error(error, DiscordService.name);
          }
        }
      }
    }
    const errorMessage = numServerIsMember > 0 ? 'Bot failed to send message.' : 'No mutual Discord servers found.';
    throw new NotAcceptableException(errorMessage);
  }
}
