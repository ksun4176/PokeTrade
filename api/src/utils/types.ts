import { players, Prisma } from "@prisma/client";
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

export type SerializerDone = (error: Error | null, user: players | null) => void;

export const accountInclude = Prisma.validator<Prisma.accountsInclude>()({
  players: true
});
export type Account  = Prisma.accountsGetPayload<{
  include: typeof accountInclude;
}>;

export const pokemonInclude = Prisma.validator<Prisma.pokemon_card_dexInclude>()({
  pokemon_postfixes: true,
  expansions: true,
  pokemon_card_rarities: true,
});
export type Pokemon  = Prisma.pokemon_card_dexGetPayload<{
  include: typeof pokemonInclude;
}>;
