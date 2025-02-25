import { PokemonTrade, Prisma } from "@prisma/client";
import { TradeTypes } from "./constants";

export type AccountTradeDetails = {
  tradeType: TradeTypes;
  pokemon: number;
}

const pokemonInclude = Prisma.validator<Prisma.PokemonCardDexInclude>()({
  pokemonPostfix: true,
  expansion: true,
  pokemonCardRarity: true,
});
export type Pokemon  = Prisma.PokemonCardDexGetPayload<{
  include: typeof pokemonInclude;
}>;

export type TradeWithStringUpdated = Omit<PokemonTrade,'updated'> & { updated: string };

const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  discordId: true,
  username: true
});
export type User = Prisma.UserGetPayload<{
  select: typeof userSelect
}>;

const accountUserInclude = Prisma.validator<Prisma.AccountInclude>()({
  user: {
    select: userSelect
  }
});
export type AccountWithUser = Prisma.AccountGetPayload<{
  include: typeof accountUserInclude
}>;

const tradeAccountInclude = Prisma.validator<Prisma.PokemonTradeInclude>()({
  account: {
    include: accountUserInclude
  }
})
export type TradeWithAccount = Omit<Prisma.PokemonTradeGetPayload<{
  include: typeof tradeAccountInclude
}>,'updated'> & { updated: string };

export type AccountTradeMatches = {
  cardToAccount: [number, {
    matchingTrades: TradeWithAccount[],
    otherTrades: TradeWithAccount[]
  }][],
  accountToPokemon: [number, {
    matchingTrades: number[],
    otherTrades: number[]
  }][],
}
export type CardToAccount = Map<number, {
  matchingTrades: TradeWithAccount[],
  otherTrades: TradeWithAccount[]
}>;
export type AccountToPokemon = Map<number, {
  matchingTrades: number[],
  otherTrades: number[]
}>;