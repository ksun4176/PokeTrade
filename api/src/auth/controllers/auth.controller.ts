import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { players } from '@prisma/client';
import { Response } from 'express';
import { Routes } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { AuthenticatedGuard, DiscordAuthGuard } from 'src/utils/Guards';

@Controller(Routes.AUTH)
export class AuthController {
  @Get('login')
  @UseGuards(DiscordAuthGuard)
  login() { }

  @Get('redirect')
  @UseGuards(DiscordAuthGuard)
  redirect(@Res() res: Response) {
    res.redirect('http://localhost:3000/welcome');
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@AuthUser() user: players) {
    return user;
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  logout() { }
}
