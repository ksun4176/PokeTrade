import { Inject, Injectable } from '@nestjs/common';
import { UserDetails } from '../../utils/types';
import { players } from '@prisma/client';
import { Services } from 'src/utils/constants';
import { PrismaService } from 'src/prisma/services/prisma.service';

export interface IUserService {
  findUser(discordId: string): Promise<players|null>;
  upsertUser(details: UserDetails): Promise<players>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) {}
  async findUser(discordId: string) {
    const user = await this.prisma.players.findUnique({ where: { discord_id: discordId } });
    if (user) {
      console.log(`${user.username} [${user.discord_id}] found`);
    }
    return user;
  }

  async upsertUser(details: UserDetails) {
    const { discordId, username, accessToken, refreshToken } = details;
    const user = await this.prisma.players.upsert({ 
      create: {
        discord_id: discordId,
        username,
        accessToken,
        refreshToken
      },
      where: {
        discord_id: discordId
      },
      update: {
        username,
        accessToken,
        refreshToken
      }
    });
    console.log(`${user.username} [${user.discord_id}] created/updated`);
    return user;
  }
}
