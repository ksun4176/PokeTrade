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
import { useNavigate } from 'react-router-dom';

type TabInfo = {
  /** Label to show in tab */
  label: string,
  /** Content to display when we are on that tab */
  content: React.ReactNode,
}

type MyListsProps = {
  /**
   * Map of all available pokemons
   */
  pokemons: Map<number, Pokemon>;
}
export default function MyLists(props: MyListsProps) {
  const { account } = useContext(AccountContext);
  const navigate = useNavigate();

  const editList = () => {
    navigate('/edit', { state: { activeStep: tabIndex+1 } });
  }

  /**
   * Wishlist and list for trading
   */
  const { pokemons } = props;
  const { accountTrades } = useFetchAccountTrades(account?.id);
  const wishlist = accountTrades.filter(t => t.tradeTypeId === TradeTypes.Request).map(t => t.pokemonId);
  const listForTrade = accountTrades.filter(t => t.tradeTypeId === TradeTypes.Offer).map(t => t.pokemonId);

  /**
   * Handle moving between tab content
   */
  const tabPrefix = `pokemonlist-tab`;
  const [tabIndex, setTabIndex] = useState(0);
  const switchTab = (_event: React.SyntheticEvent, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };
  
  const tabs: TabInfo[] = [
    {
      label: 'Wishlist',
      content: <PokemonList
        pokemons={pokemons}
        selectedList={wishlist}
      />
    },
    {
      label: 'List for Trading',
      content: <PokemonList
        pokemons={pokemons}
        selectedList={listForTrade}
      />
    }
  ];

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
        <Button
          variant='contained'
          color='primary'
          onClick={editList}
        >
          Edit List
        </Button>
      </Box>
      <Box>
        <CustomTabPanel prefix={tabPrefix} index={tabIndex}>
          {tabs[tabIndex].content}
        </CustomTabPanel>
      </Box>
    </CardContent>
  </Card>
}
