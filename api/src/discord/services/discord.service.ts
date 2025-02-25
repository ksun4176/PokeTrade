import { ForbiddenException, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { User } from '@prisma/client';
import axios from 'axios';
import { AllowedMentionsTypes, codeBlock, GuildMember, Message } from 'discord.js';
import { IPokemonService } from 'src/pokemon/services/pokemon.service';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { ITradeService } from 'src/trade/services/trade.service';
import { DISCORD_BASE_URL, Services, TradeTypes } from 'src/utils/constants';
import { DiscordPartialServer, UserDto } from 'src/utils/types';
import { getPokemonName } from 'src/utils/utils';

export interface IDiscordService {
  sendTradeMessage(pokemonId: number, author: User, user: UserDto): Promise<string>;
}

@Injectable()
export class DiscordService implements IDiscordService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService,
    @Inject(Services.POKEMON) private readonly pokemonService: IPokemonService,
    @Inject(Services.TRADE) private readonly tradeService: ITradeService
  ) { }

  private async getBotGuilds() {
    const response = await axios.get<DiscordPartialServer[]>(`${DISCORD_BASE_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
      },
    });
    return response.data;
  }

  private async getUserGuilds(accessToken: string) {
    const response = await axios.get<DiscordPartialServer[]>(`${DISCORD_BASE_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  private async getMutualGuilds(accessToken: string) {
    const botGuilds = await this.getBotGuilds();
    const userGuilds = await this.getUserGuilds(accessToken);
    const userGuildIds = new Set(userGuilds.map(g => g.id));
    let mutualGuilds = botGuilds.filter(guild => userGuildIds.has(guild.id));
    
    console.log(`${mutualGuilds.length } mutual guilds found.`);
    return mutualGuilds;
  }

  private async isMember(serverId: string, user: UserDto) {
    const { data: members } = await axios.get<GuildMember[]>(`${DISCORD_BASE_URL}/guilds/${serverId}/members/search?limit=1000&query=${user.username}`, {
      headers: {
        Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
      },
    });
    return !!members.find(m => m.user.id === user.discordId);
  }

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
    if (!author.accessToken) {
      throw new ForbiddenException('Cannot access Discord');
    }
    const guilds = await this.getMutualGuilds(author.accessToken);
    if (guilds.length === 0) {
      throw new NotAcceptableException('User is not in any Discord servers the bot is in.');
    }
    const channels = await this.prisma.discordChannel.findMany({
      where: {
        serverId: { in: guilds.map(g => g.id) },
        channelTypeId: 1 //Type for Trade Request
      },
      orderBy: {
        id: 'asc'
      }
    });
    if (channels.length === 0) {
      throw new NotAcceptableException('No Discord server is set up for bot to send a message in.');
    }

    try {
      const pokemon = await this.pokemonService.getPokemon(pokemonId);
      const pokemonName = getPokemonName(pokemon);
      let content = `## ${pokemonName} requested\n` +
        `Hi <${user.discordId}>!\n` +
        `<${author.discordId}> is looking to trade for your ${pokemonName}.\n`;
      
      const userRequestedTrades = await this.tradeService.getTrades({
        tradeTypeId: TradeTypes.Request,
        account: {
          userId: user.id
        },
        pokemonCardDex: {
          rarityId: pokemon.rarityId
        }
      });
      let authorOfferedTrades = await this.tradeService.getPokemonTradeMatchesForAccount(pokemon, author);
      if (authorOfferedTrades.length > 0) {
        const requested = [];
        const notRequested = [];
        for (const trade of authorOfferedTrades) {
          if (userRequestedTrades.find(t => t.pokemonId === trade.pokemonId)) {
            requested.push(trade);
          }
          else {
            notRequested.push(trade);
          }
        }
        content += `**They can offer:**\n` +
        codeBlock("diff", 
          requested.map(t => `+ ${getPokemonName(t.pokemonCardDex)}`).join('\n') + '\n' +
          notRequested.map(t => `- ${getPokemonName(t.pokemonCardDex)}`).join('\n')
        );
      }
      else {
        content += `You can chat with them here to see what they can offer in return.`
      }
      for (const channel of channels) {
        const isMember = await this.isMember(channel.serverId, user);
        if (isMember) {
          await this.message(channel.channelId, content);
          return 'Message sent. Check your Discord.';
        }
      }
    }
    catch (error) {
      throw new NotAcceptableException('No mutual Discord servers found.');
    }
    throw new NotAcceptableException('Bot failed to send message.');
  }
}
