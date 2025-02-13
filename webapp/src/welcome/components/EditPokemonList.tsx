import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import React from "react";
import { PokemonCard } from "./PokemonCard";
import { Pokemon } from "../../utils/types";

export interface IEditPokemonListProps {
  pokemons: Map<number, Pokemon>;
  selectedPokemons: Set<number>;
  updatePokemonIds: (id: number, isAdd: boolean) => void;
}
export class EditPokemonList extends React.Component<IEditPokemonListProps> {
  override render() {
    const { pokemons, selectedPokemons, updatePokemonIds } = this.props;
  
    return <Box flex='1 1 auto' display='flex' flexDirection='column' overflow='auto'>
      <Paper elevation={24} sx={{
        height: {xs: 180, sm: 330 },
        p: 1,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        gap: 1,
        overflowX: 'auto'
      }}>
        {Array.from(selectedPokemons).map((id) =>
          <PokemonCard 
            pokemon={pokemons.get(id)!}
            height={150}
            onClick={() => updatePokemonIds(id, false)} />
        )}
      </Paper>
      <Box p={1} display='flex' flexWrap='wrap' gap={1} overflow='auto' sx={{ flex: '1 1 auto' }}>
        {Array.from(pokemons.values()).map(p =>
          <PokemonCard 
            pokemon={p}
            height={200}
            disabled={selectedPokemons.has(p.id)}
            onClick={() => updatePokemonIds(p.id, true)} />
        )}
      </Box>
    </Box>
  }
}