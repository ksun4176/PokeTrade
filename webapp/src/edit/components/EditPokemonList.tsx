import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { forwardRef, JSX, useEffect, useState } from "react";
import { PokemonCard } from "../../sharedComponents/PokemonCard";
import { Pokemon } from "../../utils/types";
import { FixedSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { FormControl, IconButton, Input, useMediaQuery } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

type Filter = {
  codeOrName: string;
}

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
  const widthForResize = useMediaQuery(`(max-width: 480px)`);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [filters, setFilters] = useState<Filter>({
    codeOrName: ''
  });

  useEffect(() => {
    let pokemonsArray = Array.from(pokemons.values());
    if (filters.codeOrName.length > 0) {
      const codeOrName = filters.codeOrName.toLowerCase();
      pokemonsArray = pokemonsArray.filter(pokemon => 
        pokemon.dexId.toString().startsWith(codeOrName) || pokemon.name.toLowerCase().startsWith(codeOrName)
      );
    }
    setFilteredPokemons(pokemonsArray);
  }, [pokemons, filters]);

  return <Box flex='1 1 auto' display='flex' flexDirection='column' overflow='auto'>
    <Paper elevation={8} sx={{
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
      zIndex: 1,
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
    <Box sx={{ flex: '1 1 auto', mb: 1 }}>
      {/* Data Virtualization around the Pokemon cards */}
      <AutoSizer>
        {({ height, width }: { height: number, width: number }) => {
          const numPokemons = filteredPokemons.length;
          const cardHWProportion = 683 / 490; // pokemon card height x width proportion
          const pokemonGap = 4; // px gap between cards
          let pokemonHeight = 200;
          if (widthForResize) {
            // if we can no longer fit 3 cards in a row, start shrinking the cards to the minimum of 150
            pokemonHeight = Math.max(Math.floor((width / 3 - pokemonGap * 2) * cardHWProportion), 150);
          }
          const pokemonWidth = (pokemonHeight / cardHWProportion) + pokemonGap;  
          const itemsPerRow = Math.floor(width / pokemonWidth);
          const rowCount = Math.ceil(numPokemons / itemsPerRow);
          // styling to add padding for search bar
          const paddingTop = 40;
          const innerElementType = forwardRef<HTMLElement, any>(({ style, ...rest }, ref) => (
            <Box
              ref={ref}
              style={{
                ...style,
                paddingTop: pokemonGap,
                height: `${parseFloat(style.height as string) + paddingTop}px`
              }}
              {...rest}
            />
          ));

          return (
            <FixedSizeList
              height={height}
              width={width}
              itemCount={rowCount}
              itemSize={pokemonHeight}
              innerElementType={innerElementType}
            >
              {({ index, style }) => {
                const items: JSX.Element[] = [];
                const fromIndex = index * itemsPerRow;
                const toIndex = Math.min(fromIndex + itemsPerRow, numPokemons);

                for (let i = fromIndex; i < toIndex; i++) {
                  items.push(
                    <PokemonCard
                      key={filteredPokemons[i].id}
                      pokemon={filteredPokemons[i]}
                      height={pokemonHeight} 
                      onClick={() => updatePokemonIds(filteredPokemons[i].id, true)} 
                      disabled={selectedPokemons.has(filteredPokemons[i].id)}
                      showOverlay={selectedPokemons.has(filteredPokemons[i].id)}
                    />
                  )
                }
                const top = `${parseFloat(style.top as string) + pokemonGap + paddingTop}px`;
                const height = `${parseFloat(style.height as string) - pokemonGap}px`;
                return (
                  <Box
                    key={index}
                    display='flex'
                    justifyContent='flex-start'
                    gap={`${pokemonGap}px`}
                    sx={{
                      ...style,
                      top,
                      height
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
      <Paper elevation={4} square sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        marginInline: 'auto',
        py: 1,
        px: 2,
        borderStyle: 'hidden',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        width: { xs: '80%', sm: '40ch' },
        display: 'flex',
        flexWrap: 'nowrap',
      }}>
        <FormControl sx={{ flexGrow: 1 }}>
          <Input
            size='small'
            id='search'
            placeholder='Name or Card number'
            value={filters.codeOrName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilters(oldFilters => ({
                ...oldFilters,
                codeOrName: event.target.value
              }))
            }}
            inputProps={{
              'aria-label': 'search',
            }}
          />
        </FormControl>
        <IconButton aria-label='filter' size='small'>
          <SearchRoundedIcon fontSize='small' />
        </IconButton>
      </Paper>
    </Box>
  </Box>
}