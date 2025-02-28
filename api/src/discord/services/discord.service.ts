import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { User } from '@prisma/client';
import axios from 'axios';
import { AllowedMentionsTypes, codeBlock, GuildMember, Message } from 'discord.js';
import { IAccountService } from 'src/account/services/account.service';
import { IPokemonService } from 'src/pokemon/services/pokemon.service';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { ITradeService } from 'src/trade/services/trade.service';
import { ChannelTypes, DISCORD_BASE_URL, Services, TradeTypes } from 'src/utils/constants';
import { DiscordPartialServer, TradeWithPokemon, UserDto } from 'src/utils/types';
import { getPokemonName } from 'src/utils/utils';

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
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService,
    @Inject(Services.ACCOUNT) private readonly accountService: IAccountService,
    @Inject(Services.POKEMON) private readonly pokemonService: IPokemonService,
    @Inject(Services.TRADE) private readonly tradeService: ITradeService
  ) { }

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

  /**
   * Check whether a user is a member of a Discord server
   * @param serverId ID of Discord server
   * @param user user to check
   * @returns whether a user is a member or not
   */
  private async isMember(serverId: string, user: UserDto) {
    const { data: members } = await axios.get<GuildMember[]>(`${DISCORD_BASE_URL}/guilds/${serverId}/members/search?limit=1000&query=${user.username}`, {
      headers: {
        Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
      },
    });
    return !!members.find(m => m.user.id === user.discordId);
  }

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

  /**
   * Have the bot send a message in a Discord channel
   * @param channelId ID of Discord channel
   * @param content message to send
   */
  private async message(channelId: string, content: string) {
    await axios.post<Message>(`${DISCORD_BASE_URL}/channels/${channelId}/messages`, {
      content: content,
      allowed_mentions: {
        parse: [AllowedMentionsTypes.User]
      }
    }, {
      headers: {
        Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
      },
    });
  }

  async sendTradeMessage(pokemonId: number, author: User, user: UserDto) {
    const servers = await this.getMutualServers(author);
    if (servers.length === 0) {
      throw new NotAcceptableException('User is not in any Discord servers the bot is in.');
    }
    const channels = await this.getChannelsForTrading(servers);
    if (channels.length === 0) {
      throw new NotAcceptableException('No Discord server is set up for bot to send a message in.');
    }

    try {
      const pokemon = await this.pokemonService.getPokemon(pokemonId);
      const pokemonName = getPokemonName(pokemon);
      let content = `## ${pokemonName} requested\n` +
        `Hi <@${user.discordId}>!\n` +
        `<@${author.discordId}> is looking to trade for your ${pokemonName}.\n`;
      
      // get trades that the author offer for the pokemon and add them to the message based on if user requested them or not
      const accounts = await this.accountService.getAccounts({userId: author.id});
      let authorOfferedTrades: TradeWithPokemon[] = [];
      if (accounts.length > 0) {
        authorOfferedTrades = await this.tradeService.getPokemonTradeMatchesForAccount(pokemon, accounts[0]);
      }
      if (authorOfferedTrades.length > 0) {
        const userRequestedTrades = await this.tradeService.getTrades({
          tradeTypeId: TradeTypes.Request,
          account: { userId: user.id },
          pokemonCardDex: { rarityId: pokemon.rarityId }
        });
        const requested = [], notRequested = [];
        for (const trade of authorOfferedTrades) {
          if (userRequestedTrades.find(t => t.pokemonId === trade.pokemonId)) requested.push(trade);
          else notRequested.push(trade);
        }
        content += `**They can offer:**\n` +
          codeBlock("diff", 
            requested.map(t => `+ ${getPokemonName(t.pokemonCardDex)}`).join('\n') + 
            '\n' +
            notRequested.map(t => `- ${getPokemonName(t.pokemonCardDex)}`).join('\n')
          );
      }
      else {
        content += `You can chat with them here to see what they can offer in return.`;
      }
      let numServerIsMember = 0;
      for (const channel of channels) {
        const isMember = await this.isMember(channel.serverId, user);
        if (isMember) {
          numServerIsMember++;
          try {
            await this.message(channel.channelId, content);
            return 'Message sent. Check your Discord.';
          }
          catch (error) { }
        }
      }
      const errorMessage = numServerIsMember > 0 ? 'Bot failed to send message.' : 'No mutual Discord servers found.';
      throw new NotAcceptableException(errorMessage);
    }
    catch (error) { }
    throw new InternalServerErrorException('Error sending message.');
  }
}
