import { Body, Controller, ForbiddenException, Get, Inject, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { ITradeService } from "src/trade/services/trade.service";
import { IAccountService } from "../services/account.service";
import { AuthenticatedGuard } from "src/utils/Guards";
import { AuthUser } from "src/utils/decorators";
import { players, Prisma } from "@prisma/client";
import { AccountTradesDto, AccountTradesSchema } from "src/utils/types";
import { ZodValidationPipe } from "src/utils/Pipes";

@Controller(Routes.ACCOUNT)
export class AccountController {
  constructor(
    @Inject(Services.ACCOUNT) private readonly accountService: IAccountService,
    @Inject(Services.TRADE) private readonly tradeService: ITradeService,
  ) { }

  @Get(':accountId/trades')
  getAccountTrades(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.tradeService.getTrades({
      account_id: accountId,
    });
  }

  @Put(':accountId')
  @UseGuards(AuthenticatedGuard)
  async updateAccount(
    @AuthUser() user: players,
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body('inGameName') ign?: string,
    @Body('friendCode') friendCode?: string
  ) {
    const accounts = await this.accountService.getAccounts({
      id: accountId,
      player_id: user.id,
    });
    if (accounts.length === 0) {
      throw new ForbiddenException('Cannot modify this account');
    }
    return this.accountService.updateAccount(accountId, {
      in_game_name: ign,
      friend_code: friendCode
    });
  }

  @Post(':accountId/trades')
  @UseGuards(AuthenticatedGuard)
  async updateAccountTrades(
    @AuthUser() user: players,
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body('trades', new ZodValidationPipe(AccountTradesSchema)) trades: AccountTradesDto
  ) {
    const accounts = await this.accountService.getAccounts({
      id: accountId,
      player_id: user.id,
    });
    if (accounts.length === 0) {
      throw new ForbiddenException('Cannot modify this account');
    }
    const data: Prisma.pokemon_tradesCreateManyInput[] = trades.map(t => ({ 
      card_id: t.pokemon,
      account_id: accountId,
      trade_type_id: t.tradeType
    }));
    const affectedRows = await this.tradeService.updateAccountTrades(accountId, data);
    return { affectedRows };
  }
}