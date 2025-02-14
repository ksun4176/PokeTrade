import { Prisma } from "@prisma/client";
import { TradeTypes } from "./constants";

export type AccountTradeDetails = {
  tradeType: TradeTypes;
  pokemon: number;
}

const accountInclude = Prisma.validator<Prisma.AccountInclude>()({
  user: true
});
export type Account  = Prisma.AccountGetPayload<{
  include: typeof accountInclude;
}>;

const pokemonInclude = Prisma.validator<Prisma.PokemonCardDexInclude>()({
  pokemonPostfix: true,
  expansion: true,
  pokemonCardRarity: true,
});
export type Pokemon  = Prisma.PokemonCardDexGetPayload<{
  include: typeof pokemonInclude;
}>;
