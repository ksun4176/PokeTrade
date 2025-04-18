import { Inject, Injectable } from "@nestjs/common";
import { Account, PokemonTrade, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
import { AccountStatus, Services, TradeTypes } from "src/utils/constants";
import { AccountToPokemon, AccountTradeMatches, CardToAccount, Pokemon, pokemonInclude, tradeAccountInclude, TradeWithPokemon } from "src/utils/types";

export interface ITradeService {
  /**
   * Get trades
   * @param filter Filters for trades
   * @returns A list of trades
   */
  getTrades(filter?: Prisma.PokemonTradeWhereInput): Promise<PokemonTrade[]>;
  /**
   * Update trades linked to an account.
   * Any old trades will be removed if not included in new list.
   * @param accountId Account to link trades to
   * @param data exhaustive list of trades to link to account
   * @returns number of trades updated
   */
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
  /**
   * Get trade matches to a specific Pokemon belonging to a single account.
   * These are trades that can be given in return for the requested Pokemon
   * @param pokemon Pokemon requested that we need to match trades to
   * @param account Account with trades we are matching
   * @returns trades matching the Pokemon
   */
  getPokemonTradeMatchesForAccount(pokemon: Pokemon, account: Account): Promise<TradeWithPokemon[]>;
  /**
   * Get the last trade that a user added
   * @param accountId Account ID
   * @param tradeType If we want to only look at a particular trade type
   * @returns The trade if any
   */
  getAccountLastTrade(accountId: number, tradeType?: TradeTypes): Promise<PokemonTrade | null>;
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
        pokemonId: { in: wishlist },
        account: { status: AccountStatus.Available } // check that account is available
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

  async getPokemonTradeMatchesForAccount(pokemon: Pokemon, account: Account) {
    const accountTrades = await this.prisma.pokemonTrade.findMany({
      where: {
        tradeTypeId: TradeTypes.Offer,
        pokemonCardDex: {
          rarityId: pokemon.rarityId
        },
        accountId: account.id,
      },
      include: {
        pokemonCardDex: {
          include: pokemonInclude
        }
      }
    });

    return accountTrades;
  }

  async getAccountLastTrade(accountId: number, tradeType?: TradeTypes): Promise<PokemonTrade | null> {
    const trade = await this.prisma.pokemonTrade.findFirst({ 
      where: {
        accountId: accountId,
        tradeTypeId: tradeType
      },
      orderBy: {
        updated: 'desc'
      }
    });
    if (trade) {
      console.log(`1 trade found.`)
    }
    return trade;
  }
}