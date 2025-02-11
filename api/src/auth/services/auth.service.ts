import { Inject, Injectable } from '@nestjs/common';
import { players } from '@prisma/client';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { Services } from 'src/utils/constants';
import { UserDetails } from 'src/utils/types';

export interface IAuthService {
  login(details: UserDetails): Promise<players>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) {}

  async login(details: UserDetails): Promise<players> {
    const { username, discordId } = details;
    // Fetch a user with the given discord ID
    let user = await this.prisma.players.findUnique({ where: { discord_id: discordId } });
    let message = `Login: ${user?.username} [${user?.discord_id}] found`

    // If not found, create one
    if (!user) {
      user = await this.prisma.players.create({ data: {
        username: username,
        discord_id: discordId
      } });
      message = `Login: ${user?.username} [${user?.discord_id}] created`
    }

    console.log(message);
    return user;
  }
}
