import { Inject, Injectable } from "@nestjs/common";
import { pokemon_trades, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";

export interface ITradeService {
  getTrades(filter?: Prisma.pokemon_tradesWhereInput): Promise<pokemon_trades[]>;
}

@Injectable()
export class TradeService implements ITradeService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  
  getTrades(filter?: Prisma.pokemon_tradesWhereInput) {
    return this.prisma.pokemon_trades.findMany({ where: filter });
  }
}