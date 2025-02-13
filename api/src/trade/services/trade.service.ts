import { Inject, Injectable } from "@nestjs/common";
import { pokemon_trades, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";

export interface ITradeService {
  getTrades(filter?: Prisma.pokemon_tradesWhereInput): Promise<pokemon_trades[]>;
  updateAccountTrades(accountId: number, data: Prisma.pokemon_tradesCreateManyInput[]): Promise<number>;
}

@Injectable()
export class TradeService implements ITradeService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  
  getTrades(filter?: Prisma.pokemon_tradesWhereInput) {
    return this.prisma.pokemon_trades.findMany({ where: filter });
  }

  async updateAccountTrades(accountId: number, data: Prisma.pokemon_tradesCreateManyInput[]) {
    const existingTrades = await this.getTrades({ account_id: accountId });
    const existingPokemon = existingTrades.map(t => t.card_id);
    const pokemonsToUpdate = new Set(data.map(t => t.card_id));

    // find out how many pokemon entries we're deleting (not updating)
    const pokemonsToDelete = existingPokemon.filter(id => !pokemonsToUpdate.has(id));

    await this.prisma.pokemon_trades.deleteMany({ where: { account_id: accountId } });
    const addedTrades = await this.prisma.pokemon_trades.createMany({ data: data });
    console.log(
      `Account [${accountId}] has:\n`+
      `- ${pokemonsToDelete.length} trades deleted\n`+
      `- ${existingPokemon.length - pokemonsToDelete.length} trades updated\n`+
      `- ${pokemonsToUpdate.size - (existingPokemon.length - pokemonsToDelete.length)} trades created.`)
    return pokemonsToDelete.length + addedTrades.count;
  }
}