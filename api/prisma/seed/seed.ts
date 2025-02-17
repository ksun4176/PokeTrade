import { PokemonCardDex, Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
async function main() {

  // expansions
  const expansions: Prisma.ExpansionUncheckedCreateInput[] = [
    {id: 1, code: 'A1', name: 'Genetic Apex', totalCards: 226},
    {id: 2, code: 'A1a', name: 'Mythical Island', totalCards: 68},
    {id: 3, code: 'PROMO-A', name: 'PROMO-A', totalCards: 0},
    {id: 4, code: 'A2', name: 'Space-Time Smackdown', totalCards: 155},
  ];
  for (const expansion of expansions) {
    const insertedExpansion = await prisma.expansion.upsert({
      where: {id: expansion.id},
      update: {},
      create: expansion
    });
    console.log(insertedExpansion);
  }

  // booster packs
  const boosters: Prisma.ExpansionBoosterUncheckedCreateInput[] = [
    {id: 0, expansionId: 1, name: 'All'},
    {id: 1, expansionId: 1, name: 'Mewtwo'},
    {id: 2, expansionId: 1, name: 'Charizard'},
    {id: 3, expansionId: 1, name: 'Pikachu'},
    {id: 4, expansionId: 2, name: 'Mew'},
    {id: 5, expansionId: 4, name: 'All'},
    {id: 6, expansionId: 4, name: 'Dialga'},
    {id: 7, expansionId: 4, name: 'Palkia'},
  ];
  for (const booster of boosters) {
    const insertedBooster = await prisma.expansionBooster.upsert({
      where: {id: booster.id},
      update: {},
      create: booster
    });
    console.log(insertedBooster);
  }

  // rarities
  const rarities: Prisma.PokemonCardRarityUncheckedCreateInput[] = [
    {id: 1, name: '1♦'},
    {id: 2, name: '2♦'},
    {id: 3, name: '3♦'},
    {id: 4, name: '4♦'},
    {id: 5, name: '1★'},
    {id: 6, name: '2★'},
    {id: 7, name: '3★'},
    {id: 8, name: '👑'},
  ]
  for (const rarity of rarities) {
    const insertedRarity = await prisma.pokemonCardRarity.upsert({
      where: {id: rarity.id},
      update: {},
      create: rarity
    });
    console.log(insertedRarity);
  }

  // name postfixes
  const postfixes: Prisma.PokemonPostfixUncheckedCreateInput[] = [
    {id: 1, name: 'None'},
    {id: 2, name: 'EX'},
  ]
  for (const postfix of postfixes) {
    const insertedPostfix = await prisma.pokemonPostfix.upsert({
      where: {id: postfix.id},
      update: {},
      create: postfix
    });
    console.log(insertedPostfix);
  }

  // stages
  const stages: Prisma.PokemonStageUncheckedCreateInput[] = [
    {id: 1, name: 'Basic'},
    {id: 2, name: 'Stage 1'},
    {id: 3, name: 'Stage 2'},
    {id: 4, name: 'Trainer'},
  ];
  for (const stage of stages) {
    const insertedStage = await prisma.pokemonStage.upsert({
      where: {id: stage.id},
      update: {},
      create: stage
    });
    console.log(insertedStage);
  }

  // types
  const types: Prisma.PokemonTypeUncheckedCreateInput[] = [
    {id: 1, name: 'Grass', weakness: 2},
    {id: 2, name: 'Fire', weakness: 3},
    {id: 3, name: 'Water', weakness: 4},
    {id: 4, name: 'Lightning', weakness: 6},
    {id: 5, name: 'Psychic', weakness: 8},
    {id: 6, name: 'Fighting', weakness: 5},
    {id: 7, name: 'Darkness', weakness: 7},
    {id: 8, name: 'Metal', weakness: null},
    {id: 9, name: 'Dragon', weakness: null},
    {id: 10, name: 'Colorless', weakness: null},
    {id: 11, name: 'Supporter', weakness: null},
    {id: 12, name: 'Item', weakness: null},
    {id: 13, name: 'Tool', weakness: null},
  ];
  for (const type of types) {
    const insertedType = await prisma.pokemonType.upsert({
      where: {id: type.id},
      update: {},
      create: type
    });
    console.log(insertedType);
  }

  // pokemon cards
  const pokemons: PokemonCardDex[] = [];
  const cards: Prisma.PokemonCardDexUncheckedCreateInput[] = [
    {id: 28, dexId: 1, name: 'Bulbasaur', typeId: 1, rarityId: 1, expansionId: 1, boosterId: 1 },
    {id: 409, dexId: 12, name: 'Magmar', typeId: 2, rarityId: 2, expansionId: 2, boosterId: 4 },
    {id: 736, dexId: 49, name: 'Palkia ex', namePostfixId: 2, typeId: 3, rarityId: 4, expansionId: 4, boosterId: 7 },
    {id: 121, dexId: 94, name: 'Pikachu', typeId: 4, rarityId: 1, expansionId: 1, boosterId: 3 },
    {id: 143, dexId: 116, name: 'Kadabra', typeId: 5, rarityId: 2, expansionId: 1, boosterId: 2 },
    {id: 173, dexId: 146, name: 'Machamp', namePostfixId: 6, typeId: 4, rarityId: 1, expansionId: 4, boosterId: 2 },
  ];
  for (const card of cards) {
    const insertedPokemon = await prisma.pokemonCardDex.upsert({
      where: {id: card.id},
      update: {},
      create: card
    });
    console.log(insertedPokemon);
    pokemons.push(insertedPokemon);
  }

  // permission 8 which is default
  const insertedPermissions = await prisma.permission.upsert({
    where: {id: 8},
    update: {},
    create: {
      id: 8,
      name: 'Everyone',
      hierarchyLevel: 1
    }
  });
  console.log(insertedPermissions);


  // trade types
  const tradeTypes: Prisma.TradeTypeUncheckedCreateInput[] = [
    {id: 1, name: 'Request'},
    {id: 2, name: 'Offer'},
  ];
  for (const type of tradeTypes) {
    const insertedType = await prisma.tradeType.upsert({
      where: {id: type.id},
      update: {},
      create: type
    });
    console.log(insertedType);
  }

  // insert 50 players + accounts linked + random trades
  for (let i = 0; i < 50; i++) {
    const user: Prisma.UserUncheckedCreateInput = {
      discordId: `${i}`,
      username: `User ${i}`
    };
    const insertedUser = await prisma.user.create({ data: user });
    console.log(insertedUser);
    const account: Prisma.AccountUncheckedCreateInput = {
      inGameName: `User ${i}`,
      friendCode: `12345678901234${i}`,
      userId: insertedUser.id
    };
    const insertedAccount = await prisma.account.create({ data: account });
    console.log(insertedAccount);

    for (const pokemon of pokemons) {
      const insertedTrade = await prisma.pokemonTrade.create({ data: {
        pokemonId: pokemon.id,
        accountId: insertedAccount.id,
        tradeTypeId: Math.floor(Math.random() * 2 + 1)
      } });
      console.log(insertedTrade);
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })