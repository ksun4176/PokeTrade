import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GuildMember } from 'discord.js';
import { DISCORD_BASE_URL } from 'src/utils/constants';
import { DiscordPartialServer } from 'src/utils/types';

export interface IDiscordService {
  getMutualGuilds(accessToken: string, otherUsername?: string): Promise<DiscordPartialServer[]>;
}

@Injectable()
export class DiscordService implements IDiscordService {
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

  async getMutualGuilds(accessToken: string, otherUsername?: string) {
    const botGuilds = await this.getBotGuilds();
    const userGuilds = await this.getUserGuilds(accessToken);
    const userGuildIds = new Set(userGuilds.map(g => g.id));
    let mutualGuilds = botGuilds.filter(guild => userGuildIds.has(guild.id));
    
    if (otherUsername) {
      const guildsToSearch = [...mutualGuilds];
      mutualGuilds = [];
      for (const guild of guildsToSearch) {
        const { data: members } = await axios.get<GuildMember[]>(`${DISCORD_BASE_URL}/guilds/${guild.id}/members/search?limit=1000&query=${otherUsername}`, {
          headers: {
            Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
          },
        });
        if (members.find(m => m.user.username === otherUsername)) {
          mutualGuilds.push(guild);
        }
      }
    }

    console.log(`${mutualGuilds.length } mutual guilds found.`);
    return mutualGuilds;
  }
}
