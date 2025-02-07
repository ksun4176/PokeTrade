export type Pokemon = {
  /** ID of Pokémon card */
  id: number;
  /** Card number specific to expansion */
  cardNumber: number;
  /** Name of Pokémon card */
  name: string;
  /** Pokémon expansion */
  expansionId: number;
  expansion: Expansion;
  /** Pokémon booster pack */
  packId: number;
  pack: BoosterPack;
  /** Rarity of Pokémon */
  rarityId: number;
  rarity: Rarity;
  /** Type of card */
  cardTypeId: number;
  cardType: CardType;
}

export type Expansion = {
  /** ID of Pokémon expansion */
  id: number;
  /** Code of Pokémon expansion */
  code: string;
  /** Name of Pokémon expansion */
  name: string;
}

export type BoosterPack = {
  /** ID of Pokémon booster pack */
  id: number;
  /** Pokémon expansion */
  expansionId: number;
  expansion: Expansion;
  /** Pokémon booster pack number */
  packNumber: number
  /** Name of Pokémon booster pack */
  name: string;
}

export type Rarity = {
  /** ID of Pokémon booster pack */
  id: number;
  /** Name of Pokémon booster pack */
  name: string;
}

export type CardType = {
  /** ID of card type */
  id: number;
  /** Name of card type */
  name: string;
}