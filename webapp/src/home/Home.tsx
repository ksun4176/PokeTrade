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
import { useNavigate } from 'react-router-dom';
import { MyAppBar } from '../sharedComponents/MyAppBar';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';

type HomeProps = {
  pokemons: Map<number, Pokemon>;
}
export default function Home(props: HomeProps) {
  const { account } = useContext(AccountContext);
  const navigate = useNavigate();
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
  
  const [wishlistHelpAnchorEl, setWishlistHelpAnchorEl] = useState<HTMLElement | null>(null);
  const handleWishlistHelpOpen = (event: React.MouseEvent<HTMLElement>) => {
    setWishlistHelpAnchorEl(event.currentTarget);
  };
  const handleWishlistHelpClose = () => {
    setWishlistHelpAnchorEl(null);
  };

  const editWishlist = () => {
    navigate('/edit', { state: { activeStep: 1 } });
  }

  useEffect(() => {
    let ignore = false;
    if (!account) {
      navigate('/edit');
    }
    else {
      getAccountTradeMatches(account.id)
        .then(({ cardToAccount, accountToPokemon }) => {
          if (!ignore) {
            if (cardToAccount.size === 0) {
              navigate('/edit');
            }
            else {
              setCardToAccount(cardToAccount);
              setAccountToPokemon(accountToPokemon);
            }
          }
        })
        .catch(error => {
          console.error(error);
        })
    }
    return () => {
      ignore = true;
    };
  },[account, navigate]);
  
  return (
    <TopGradientContainer direction="column">
      <MyAppBar />
      <Box display='flex' mx ={1} mt={1}>
        <Box flex='1 1 auto' display='flex' alignItems='center'>
          <Typography variant='h6'>Your Wishlist</Typography>
          <IconButton
            color='info' 
            aria-owns={!!wishlistHelpAnchorEl ? 'wishlist-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handleWishlistHelpOpen}
            onMouseLeave={handleWishlistHelpClose}
          >
            <HelpOutlineIcon />
          </IconButton>
          <Popover
            id="wishlist-popover"
            sx={{ pointerEvents: 'none' }}
            open={!!wishlistHelpAnchorEl}
            anchorEl={wishlistHelpAnchorEl}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            onClose={handleWishlistHelpClose}
          >
            <Typography component='pre' sx={{ p: 1 }}>
              {`Select the Pokémon in your wishlist you would like to search for offers.\nIf you do not see a Pokémon here, go and update your wishlist.`}
            </Typography>
          </Popover>
        </Box>
        <Button
          variant='contained'
          onClick={editWishlist}
        >
          Update Wishlist
        </Button>
      </Box>
      <Paper elevation={24} sx={{
        mx: 1,
        height: 245,
        p: 1,
        pt: 2,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        overflowX: 'auto',
      }}>
        {wishlist.map(id => {
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
        <Typography variant='h6' width='100%' p={1}>Offers for {selectedPokemon.name}</Typography>
      }
      <Box sx={{
        flex: '1 1 auto',
        mx: 1,
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
                              <CardContent sx={{
                                p: 1,
                                ':last-child': {
                                  p: 1
                                }
                              }}>
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
