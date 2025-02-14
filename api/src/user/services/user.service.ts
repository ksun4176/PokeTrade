import { Inject, Injectable } from '@nestjs/common';
import { UserDetails } from '../../utils/types';
import { User } from '@prisma/client';
import { Services } from 'src/utils/constants';
import { PrismaService } from 'src/prisma/services/prisma.service';

export interface IUserService {
  findUser(discordId: string): Promise<User|null>;
  upsertUser(details: UserDetails): Promise<User>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) {}
  async findUser(discordId: string) {
    const user = await this.prisma.user.findUnique({ where: { discordId: discordId } });
    if (user) {
      console.log(`${user.username} [${user.discordId}] found`);
    }
    return user;
  }

  async upsertUser(details: UserDetails) {
    const { discordId, username, accessToken, refreshToken } = details;
    const user = await this.prisma.user.upsert({ 
      create: {
        discordId: discordId,
        username,
        accessToken,
        refreshToken
      },
      where: {
        discordId: discordId
      },
      update: {
        username,
        accessToken,
        refreshToken
      }
    });
    console.log(`${user.username} [${user.discordId}] created/updated`);
    return user;
  }
}
