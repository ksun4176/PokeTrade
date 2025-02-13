import { Module } from "@nestjs/common";
import { TradeController } from "./controllers/trade.controller";
import { Services } from "src/utils/constants";
import { TradeService } from "./services/trade.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [TradeController],
  providers: [
    {
      provide: Services.TRADE,
      useClass: TradeService
    }
  ],
  exports: [
    {
      provide: Services.TRADE,
      useClass: TradeService
    }
  ]
})
export class TradeModule {}