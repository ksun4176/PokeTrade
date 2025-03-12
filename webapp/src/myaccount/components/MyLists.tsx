import { useFetchAccountTrades } from '../../utils/hooks/useFetchAccountTrades';
import { useCallback, useContext, useRef, useState } from 'react';
import { AccountContext } from '../../utils/contexts/AccountContext';
import { TradeTypes } from '../../utils/constants';
import { Pokemon } from '../../utils/types';
import PokemonList, { GroupBy } from './PokemonList';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CustomTabs, TabInfo } from '../../sharedComponents/layouts/CustomTabs';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { EditLocationState } from '../../edit/PokemonEdit';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import Box from '@mui/material/Box';

type MyListsProps = {
  /**
   * Map of all available pokemons
   */
  pokemons: Map<number, Pokemon>;
}
export default function MyLists(props: MyListsProps) {
  const { account } = useContext(AccountContext);
  const tabIndex = useRef(0);
  const navigate = useNavigate();
  const [groupBy, setGroupBy] = useState(GroupBy.Expansion);

  const editList = () => {
    const locationState: EditLocationState = {
      initialTab: tabIndex.current
    }
    navigate('/pokemonedit', { state: locationState });
  }

  /**
   * Wishlist and list for trading
   */
  const { pokemons } = props;
  const { accountTrades } = useFetchAccountTrades(account?.id);
  const wishlist = accountTrades.filter(t => t.tradeTypeId === TradeTypes.Request).map(t => t.pokemonId);
  const listForTrade = accountTrades.filter(t => t.tradeTypeId === TradeTypes.Offer).map(t => t.pokemonId);

  const tabsLabel = `pokemon list tabs`;
  const tabPrefix = `pokemonlist-tab`;
  const tabs: TabInfo[] = [
    {
      label: 'Wishlist',
      content: <PokemonList
        pokemons={pokemons}
        selectedList={wishlist}
        groupBy={groupBy}
      />
    },
    {
      label: 'List for Trading',
      content: <PokemonList
        pokemons={pokemons}
        selectedList={listForTrade}
        groupBy={groupBy}
      />
    }
  ];
  const onTabChange = useCallback((index: number) => {
    tabIndex.current = index;
  }, []);
  const tabsHeadingContent = <Box
    flex='1 1 auto'
    display='flex'
    justifyContent='flex-end'
    alignItems='center'
  >
    <IconButton
      color='info'
      onClick={editList}
      sx={{ mr: 2 }}
    >
      <EditIcon />
    </IconButton>
    <Button
      variant='contained'
      size='small'
      startIcon={<SortIcon />}
      onClick={() => setGroupBy(value => value === GroupBy.Expansion ? GroupBy.Rarity : GroupBy.Expansion)}
    >
      {groupBy}
    </Button>
  </Box>;

  return <Card variant='outlined' sx={{
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  }}>
    <CardContent>
      <CustomTabs 
        tabPrefix={tabPrefix}
        tabs={tabs}
        onTabChange={onTabChange}
        tabsHeadingContent={tabsHeadingContent}
        aria-label={tabsLabel}
      />
    </CardContent>
  </Card>
}
