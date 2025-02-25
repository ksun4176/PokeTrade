import { Inject, Injectable } from "@nestjs/common";
import { PokemonTrade, Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { Services, TradeTypes } from "src/utils/constants";
import { AccountToPokemon, AccountTradeMatches, CardToAccount, Pokemon, pokemonInclude, tradeAccountInclude, TradeWithPokemon } from "src/utils/types";

export interface ITradeService {
  getTrades(filter?: Prisma.PokemonTradeWhereInput): Promise<PokemonTrade[]>;
  updateAccountTrades(accountId: number, data: Prisma.PokemonTradeCreateManyInput[]): Promise<number>;
  /**
   * Get all trades offered that matches what an account has requested.
   * This will also give additional information on those trades such as who offered them and what they would want in return for the trade
   * @param requesterId Account ID for the one requesting trades
   * @returns 
   * cardToAccount: Map of cards requested TO accounts that have offered said card. These accounts are further broken into 2 buckets.
   * - matchingTrades: Accounts that the requester DID offer a pokemon that can be traded
   * - otherTrades: Accounts that the requester DID NOT offer a pokemon that can be traded
   * 
   * accountToPokemon: Map of accounts that have offered a requested card TO all cards that those accounts have requested. These cards are further broken into 2 buckets.
   * - matchingTrades: Cards that the requester DID offer
   * - otherTrades: Cards that the requester DID NOT offer
   */
  getAccountTradeMatches(requesterId: number): Promise<AccountTradeMatches>;
  getPokemonTradeMatchesForAccount(pokemon: Pokemon, user: User): Promise<TradeWithPokemon[]>;
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
    const addedTrades = await this.prisma.pokemonTrade.createMany({ data });
    console.log(
      `Account [${accountId}] has:\n`+
      `- ${pokemonsToDelete.length} trades deleted\n`+
      `- ${existingPokemon.length - pokemonsToDelete.length} trades updated\n`+
      `- ${pokemonsToUpdate.size - (existingPokemon.length - pokemonsToDelete.length)} trades created.`)
    return pokemonsToDelete.length + addedTrades.count;
  }

  async getAccountTradeMatches(requesterId: number) {
    const accountTrades = await this.prisma.pokemonTrade.findMany({ where: { accountId: requesterId } });
    const wishlist = accountTrades.filter(t => t.tradeTypeId === TradeTypes.Request).map(t => t.pokemonId);
    const listForTrade = new Set(accountTrades.filter(t => t.tradeTypeId === TradeTypes.Offer).map(t => t.pokemonId));

    // Get all offered trades for requested pokemons
    const matchingTrades = await this.prisma.pokemonTrade.findMany({
      where: {
        tradeTypeId: TradeTypes.Offer,
        pokemonId: { in: wishlist }
      },
      include: {
        ...tradeAccountInclude,
        pokemonCardDex: true,
      }
    });

    // Get all the offerers involved
    const uniqueAccountIds = [...new Set(matchingTrades.map(t => t.accountId))];

    // Find all of these offerers' requested pokemons
    const othersRequestedTrades = await this.prisma.pokemonTrade.findMany({
      where: {
        tradeTypeId: TradeTypes.Request,
        accountId: { in: uniqueAccountIds }
      },
      include: {
        pokemonCardDex: true
      }
    });

    // Split up the offerers' requested pokemons into whether the user offered them or not
    const accountToPokemon: AccountToPokemon = new Map();
    // accountMatchingRarityMap:
    // - key: Account ID
    // - value: Whether the requester has offered a pokemon of a certain rarity stored in bits (e.g., Rarity 1 = 2, Rarity 2 = 4, Rarity 3 = 8, etc.)
    const accountMatchingRarityMap = new Map<number, number>();
    for (const trade of othersRequestedTrades) {
      const accountId = trade.accountId;
      const pokemon = trade.pokemonCardDex;

      if (!accountToPokemon.has(accountId)) {
        accountToPokemon.set(accountId, { matchingTrades: [], otherTrades: [] });
        accountMatchingRarityMap.set(accountId, 0);
      }

      const accountPokemons = accountToPokemon.get(accountId)!;
      if (listForTrade.has(pokemon.id)) {
        accountPokemons.matchingTrades.push(pokemon.id);
        const accountRarity = accountMatchingRarityMap.get(accountId)!;
        accountMatchingRarityMap.set(accountId, accountRarity|1<<pokemon.rarityId);
      }
      else {
        accountPokemons.otherTrades.push(pokemon.id);
      }
    }
    
    // Split up the offerers into whether there is a matching trade or there is not a matching trade
    // cardToAccount: Matches AccountTradeMatches structure
    const cardToAccount: CardToAccount = new Map();
    for (const pokemonId of wishlist) {
      if (!cardToAccount.has(pokemonId)) {
        cardToAccount.set(pokemonId, {
          matchingTrades: [],
          otherTrades: []
        });
      }
    }
    for (const trade of matchingTrades) {
      const accountId = trade.accountId;
      const accountRarity = accountMatchingRarityMap.get(accountId);
      const pokemon = trade.pokemonCardDex;
      const pokemonId = pokemon.id;
      const cardAccounts = cardToAccount.get(pokemonId)!;
      const { pokemonCardDex: _, ...outputTrade } = trade;
      if (accountRarity && (accountRarity&1<<pokemon.rarityId) > 0) {
        cardAccounts.matchingTrades.push(outputTrade);
      }
      else {
        cardAccounts.otherTrades.push(outputTrade);
      }
    }

    console.log(`${cardToAccount.size} pokemons looked at`);
    console.log(`${accountToPokemon.size} accounts looked at`);
    return {
      cardToAccount: [...cardToAccount.entries()],
      accountToPokemon: [...accountToPokemon.entries()]
    };
  }

  async getPokemonTradeMatchesForAccount(pokemon: Pokemon, user: User) {
    const accountTrades = await this.prisma.pokemonTrade.findMany({
      where: {
        tradeTypeId: TradeTypes.Offer,
        pokemonCardDex: {
          rarityId: pokemon.rarityId
        },
        account: {
          userId: user.id
        },
      },
      include: {
        pokemonCardDex: {
          include: pokemonInclude
        }
      }
    });

    return accountTrades;
  }
}