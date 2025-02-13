import { Controller, Get, Inject, Param } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { IAccountService } from "src/account/services/account.service";

@Controller(Routes.USER)
export class UserController {
  constructor(
    @Inject(Services.ACCOUNT) private readonly accountService: IAccountService,
  ) { }

  @Get('users/:userId/accounts')
  getAccounts(@Param('userId') userId: string) {
    const userIdInt = parseInt(userId);
    if (!userIdInt) return [];
    return this.accountService.getAccounts({
      player_id: userIdInt,
    });
  }
}