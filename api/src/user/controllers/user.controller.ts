import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { IAccountService } from "src/account/services/account.service";
import { AuthUser } from "src/utils/decorators";
import { User } from "@prisma/client";
import { AuthenticatedGuard } from "src/utils/Guards";

@Controller(Routes.USER)
export class UserController {
  constructor(
    @Inject(Services.ACCOUNT) private readonly accountService: IAccountService,
  ) { }

  @Get('@me/accounts')
  @UseGuards(AuthenticatedGuard)
  getAccounts(@AuthUser() user: User) {
    return this.accountService.getAccounts({
      userId: user.id,
    });
  }

  @Post('@me/accounts')
  @UseGuards(AuthenticatedGuard)
  createAccounts(
    @AuthUser() user: User,
    @Body('inGameName') inGameName: string,
    @Body('friendCode') friendCode: string
  ) {
    return this.accountService.createAccount(user.id, {
      userId: user.id,
      inGameName,
      friendCode,
    });
  }
}