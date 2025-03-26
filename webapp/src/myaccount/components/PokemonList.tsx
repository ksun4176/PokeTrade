import { Pokemon } from "../../utils/types";
import Box from "@mui/material/Box";
import { PokemonCard } from "../../sharedComponents/PokemonCard";
import { JSX } from "react";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export enum GroupBy {
  Expansion,
  Rarity,
}
type PokemonListProps = {
  /**
   * Map of all available pokemons
   */
  pokemons: Map<number, Pokemon>;
  /**
   * List of Pokemons to show
   */
  selectedList: number[];
  /**
   * What to group the pokemons in the list with
   */
  groupBy: GroupBy;
}
/**
 * List of Pokemons
 */
export default function PokemonList(props: PokemonListProps) {
  const { pokemons, selectedList, groupBy } = props;
  let groupByProperty: keyof Pokemon = 'expansionId';
  let groupByNameProperty: keyof Pokemon = 'expansion';
  switch (groupBy) {
    case GroupBy.Rarity:
      groupByProperty = 'rarityId';
      groupByNameProperty = 'pokemonCardRarity';
      break;
  }

  let numGroups = 0;
  const groupsHeadingMap = new Map<number, string>();
  const pokemonMap = new Map<number, Pokemon[]>();

  for (let id of selectedList) {
    const pokemon = pokemons.get(id)!;
    const groupId = pokemon[groupByProperty];
    numGroups = Math.max(pokemon[groupByProperty], numGroups);
    groupsHeadingMap.set(groupId, pokemon[groupByNameProperty].name);
    if (!pokemonMap.has(groupId)) {
      pokemonMap.set(groupId, []);
    }
    const pokemonArray = pokemonMap.get(groupId)!;
    pokemonArray.push(pokemon);
  }
  const groups: JSX.Element[] = [];
  for (let i = 1; i <= numGroups; i++) {
    if (!groupsHeadingMap.has(i)) continue;
    const heading = groupsHeadingMap.get(i)!;
    const pokemonArray = pokemonMap.get(i)!;
    groups.push(
      <Box
        key={i}
        display='flex'
        flexDirection='column'
      >
        <Divider flexItem textAlign='left' sx={{ '&::before': { width: 0 } }}>
          <Typography variant='h6'>{heading}</Typography>
        </Divider>
        <Box
          display='flex'
          flexWrap='wrap'
          gap={1}
        >
          {pokemonArray.map(p =>
            <PokemonCard
              key={p.id}
              pokemon={p}
              height={150}
              disabled
            />
          )}
        </Box>
      </Box>
    );
  }

  return <Box
    display='flex'
    flexDirection='column'
    gap={1}
  >
    {groups}
  </Box>
}