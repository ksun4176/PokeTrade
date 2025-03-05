import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { JSX } from "react";
import { PokemonCard } from "../../sharedComponents/PokemonCard";
import { Pokemon } from "../../utils/types";
import { FixedSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useMediaQuery } from "@mui/material";

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
export const EditPokemonList = function(props:IEditPokemonListProps) {
  const { pokemons, selectedPokemons, updatePokemonIds } = props;
  const widthForResize = useMediaQuery(`(max-width: 500px)`);
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
    <Box sx={{ flex: '1 1 auto', my: 1 }}>
      {/* Data Virtualization around the Pokemon cards */}
      <AutoSizer>
        {({ height, width }: { height: number, width: number }) => {
          const pokemonsArray = Array.from(pokemons.values());
          const numPokemons = pokemonsArray.length;
          const cardHWProportion = 683 / 490; // pokemon card height x width proportion
          const pokemonsGap = 4; // px gap between cards
          let pokemonsHeight = 200;
          if (widthForResize) {
            // if we can no longer fit 3 cards in a row, start shrinking the cards to the minimum of 150
            pokemonsHeight = Math.max(Math.floor((width / 3 - pokemonsGap) * cardHWProportion), 150);
          }
          const pokemonsWidth = (pokemonsHeight / cardHWProportion) + pokemonsGap;  
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