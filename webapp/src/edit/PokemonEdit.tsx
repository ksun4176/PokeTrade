import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Pokemon } from "../utils/types";
import { Location, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AccountContext } from "../utils/contexts/AccountContext";
import { CustomTabs, TabInfo } from "../sharedComponents/layouts/CustomTabs";
import EditContainer from "./components/EditContainer";
import { updateAccountTrades } from "../utils/apis";
import { useFetchAccountTrades } from "../utils/hooks/useFetchAccountTrades";
import { TradeTypes } from "../utils/constants";
import Downtime from "../sharedComponents/pages/Downtime";
import { MyModal } from "../sharedComponents/MyModal";
import { EditPokemonList } from "./components/EditPokemonList";
import Typography from "@mui/material/Typography";

export type EditLocationState = {
  /**
   * The tab we are initially going for 
   */
  initialTab?: number
};
type PokemonEditProps = {
  /**
   * Map of all available pokemons
   */
  pokemons: Map<number, Pokemon>;
}
export default function PokemonEdit(props: PokemonEditProps) {
  const { account } = useContext(AccountContext);
  const navigate = useNavigate();
  const location: Location<EditLocationState | undefined> = useLocation();

  /**
   * Handle updating wishlist and list for trading
   */
  const { pokemons } = props;
  const [wishlist, setWishlist] = useState(new Set<number>());
  const [listToTrade, setListToTrade] = useState(new Set<number>());
  const updateList = useCallback((pokemonList: Set<number>, pokemonId: number, isAdd: boolean) => {
    const newList = new Set(pokemonList);
    if (isAdd) newList.add(pokemonId);
    else newList.delete(pokemonId);
    return newList;
  },[]);
  const updateWishlist = (pokemonId: number, isAdd: boolean) => {
    if (isAdd && listToTrade.has(pokemonId)) {
      openModal(pokemonId);
    }
    else {
      setWishlist((wishlist) => updateList(wishlist, pokemonId, isAdd));
    }
  };
  const updateListToTrade = (pokemonId: number, isAdd: boolean) => {
    if (isAdd && wishlist.has(pokemonId)) {
      openModal(pokemonId);
    }
    else {
      setListToTrade((listToTrade) => updateList(listToTrade, pokemonId, isAdd));
    }
  };
  /**
     * Handle confirmation of swapping a Pokemon between wishlist and list for trading
     */
  const pokemonToSwap = useRef(-1);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback((pokemonId: number) => {
    pokemonToSwap.current = pokemonId;
    setModalOpen(true);
  },[]);
  const closeModal = useCallback(() => {
    setModalOpen(false);
  },[]);
  const swapPokemon = () => {
    if (listToTrade.has(pokemonToSwap.current)) {
      setListToTrade((listToTrade) => updateList(listToTrade, pokemonToSwap.current, false));
      setWishlist((wishlist) => updateList(wishlist, pokemonToSwap.current, true));
    }
    else if (wishlist.has(pokemonToSwap.current)) {
      setWishlist((wishlist) => updateList(wishlist, pokemonToSwap.current, false));
      setListToTrade((listToTrade) => updateList(listToTrade, pokemonToSwap.current, true));
    }
    closeModal();
  };

  /**
   * Add trades linked to an account
   */
  const addAccountTrades = async () => {
    if (!account) { return; }
    await updateAccountTrades(account.id, wishlist, listToTrade);
    navigate(-1);
  };

  const [initialTab, setInitialTab] = useState(0);
  const tabsLabel = `pokemon list tabs`;
  const tabPrefix = `pokemonlist-tab`;
  const tabs: TabInfo[] = [
    {
      label: 'Wishlist',
      content: <EditPokemonList
        pokemons={pokemons}
        selectedPokemons={wishlist}
        updatePokemonIds={updateWishlist}
      />
    },
    {
      label: 'List for Trading',
      content: <EditPokemonList
        pokemons={pokemons}
        selectedPokemons={listToTrade}
        updatePokemonIds={updateListToTrade}
      />
    }
  ];

  const [resetNum, setResetNum] = useState(0);
  const resetLists = () => setResetNum(oldNum => oldNum+1);
  
  const { accountTrades, accountTradesError } = useFetchAccountTrades(account?.id);
  useEffect(() => {
    setWishlist(new Set(accountTrades.filter(t => t.tradeTypeId === TradeTypes.Request).map(t => t.pokemonId)));
    setListToTrade(new Set(accountTrades.filter(t => t.tradeTypeId === TradeTypes.Offer).map(t => t.pokemonId)));
  }, [accountTrades, resetNum]);

  useEffect(() => {
    const initialTab = location.state?.initialTab;
    if (initialTab !== undefined
      && initialTab >= 0 && initialTab < tabs.length) {
      setInitialTab(initialTab);
    }
  }, [location.state, tabs.length])

  if (accountTradesError) {
    return <Downtime />
  }

  return <>
    <EditContainer
      onResetButtonClicked={resetLists}
      onSaveButtonClicked={addAccountTrades}
    >
      <CustomTabs 
        tabPrefix={tabPrefix}
        tabs={tabs}
        initialTabIndex={initialTab}
        aria-label={tabsLabel}
      />
    </EditContainer>
    <MyModal
      id='modal-confirm-swap-title'
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
    >
      <Typography id="modal-confirmlistswap-title" variant="h6" component="h2">
        Confirm Swap
      </Typography>
      <Typography id="modal-confirmlistswap-desc" sx={{ mt: 2 }}>
        {
          `This Pokémon is currently in your ` +
          (wishlist.has(pokemonToSwap.current) ? 'Wishlist' : 'List for Trading') +
          `. Are you sure you want to swap it over to ` +
          (wishlist.has(pokemonToSwap.current) ? 'List for Trading' : 'Wishlist') +
          ` instead?`
        }
      </Typography>
      <Box display='flex' mt={2}>
        <Box flex='1 1 auto' />
        <Button variant='contained' color='success' sx={{ mr: 1 }} onClick={swapPokemon}>Confirm</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </Box>
    </MyModal>
  </>
          
}






