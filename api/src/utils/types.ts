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

export const accountInclude = Prisma.validator<Prisma.AccountInclude>()({
  user: true
});
export type Account  = Prisma.AccountGetPayload<{
  include: typeof accountInclude;
}>;

export const pokemonInclude = Prisma.validator<Prisma.PokemonCardDexInclude>()({
  pokemonPostfix: true,
  expansion: true,
  pokemonCardRarity: true,
});
export type Pokemon  = Prisma.PokemonCardDexGetPayload<{
  include: typeof pokemonInclude;
}>;
