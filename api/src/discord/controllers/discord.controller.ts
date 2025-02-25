import { Body, Controller, Inject, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { AuthenticatedGuard } from 'src/utils/Guards';
import { IDiscordService } from '../services/discord.service';
import { UserDto, UserSchema } from 'src/utils/types';
import { ZodValidationPipe } from 'src/utils/Pipes';

@Controller(Routes.DISCORD)
export class DiscordController {
  constructor(
    @Inject(Services.DISCORD) private readonly discordService: IDiscordService,
  ) { }

  @Post('sendtrademessage')
  @UseGuards(AuthenticatedGuard)
  sendTradeMessage(
    @AuthUser() author: User,
    @Body('pokemonId', ParseIntPipe) pokemonId: number,
    @Body('user', new ZodValidationPipe(UserSchema)) user: UserDto,
  ) {
    return this.discordService.sendTradeMessage(pokemonId, author, user);
  }
}
