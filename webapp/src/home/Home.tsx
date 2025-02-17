import { TopGradientContainer } from '../sharedComponents/TopGradientContainer';
import { AccountToPokemon, CardToAccount, Pokemon, TradeWithAccount } from '../utils/types';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from 'react';
import { getAccountTradeMatches } from '../utils/apis';
import { AccountContext } from '../utils/contexts/AccountContext';
import { PokemonCard } from '../sharedComponents/PokemonCard';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AccountCard from './components/AccountCard';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type HomeProps = {
  pokemons: Map<number, Pokemon>;
}
export default function Home(props: HomeProps) {
  const { account } = useContext(AccountContext);
  const { pokemons } = props;
  const [cardToAccount, setCardToAccount] = useState<CardToAccount>(new Map());
  const [accountToPokemon, setAccountToPokemon] = useState<AccountToPokemon>(new Map());
  const wishlist = Array.from(cardToAccount.keys()).sort((pokeA, pokeB) => {
    const pokeAVal = cardToAccount.get(pokeA)!;
    const pokeBVal = cardToAccount.get(pokeB)!;
    // order by number of matching trades found and if that's the same, order by number of other trades found
    const matchingTradesDiff = pokeBVal.matchingTrades.length - pokeAVal.matchingTrades.length;
    return matchingTradesDiff !== 0 ? matchingTradesDiff : pokeBVal.otherTrades.length-pokeAVal.otherTrades.length;
  });

  const [selectedPokemonId, setSelectedPokemonId] = useState<number>(-1);
  const selectedPokemon = pokemons.get(selectedPokemonId);
  const sortTrades = (tradeA: TradeWithAccount, tradeB: TradeWithAccount) => {
    if (tradeA.updated === tradeB.updated) return 0;
    return tradeA.updated > tradeB.updated ? 1 : -1;
  };
  const trades = cardToAccount.get(selectedPokemonId);
  const selectedTrades = trades ? [
    ...trades.matchingTrades.sort(sortTrades),
    ...trades.otherTrades.sort(sortTrades)
  ] : [];

  useEffect(() => {
    if (account) {
      getAccountTradeMatches(account.id)
        .then(({ cardToAccount, accountToPokemon }) => {
          setCardToAccount(cardToAccount);
          setAccountToPokemon(accountToPokemon);
        })
        .catch(error => {
          console.error(error);
        })
    }
  },[account]);
  
  return (
    <TopGradientContainer direction="column">
      {/* <AppBar /> */}
      <Box display='flex' m={1}>
        <Typography variant='h6'>Wishlist</Typography>
        <Box flex='1 1 auto' />
        <Button variant='contained'>Update Wishlist</Button>
      </Box>
      <Paper elevation={24} sx={{
        height: 245,
        p: 1,
        pt: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        gap: '4px',
        overflowX: 'auto',
      }}>
        {wishlist.map(id => {
          const tradeInfo = cardToAccount.get(id)!;
          return <PokemonCard
            key={id}
            pokemon={pokemons.get(id)!}
            height={200}
            onClick={() => setSelectedPokemonId(id)} 
            disabled={id === selectedPokemonId} 
            overlayIcon={<CheckCircleIcon fontSize="large" color="success"/>}
            badgeContent={tradeInfo.matchingTrades.length+tradeInfo.otherTrades.length}
          />
        })}
      </Paper>
      {!selectedPokemon ? null :
        <Typography variant='h6' width='100%'>Offers for {selectedPokemon.name}</Typography>
      }
      <Box mt={1} sx={{ flex: '1 1 auto' }}>
        <AutoSizer>
          {({ height, width }: { height: number, width: number }) => {
            if (!selectedPokemon) {
              return <Paper />
            }
            return <>
              <FixedSizeList
                height={height}
                width={width}
                itemCount={selectedTrades.length}
                itemSize={150}
              >
                {({ index, style }) => {
                  const selectedTrade = selectedTrades[index];
                  const selectedAccount = selectedTrade.account;
                  const requestedPokemonObj = accountToPokemon.get(selectedAccount.id);
                  const requestedPokemonIds = requestedPokemonObj ?
                    [...requestedPokemonObj?.matchingTrades, ...requestedPokemonObj?.otherTrades] : [];
                  const requestedPokemons = requestedPokemonIds.map(id => pokemons.get(id)!).filter(p => p.rarityId === selectedPokemon.rarityId);
                  return (
                    <Paper variant="outlined" sx={{
                      ...style,
                      display: 'flex',
                      p: 1,
                    }}>
                      <AccountCard account={selectedAccount} cardSx={{
                        flex: '0 0 250px',
                        mr: 1,
                      }} />
                      <Box height='100%' display='flex' flexWrap='wrap' alignContent='flex-start' gap={1} overflow='hidden'>
                        {
                          requestedPokemons.length === 0 ? 
                          <Typography>No Pokémon listed for trade</Typography> :
                          requestedPokemons.map(pokemon => (
                            <Card key={pokemon.id}
                              sx={{
                                height: '30%',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                              <CardContent>
                                <Typography>
                                  {pokemon.expansion.name} {pokemon.name}{pokemon.pokemonPostfix ? ` ${pokemon.pokemonPostfix.name}` : ``}
                                </Typography>
                              </CardContent>
                            </Card>
                          ))
                        }
                      </Box>
                    </Paper>
                  )
                }}
              </FixedSizeList>
            </>
          }}
        </AutoSizer>
      </Box>
    </TopGradientContainer>
  );
}
