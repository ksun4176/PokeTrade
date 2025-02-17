import { Prisma, User } from "@prisma/client";
import { TradeTypes } from "./constants";
import { z } from "zod";

export type UserDetails = {
  username: string;
  discordId: string;
  accessToken: string;
  refreshToken: string;
}

export const AccountTradesSchema = z.array(
  z.object({
    tradeType: z.nativeEnum(TradeTypes),
    pokemon: z.number(),
  })
  .required()
)
export type AccountTradesDto = z.infer<typeof AccountTradesSchema>;

export type SerializerDone = (error: Error | null, user: User | null) => void;

export const pokemonInclude = Prisma.validator<Prisma.PokemonCardDexInclude>()({
  pokemonPostfix: true,
  expansion: true,
  pokemonCardRarity: true,
});
export type Pokemon  = Prisma.PokemonCardDexGetPayload<{
  include: typeof pokemonInclude;
}>;

export const tradeAccountInclude = Prisma.validator<Prisma.PokemonTradeInclude>()({
  account: {
    include: {
      user: {
        select: {
          discordId: true,
          username: true
        }
      }
    }
  }
})
export type TradeWithAccount = Prisma.PokemonTradeGetPayload<{
  include: typeof tradeAccountInclude
}>;
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