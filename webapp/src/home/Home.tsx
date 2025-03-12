import { TopGradientContainer } from '../sharedComponents/layouts/TopGradientContainer';
import { AccountToPokemon, CardToAccount, Pokemon, TradeWithAccount } from '../utils/types';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from 'react';
import { useFetchAccountTradeMatches } from '../utils/hooks/useFetchAccountTradeMatches';
import { AccountContext } from '../utils/contexts/AccountContext';
import { PokemonCard } from '../sharedComponents/PokemonCard';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { MyAppBar } from '../sharedComponents/surfaces/MyAppBar';
import Downtime from '../sharedComponents/pages/Downtime';
import { EditLocationState } from '../edit/PokemonEdit';
import { getPokemonShortName } from '../utils/utils';
import SendMessageButton from './components/SendMessageButton';
import Divider from '@mui/material/Divider';
import HelpIconWithPopover from './components/HelpIconWithPopover';

type OfferedPokemonProps = {
  pokemon: Pokemon;
  isMatching?: boolean
}
const OfferedPokemon = (props: OfferedPokemonProps) => <Box sx={{
  height: '30%',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 1,
  px: 1,
  bgcolor: props.isMatching ? 'success.main' : 'warning.main',
}}>
  <Typography noWrap>
    {getPokemonShortName(props.pokemon)}
  </Typography>  
</Box>

type HomeProps = {
  /**
   * Map of all available pokemons
   */
  pokemons: Map<number, Pokemon>;
}
export default function Home(props: HomeProps) {
  const { account } = useContext(AccountContext);
  const navigate = useNavigate();

  /**
   * Data to show here
   */
  const { pokemons } = props;
  const [cardToAccount, setCardToAccount] = useState<CardToAccount>(new Map());
  const [accountToPokemon, setAccountToPokemon] = useState<AccountToPokemon>(new Map());
  // Wishlist will be sorted by numbers of matching trades and if that's the same, order by number of other trades found
  const wishlist = Array.from(cardToAccount.keys()).sort((pokeA, pokeB) => {
    const pokeAVal = cardToAccount.get(pokeA)!;
    const pokeBVal = cardToAccount.get(pokeB)!;
    const matchingTradesDiff = pokeBVal.matchingTrades.length - pokeAVal.matchingTrades.length;
    return matchingTradesDiff !== 0 ? matchingTradesDiff : pokeBVal.otherTrades.length-pokeAVal.otherTrades.length;
  });

  /**
   * Selected Pokemon and its trades
   */
  const [selectedPokemonId, setSelectedPokemonId] = useState<number>(-1);
  const selectedPokemon = pokemons.get(selectedPokemonId);
  // Selected Pokemon's trades will be sorted by update chronologically
  const sortTrades = (tradeA: TradeWithAccount, tradeB: TradeWithAccount) => {
    if (tradeA.updated === tradeB.updated) return 0;
    return tradeA.updated > tradeB.updated ? 1 : -1;
  };
  const trades = cardToAccount.get(selectedPokemonId);
  const selectedTrades = trades ? [
    ...trades.matchingTrades.sort(sortTrades),
    ...trades.otherTrades.sort(sortTrades)
  ] : [];

  const editWishlist = () => {
      const locationState: EditLocationState = {
        initialTab: 0
      }
      navigate('/pokemonedit', { state: locationState });
  }

  const { accountTradeMatches, accountTradeMatchesError } = useFetchAccountTradeMatches(account?.id);
  useEffect(() => {
    if (accountTradeMatches) {
      setCardToAccount(accountTradeMatches.cardToAccount);
      setAccountToPokemon(accountTradeMatches.accountToPokemon);
    }
  },[accountTradeMatches]);
  
  if (accountTradeMatchesError) {
    return <Downtime />
  }

  return (
    <TopGradientContainer direction="column">
      <MyAppBar />
      <Box flexGrow={1} display='flex' flexDirection='column' sx={{ mx: 1 }}>
        <Box display='flex' my={1}>
          <Box flex='1 1 auto' display='flex' alignItems='center'>
            <Typography variant='h6'>Your Wishlist</Typography>
            <HelpIconWithPopover
              popoverId='wishlist-popover'
              popoverContent={
                `Select the Pokémon in your wishlist you would like to search for offers. ` +
                `If you do not see a Pokémon here, go and update your wishlist.`
              }
            />
          </Box>
          <Button
            variant='contained'
            onClick={editWishlist}
          >
            Update Wishlist
          </Button>
        </Box>
        <Paper elevation={8} sx={{
          height: 245,
          p: 1,
          pt: 2,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          overflowX: 'auto',
        }}>
          {wishlist.length === 0 ? 
            <Typography variant='h6' color='info' sx={{
              alignSelf: 'center',
              mx: 'auto'
            }}>
              Your wishlist is empty. If you want to see what offers there are out there, update your wishlist.
            </Typography> : 
            wishlist.map(id => {
            const selected = id === selectedPokemonId;
            const tradeInfo = cardToAccount.get(id)!;
            const numTrades = tradeInfo.matchingTrades.length+tradeInfo.otherTrades.length;
            return <PokemonCard
              key={id}
              pokemon={pokemons.get(id)!}
              height={200}
              onClick={() => setSelectedPokemonId(id)} 
              disabled={selected || numTrades === 0}
              showOverlay={selected || numTrades === 0}
              overlayIcon={numTrades > 0 ? <CheckCircleIcon fontSize="large" color="success"/> : undefined}
              badgeContent={numTrades}
            />
          })}
        </Paper>
        { !!selectedPokemon &&
          <Box display='flex' alignItems='center' py={1}>
            <Typography variant='h6'>Offers for {selectedPokemon.name}</Typography>
            <HelpIconWithPopover
              popoverId='selected-pokemon-popover'
              popoverContent={
                `See all offers for the Pokémon you've selected. ` +
                `For each account, you will see what Pokémons the user wants in exchange. ` +
                `Pokémons in green are ones that you are offering while Pokémons in orange are ones that you are not offering.`
              }
            />
          </Box>
        }
        <Box sx={{
          flex: '1 1 auto',
          mb: 2,
          minHeight: 200
        }}>
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
                    const requestedMatchingTrades = !requestedPokemonObj ? [] : 
                      requestedPokemonObj.matchingTrades.map(id => pokemons.get(id)!).filter(p => p.rarityId === selectedPokemon.rarityId);
                    const requestedOtherTrades = !requestedPokemonObj ? [] : 
                      requestedPokemonObj.otherTrades.map(id => pokemons.get(id)!).filter(p => p.rarityId === selectedPokemon.rarityId);
                    return (
                      <Paper variant="outlined" sx={{
                        ...style,
                        display: 'flex',
                        p: 1,
                      }}>
                        <Box 
                          display='flex'
                          flexDirection='column'
                          flex='0 0 150px'
                          gap={1}
                        >
                          <Typography textAlign='center'>{selectedAccount.user.username}</Typography>
                          <SendMessageButton account={selectedAccount} pokemon={selectedPokemon} />
                        </Box>
                        <Divider orientation='vertical' sx={{mx: 1}} />
                        <Box height='100%' display='flex' flexWrap='wrap' alignContent='flex-start' gap={1} overflow='hidden'>
                          {
                            (requestedMatchingTrades.length + requestedOtherTrades.length) === 0 ? 
                            <Typography>No Pokémon listed for trade</Typography> :
                            <>
                              {[
                                ...requestedMatchingTrades.map(pokemon => (
                                  <OfferedPokemon key={pokemon.id} pokemon={pokemon} isMatching />
                                )),
                                ...requestedOtherTrades.map(pokemon => (
                                  <OfferedPokemon key={pokemon.id} pokemon={pokemon} />
                                ))
                              ]}
                            </>
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
      </Box>
    </TopGradientContainer>
  );
}
