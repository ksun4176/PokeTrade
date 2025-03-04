import { useFetchAccountTrades } from '../../utils/hooks/useFetchAccountTrades';
import { useCallback, useContext, useRef } from 'react';
import { AccountContext } from '../../utils/contexts/AccountContext';
import { TradeTypes } from '../../utils/constants';
import { Pokemon } from '../../utils/types';
import PokemonList from './PokemonList';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CustomTabs, TabInfo } from '../../sharedComponents/layouts/CustomTabs';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

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

  const editList = () => {
    navigate('/pokemonedit');
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
  const onTabChange = useCallback((index: number) => {
    tabIndex.current = index;
  }, []);
  const tabsHeadingContent = <IconButton
    color='info'
    onClick={editList}
  >
    <EditIcon />
  </IconButton>;

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
