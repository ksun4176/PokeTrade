import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUserService } from 'src/user/services/user.service';
import { Services } from 'src/utils/constants';
import { UserDetails } from 'src/utils/types';

export interface IAuthService {
  /**
   * Log in with user
   * @param details Detail of user to login
   * @returns Database object for user
   */
  login(details: UserDetails): Promise<User>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USER) private readonly userService: IUserService,
  ) {}
  async login(details: UserDetails): Promise<User> {
    const user = await this.userService.upsertUser(details);
    console.log(`${user.username} [${user.discordId}] logged in`);
    return user;
  }
}
