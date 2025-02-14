import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
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

  serializeUser(user: User, done: SerializerDone) {
    done(null, user);
  }

  async deserializeUser(user: User, done: SerializerDone) {
    try {
      const userDb = await this.userService.findUser(user.discordId);
      userDb ? done(null, userDb) : done(null, null);
    }
    catch (error) {
      done(error as Error, null);
    }
  }
}