import Box from '@mui/material/Box';
import { useFetchAccountTrades } from '../../utils/hooks/useFetchAccountTrades';
import { useContext, useState } from 'react';
import { AccountContext } from '../../utils/contexts/AccountContext';
import { TradeTypes } from '../../utils/constants';
import { Pokemon } from '../../utils/types';
import PokemonList from './PokemonList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { CustomTabPanel, TabA11yProps } from '../../sharedComponents/CustomTabPanel';

type MyListsProps = {
  pokemons: Map<number, Pokemon>;
}
export default function MyLists(props: MyListsProps) {
  const { account } = useContext(AccountContext);

  const tabPrefix = `pokemonlist-tab`;
  const [tabIndex, setTabIndex] = useState(0);
  const switchTab = (_event: React.SyntheticEvent, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const { pokemons } = props;
  const { accountTrades } = useFetchAccountTrades(account?.id);
  const wishlist = accountTrades.filter(t => t.tradeTypeId === TradeTypes.Request).map(t => t.pokemonId);
  const listForTrade = accountTrades.filter(t => t.tradeTypeId === TradeTypes.Offer).map(t => t.pokemonId);

  return <Card variant='outlined' sx={{
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  }}>
    <CardContent>
      <Box sx={{ display: 'flex' }}>
        <Tabs
          value={tabIndex}
          onChange={switchTab} 
          aria-label='pokemon list tabs'
        >
          <Tab label='Wishlist' {...TabA11yProps(tabPrefix, 0)} />
          <Tab label='List for Trading' {...TabA11yProps(tabPrefix, 1)} />
        </Tabs>
        <Box flex='1 1 auto' />
        <Button variant='contained' color='primary'>
          Edit List
        </Button>
      </Box>
      <Box>
        <CustomTabPanel prefix={tabPrefix} value={tabIndex} index={0}>
          <PokemonList
            pokemons={pokemons}
            selectedList={wishlist}
          />
        </CustomTabPanel>
        <CustomTabPanel prefix={tabPrefix} value={tabIndex} index={1}>
          <PokemonList
            pokemons={pokemons}
            selectedList={listForTrade}
          />
        </CustomTabPanel>
      </Box>
    </CardContent>
  </Card>
}
