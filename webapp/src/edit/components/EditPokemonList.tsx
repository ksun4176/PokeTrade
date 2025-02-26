import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import React, { JSX } from "react";
import { PokemonCard } from "../../sharedComponents/PokemonCard";
import { Pokemon } from "../../utils/types";
import { FixedSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export interface IEditPokemonListProps {
  /**
   * Map of all available pokemons
   */
  pokemons: Map<number, Pokemon>;
  /**
   * The list of pokemons we are editing
   */
  selectedPokemons: Set<number>;
  /**
   * Update the list of selected pokemons
   * @param id ID of pokemon
   * @param isAdd Whether this update is adding to list or removing
   */
  updatePokemonIds: (id: number, isAdd: boolean) => void;
}
/**
 * The input for editing a list of Pokemons
 */
export class EditPokemonList extends React.Component<IEditPokemonListProps> {
  override render() {
    const { pokemons, selectedPokemons, updatePokemonIds } = this.props;
    const pokemonsArray = Array.from(pokemons.values());
    const numPokemons = pokemonsArray.length;
    const pokemonsHeight = 200;
    const pokemonsGap = 4;
    const pokemonsWidth = (pokemonsHeight / 683 * 490) + pokemonsGap; // 683 * 490 is image size of card

    return <Box flex='1 1 auto' display='flex' flexDirection='column' overflow='auto'>
      <Paper elevation={24} sx={{
        height: {xs: 185, sm: 345 },
        p: 1,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        gap: '4px',
        overflowX: 'auto',
        mx: 2
      }}>
        {Array.from(selectedPokemons).map(id =>
          <PokemonCard 
            key={id}
            pokemon={pokemons.get(id)!}
            height={150}
            onClick={() => updatePokemonIds(id, false)}
          />
        )}
      </Paper>
      <Box m={1} sx={{ flex: '1 1 auto', mx: 2 }}>
        {/* Data Virtualization around the Pokemon cards */}
        <AutoSizer>
          {({ height, width }: { height: number, width: number }) => {
            const itemsPerRow = Math.floor(width / pokemonsWidth);
            const rowCount = Math.ceil(numPokemons / itemsPerRow);

            return (
              <FixedSizeList
                height={height}
                width={width}
                itemCount={rowCount}
                itemSize={pokemonsHeight + pokemonsGap}
              >
                {({ index, style }) => {
                  const items: JSX.Element[] = [];
                  const fromIndex = index * itemsPerRow;
                  const toIndex = Math.min(fromIndex + itemsPerRow, numPokemons);

                  for (let i = fromIndex; i < toIndex; i++) {
                    items.push(
                      <PokemonCard
                        key={pokemonsArray[i].id}
                        pokemon={pokemonsArray[i]}
                        height={pokemonsHeight} 
                        onClick={() => updatePokemonIds(pokemonsArray[i].id, true)} 
                        disabled={selectedPokemons.has(pokemonsArray[i].id)}
                        showOverlay={selectedPokemons.has(pokemonsArray[i].id)}
                      />
                    )
                  }

                  return (
                    <Box
                      key={index}
                      display='flex'
                      justifyContent='flex-start'
                      gap={`${pokemonsGap}px`}
                      sx={{
                        ...style,
                        height: pokemonsHeight
                      }}
                    >
                      {items}
                    </Box>
                  )
                }}
              </FixedSizeList>
            )
          }}
        </AutoSizer>
      </Box>
    </Box>
  }
}