import { Prisma, User } from "@prisma/client";
import { TradeTypes } from "./constants";
import { z } from "zod";
import { OAuth2Guild } from "discord.js";

export type SerializerDone = (error: Error | null, user: User | null) => void;

//#region Prisma
export const pokemonInclude = Prisma.validator<Prisma.PokemonCardDexInclude>()({
  pokemonPostfix: true,
  expansion: true,
  pokemonCardRarity: true,
});
export type Pokemon  = Prisma.PokemonCardDexGetPayload<{
  include: typeof pokemonInclude;
}>;
export const tradePokemonInclude = Prisma.validator<Prisma.PokemonTradeInclude>()({
  pokemonCardDex: {
    include: pokemonInclude
  }
})
export type TradeWithPokemon = Prisma.PokemonTradeGetPayload<{
  include: typeof tradePokemonInclude
}>;

export const tradeAccountInclude = Prisma.validator<Prisma.PokemonTradeInclude>()({
  account: {
    include: {
      user: {
        select: {
          id: true,
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
//#endregion Prisma

//#region Discord
export type DiscordPartialServer = Pick<OAuth2Guild, "id" | "name" | "icon" | "owner" | "permissions" | "features"> & 
  { banner: string | null };
//#endregion Discord

//#region Inputs, Pipe Schemas and DTOs
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

export const UserSchema = z.object({
  id: z.number(),
  discordId: z.string(),
  username: z.string(),
})
export type UserDto = z.infer<typeof UserSchema>;
//#endregion Inputs, Pipe Schemas and DTOs