import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import React from "react";
import { gray } from "../../sharedTheme/themePrimitives";
import { pokemon_card_dex } from "@prisma/client";

export interface IEditPokemonListProps {
  pokemons: Map<number, pokemon_card_dex>;
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
          <Card sx={{ p: 0 }}>
            <CardActionArea onClick={() => updatePokemonIds(id, false)}>
              <CardContent sx={{
                height: 150,
                width: 100,
                textAlign: 'center',
              }}>
                {`[${id}] ${pokemons.get(id)?.name}`}
              </CardContent>
            </CardActionArea>
          </Card>
        )}
      </Paper>
      <Box p={1} display='flex' flexWrap='wrap' gap={1} overflow='auto' sx={{ flex: '1 1 auto' }}>
        {Array.from(pokemons.values()).map(p => 
          <Card sx={{ p: 0 }}>
            <CardActionArea disabled={selectedPokemons.has(p.id)} onClick={() => updatePokemonIds(p.id, true)}>
              <CardContent sx={{
                height: 200,
                width: 150,
                textAlign: 'center',
              }}>
                {`[${p.id}] ${p.name}`}
              </CardContent>
              { !selectedPokemons.has(p.id) ? null : 
                <Box sx={{
                  overflow: 'hidden',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  borderRadius: 'inherit',
                  opacity: .7,
                  backgroundColor: gray[900]
                }}/>
              }
            </CardActionArea>
          </Card>
        )}
      </Box>
    </Box>
  }
}