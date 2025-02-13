import { Prisma } from "@prisma/client";
import { TradeTypes } from "./constants";

export type AccountTradeDetails = {
  tradeType: TradeTypes;
  pokemon: number;
}

const accountInclude = Prisma.validator<Prisma.accountsInclude>()({
  players: true
});
export type Account  = Prisma.accountsGetPayload<{
  include: typeof accountInclude;
}>;

const pokemonInclude = Prisma.validator<Prisma.pokemon_card_dexInclude>()({
  pokemon_postfixes: true,
  expansions: true,
  pokemon_card_rarities: true,
});
export type Pokemon  = Prisma.pokemon_card_dexGetPayload<{
  include: typeof pokemonInclude;
}>;
