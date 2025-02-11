import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import { Services } from 'src/utils/constants';
import { IAuthService } from '../services/auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService
  ) {
    super({
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_TOKEN!,
      callbackURL: process.env.CLIENT_REDIRECT_URL,
      scope: ['identify', 'guilds']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    return await this.authService.login({
      username: profile.username,
      discordId: profile.id
    })
  }
}