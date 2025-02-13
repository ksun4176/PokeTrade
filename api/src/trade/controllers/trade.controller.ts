import { Controller, Get, Inject } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { ITradeService } from "../services/trade.service";

@Controller(Routes.TRADE)
export class TradeController {
  constructor(
    @Inject(Services.TRADE) private readonly tradeService: ITradeService
  ) { }

  @Get('trades')
  getTrades() {
    return this.tradeService.getTrades();
  }
}