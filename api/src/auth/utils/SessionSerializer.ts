import { PassportSerializer } from '@nestjs/passport';
import { players } from '@prisma/client';
import { SerializerDone } from '../../utils/types';
import { Inject } from '@nestjs/common';
import { Services } from '../../utils/constants';
import { IUserService } from 'src/user/services/user.service';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.USER) private readonly userService: IUserService,
  ) {
    super();
  }

  serializeUser(user: players, done: SerializerDone) {
    done(null, user);
  }

  async deserializeUser(user: players, done: SerializerDone) {
    try {
      const userDb = await this.userService.findUser(user.discord_id);
      userDb ? done(null, userDb) : done(null, null);
    }
    catch (error) {
      done(error as Error, null);
    }
  }
}