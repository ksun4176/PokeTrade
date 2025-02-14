import { Body, Controller, ForbiddenException, Get, Inject, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { ITradeService } from "src/trade/services/trade.service";
import { IAccountService } from "../services/account.service";
import { AuthenticatedGuard } from "src/utils/Guards";
import { AuthUser } from "src/utils/decorators";
import { Prisma, User } from "@prisma/client";
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
      accountId: accountId,
    });
  }

  @Put(':accountId')
  @UseGuards(AuthenticatedGuard)
  async updateAccount(
    @AuthUser() user: User,
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body('inGameName') inGameName?: string,
    @Body('friendCode') friendCode?: string
  ) {
    const accounts = await this.accountService.getAccounts({
      id: accountId,
      userId: user.id,
    });
    if (accounts.length === 0) {
      throw new ForbiddenException('Cannot modify this account');
    }
    return this.accountService.updateAccount(accountId, {
      inGameName,
      friendCode,
    });
  }

  @Post(':accountId/trades')
  @UseGuards(AuthenticatedGuard)
  async updateAccountTrades(
    @AuthUser() user: User,
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body('trades', new ZodValidationPipe(AccountTradesSchema)) trades: AccountTradesDto
  ) {
    const accounts = await this.accountService.getAccounts({
      id: accountId,
      userId: user.id,
    });
    if (accounts.length === 0) {
      throw new ForbiddenException('Cannot modify this account');
    }
    const data: Prisma.PokemonTradeCreateManyInput[] = trades.map(t => ({ 
      pokemonId: t.pokemon,
      accountId: accountId,
      tradeTypeId: t.tradeType
    }));
    const affectedRows = await this.tradeService.updateAccountTrades(accountId, data);
    return { affectedRows };
  }
}