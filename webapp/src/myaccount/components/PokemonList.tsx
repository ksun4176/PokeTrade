import { Pokemon } from "../../utils/types";
import Box from "@mui/material/Box";
import { PokemonCard } from "../../sharedComponents/PokemonCard";

type PokemonListProps = {
  pokemons: Map<number, Pokemon>;
  selectedList: number[];
}
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