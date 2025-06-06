import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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
    return {
      id: user.id,
      discordId: user.discordId,
      username: user.username
    };
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  logout(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const username = (req.user as User).username;
    req.logOut(err => {
      if (err) {
        res.status(500).send('Logout fail');
      }
      console.log(`${username} has logged out.`)
      req.session.destroy(() => {
        res.clearCookie('connect.sid')
          .status(205).send('Logout success');
      });
    });
  }
}
