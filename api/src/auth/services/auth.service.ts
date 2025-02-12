import { Inject, Injectable } from '@nestjs/common';
import { players } from '@prisma/client';
import { IUserService } from 'src/user/services/user.service';
import { Services } from 'src/utils/constants';
import { UserDetails } from 'src/utils/types';

export interface IAuthService {
  login(details: UserDetails): Promise<players>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USER) private readonly userService: IUserService,
  ) {}

  async login(details: UserDetails): Promise<players> {
    const user = await this.userService.upsertUser(details);
    console.log(`${user.username} [${user.discord_id}] logged in`);
    return user;
  }
}
