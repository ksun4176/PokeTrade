import { Controller, Get, Inject, Param } from "@nestjs/common";
import { Routes, Services, TradeTypes } from "src/utils/constants";
import { ITradeService } from "src/trade/services/trade.service";

@Controller(Routes.ACCOUNT)
export class AccountController {
  constructor(
    @Inject(Services.TRADE) private readonly tradeService: ITradeService,
  ) { }

  @Get(':accountId/wishlist')
  getWishlistPokemons(@Param('accountId') accountId: string) {
    const accountIdInt = parseInt(accountId);
    if (!accountIdInt) return [];
    return this.tradeService.getTrades({
      account_id: accountIdInt,
      trade_type_id: TradeTypes.Request,
    });
  }

  @Get(':accountId/listfortrading')
  getListForTradingPokemons(@Param('accountId') accountId: string) {
    const accountIdInt = parseInt(accountId);
    if (!accountIdInt) return [];
    return this.tradeService.getTrades({
      account_id: accountIdInt,
      trade_type_id: TradeTypes.Request,
    });
  }
}