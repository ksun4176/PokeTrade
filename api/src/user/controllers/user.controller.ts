import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
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

  @Get('@me/accounts')
  @UseGuards(AuthenticatedGuard)
  getAccounts(@AuthUser() user: players) {
    return this.accountService.getAccounts({
      player_id: user.id,
    });
  }
}