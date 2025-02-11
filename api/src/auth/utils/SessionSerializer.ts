import { PassportSerializer } from '@nestjs/passport';
import { players } from '@prisma/client';
import { SerializerDone } from '../../utils/types';
import { Inject } from '@nestjs/common';
import { Services } from '../../utils/constants';
import { PrismaService } from 'src/prisma/services/prisma.service';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) {
    super();
  }

  serializeUser(user: players, done: SerializerDone) {
    done(null, user);
  }

  async deserializeUser(user: players, done: SerializerDone) {
    try {
      const userDb = await this.prisma.players.findUnique({ where: { discord_id: user.discord_id } });
      userDb ? done(null, userDb) : done(null, null);
    }
    catch (error) {
      done(error, null);
    }
  }
}