import { Controller, Get, HttpException, HttpStatus, Inject, Param, UseGuards } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { IAccountService } from "src/account/services/account.service";
import { AuthUser } from "src/utils/decorators";
import { players } from "@prisma/client";
import { AuthenticatedGuard } from "src/utils/Guards";

@Controller(Routes.USER)
export class UserController {
  constructor(
    @Inject(Services.ACCOUNT) private readonly accountService: IAccountService,
  ) { }

  @Get(':userId/accounts')
  @UseGuards(AuthenticatedGuard)
  getAccounts(@AuthUser() user: players, @Param('userId') userId: string) {
    const userIdInt = parseInt(userId);
    if (user.id !== userIdInt) throw new HttpException('Do not have access', HttpStatus.FORBIDDEN);
    return this.accountService.getAccounts({
      player_id: user.id,
    });
  }
}