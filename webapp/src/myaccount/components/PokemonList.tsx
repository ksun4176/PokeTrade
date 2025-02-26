import { Pokemon } from "../../utils/types";
import Box from "@mui/material/Box";
import { PokemonCard } from "../../sharedComponents/PokemonCard";

type PokemonListProps = {
  /**
   * Map of all available pokemons
   */
  pokemons: Map<number, Pokemon>;
  /**
   * List of Pokemons to show
   */
  selectedList: number[];
}
/**
 * List of Pokemons
 */
export default function PokemonList(props: PokemonListProps) {
  const { pokemons, selectedList } = props;
  return <Box sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
  }}>
    {selectedList.map(id =>
      <PokemonCard 
        key={id}
        pokemon={pokemons.get(id)!}
        height={150}
        disabled
      />
    )}
  </Box>
}