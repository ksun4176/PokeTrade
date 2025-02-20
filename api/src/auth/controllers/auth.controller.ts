import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
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
    res.redirect(`${process.env.APP_URL!}/`);
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@AuthUser() user: User) {
    return user;
  }

  @Get('logout')
  logout(
    @Req() req: Request,
    @Res() res: Response
  ) {
    req.logout({ keepSessionInfo: false }, () => {});
    res.redirect(`${process.env.APP_URL!}/`);
  }
}
