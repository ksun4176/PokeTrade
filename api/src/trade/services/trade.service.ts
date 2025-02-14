import { Inject, Injectable } from "@nestjs/common";
import { PokemonTrade, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services } from "src/utils/constants";

export interface ITradeService {
  getTrades(filter?: Prisma.PokemonTradeWhereInput): Promise<PokemonTrade[]>;
  updateAccountTrades(accountId: number, data: Prisma.PokemonTradeCreateManyInput[]): Promise<number>;
}

@Injectable()
export class TradeService implements ITradeService {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) { }
  
  async getTrades(filter?: Prisma.PokemonTradeWhereInput) {
    const trades = await this.prisma.pokemonTrade.findMany({ where: filter });
    console.log(`${trades.length} trades found.`)
    return trades;
  }

  async updateAccountTrades(accountId: number, data: Prisma.PokemonTradeCreateManyInput[]) {
    const existingTrades = await this.getTrades({ accountId: accountId });
    const existingPokemon = existingTrades.map(t => t.pokemonId);
    const pokemonsToUpdate = new Set(data.map(t => t.pokemonId));

    // find out how many pokemon entries we're deleting (not updating)
    const pokemonsToDelete = existingPokemon.filter(id => !pokemonsToUpdate.has(id));

    await this.prisma.pokemonTrade.deleteMany({ where: { accountId: accountId } });
    const addedTrades = await this.prisma.pokemonTrade.createMany({ data: data });
    console.log(
      `Account [${accountId}] has:\n`+
      `- ${pokemonsToDelete.length} trades deleted\n`+
      `- ${existingPokemon.length - pokemonsToDelete.length} trades updated\n`+
      `- ${pokemonsToUpdate.size - (existingPokemon.length - pokemonsToDelete.length)} trades created.`)
    return pokemonsToDelete.length + addedTrades.count;
  }
}