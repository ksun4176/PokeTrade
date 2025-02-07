import { BoosterPack, CardType, Expansion, Pokemon, Rarity } from "../utils/types";

export const mockCardTypes: CardType[] = [
  { id: 1, name: 'Grass' },
  { id: 2, name: 'Fire' }
];

export const mockRarities: Rarity[] = [
  { id: 1, name: '♢' },
  { id: 2, name: '♢♢' },
  { id: 3, name: '♢♢♢' },
  { id: 4, name: '♢♢♢♢' }
];

export const mockExpansions: Expansion[] = [
  { id: 1, code: 'A1', name: 'Genetic Apex' },
  { id: 2, code: 'A1a', name: 'Mythical Island' }
];

export const mockBoosterPack: BoosterPack[] = [
  { id: 2, expansionId: 1, expansion: mockExpansions[0], packNumber: 1, name: 'Charizard' },
  { id: 3, expansionId: 1, expansion: mockExpansions[0], packNumber: 2, name: 'Mewtwo' },
  { id: 4, expansionId: 1, expansion: mockExpansions[0], packNumber: 3, name: 'Pikachu' },
  { id: 6, expansionId: 2, expansion: mockExpansions[1], packNumber: 1, name: 'Mew' }
];

export const mockPokemons: Pokemon[] = [
  {
    id: 1001, cardNumber: 1, name: 'Bulbasaur', expansionId: 1, expansion: mockExpansions[0],
    packId: 3, pack: mockBoosterPack[2], rarityId: 1, rarity: mockRarities[0], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1002, cardNumber: 2, name: 'Ivysaur', expansionId: 1, expansion: mockExpansions[0],
    packId: 3, pack: mockBoosterPack[2], rarityId: 2, rarity: mockRarities[1], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1003, cardNumber: 3, name: 'Venusaur', expansionId: 1, expansion: mockExpansions[0],
    packId: 3, pack: mockBoosterPack[2], rarityId: 3, rarity: mockRarities[2], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1004, cardNumber: 4, name: 'Venusaur EX', expansionId: 1, expansion: mockExpansions[0],
    packId: 3, pack: mockBoosterPack[2], rarityId: 4, rarity: mockRarities[3], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1005, cardNumber: 5, name: 'Caterpie', expansionId: 1, expansion: mockExpansions[0],
    packId: 4, pack: mockBoosterPack[3], rarityId: 1, rarity: mockRarities[0], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1006, cardNumber: 6, name: 'Metapod', expansionId: 1, expansion: mockExpansions[0],
    packId: 4, pack: mockBoosterPack[3], rarityId: 1, rarity: mockRarities[0], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1007, cardNumber: 7, name: 'Butterfree', expansionId: 1, expansion: mockExpansions[0],
    packId: 4, pack: mockBoosterPack[3], rarityId: 3, rarity: mockRarities[2], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1008, cardNumber: 8, name: 'Weedle', expansionId: 1, expansion: mockExpansions[0],
    packId: 3, pack: mockBoosterPack[2], rarityId: 1, rarity: mockRarities[0], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1009, cardNumber: 9, name: 'Kakuna', expansionId: 1, expansion: mockExpansions[0],
    packId: 3, pack: mockBoosterPack[2], rarityId: 1, rarity: mockRarities[0], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1010, cardNumber: 10, name: 'Beedrill', expansionId: 1, expansion: mockExpansions[0],
    packId: 3, pack: mockBoosterPack[2], rarityId: 3, rarity: mockRarities[2], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1011, cardNumber: 11, name: 'Oddish', expansionId: 1, expansion: mockExpansions[0],
    packId: 2, pack: mockBoosterPack[1], rarityId: 1, rarity: mockRarities[0], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1012, cardNumber: 12, name: 'Gloom', expansionId: 1, expansion: mockExpansions[0],
    packId: 2, pack: mockBoosterPack[1], rarityId: 2, rarity: mockRarities[1], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1013, cardNumber: 13, name: 'Vileplume', expansionId: 1, expansion: mockExpansions[0],
    packId: 2, pack: mockBoosterPack[1], rarityId: 3, rarity: mockRarities[2], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1014, cardNumber: 14, name: 'Paras', expansionId: 1, expansion: mockExpansions[0],
    packId: 4, pack: mockBoosterPack[3], rarityId: 1, rarity: mockRarities[0], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1015, cardNumber: 15, name: 'Parasect', expansionId: 1, expansion: mockExpansions[0],
    packId: 4, pack: mockBoosterPack[3], rarityId: 2, rarity: mockRarities[1], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1016, cardNumber: 16, name: 'Venonat', expansionId: 1, expansion: mockExpansions[0],
    packId: 3, pack: mockBoosterPack[2], rarityId: 1, rarity: mockRarities[0], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1017, cardNumber: 17, name: 'Venomoth', expansionId: 1, expansion: mockExpansions[0],
    packId: 3, pack: mockBoosterPack[2], rarityId: 2, rarity: mockRarities[1], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1018, cardNumber: 18, name: 'Bellsprout', expansionId: 1, expansion: mockExpansions[0],
    packId: 2, pack: mockBoosterPack[1], rarityId: 1, rarity: mockRarities[0], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 1019, cardNumber: 19, name: 'Weepinbell', expansionId: 1, expansion: mockExpansions[0],
    packId: 2, pack: mockBoosterPack[1], rarityId: 2, rarity: mockRarities[1], cardTypeId: 1, cardType: mockCardTypes[0]
  },
  {
    id: 2012, cardNumber: 12, name: 'Magmar', expansionId: 2, expansion: mockExpansions[1],
    packId: 6, pack: mockBoosterPack[1], rarityId: 2, rarity: mockRarities[1], cardTypeId: 2, cardType: mockCardTypes[1]
  }
];