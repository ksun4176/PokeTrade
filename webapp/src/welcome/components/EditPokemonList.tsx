import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import React from "react";
import { gray } from "../../sharedTheme/themePrimitives";

export interface IEditPokemonListProps {
  availablePokemons: Set<number>;
  selectedPokemons: Set<number>;
  updatePokemonIds: (id: number, isAdd: boolean) => void;
}
export class EditPokemonList extends React.Component<IEditPokemonListProps> {
  override render() {
    const { availablePokemons, selectedPokemons, updatePokemonIds } = this.props;
  
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
                {`Card #${id}`}
              </CardContent>
            </CardActionArea>
          </Card>
        )}
      </Paper>
      <Box p={1} display='flex' flexWrap='wrap' gap={1} overflow='auto' sx={{ flex: '1 1 auto' }}>
        {Array.from(availablePokemons).map((id) => 
          <Card sx={{ p: 0 }}>
            <CardActionArea disabled={selectedPokemons.has(id)} onClick={() => updatePokemonIds(id, true)}>
              <CardContent sx={{
                height: 200,
                width: 150,
                textAlign: 'center',
              }}>
                {`Card #${id}`}
              </CardContent>
              { !selectedPokemons.has(id) ? null : 
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