import { Prisma } from "@prisma/client";

const pokemonInclude = Prisma.validator<Prisma.pokemon_card_dexInclude>()({
  pokemon_postfixes: true,
  expansions: true,
  pokemon_card_rarities: true,
});
export type Pokemon  = Prisma.pokemon_card_dexGetPayload<{
  include: typeof pokemonInclude;
}>;
