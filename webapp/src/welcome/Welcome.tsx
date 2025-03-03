import Box from '@mui/material/Box';
import React, { useCallback, useContext } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Pokemon } from '../utils/types';
import { AccountContext } from '../utils/contexts/AccountContext';
import { updateAccountTrades } from '../utils/apis';
import { TopGradientContainer } from '../sharedComponents/layouts/TopGradientContainer';
import { useNavigate } from 'react-router-dom';
import { AccountStepContent } from './components/AccountStepContent';
import { PokemonStepContent } from './components/PokemonStepContent';
import { MyModal } from '../sharedComponents/MyModal';

type StepInfo = {
  /** Label to show in stepper */
  label: string,
  /** Content to display when we are on that step */
  content: React.ReactNode,
}

type WelcomeProps = {
  /**
   * Map of all available pokemons
   */
  pokemons: Map<number, Pokemon>;
}
export default function Welcome(props: WelcomeProps) {
  const { account } = useContext(AccountContext);

  const navigate = useNavigate();
  /**
   * Add trades linked to an account
   */
  const addAccountTrades = async () => {
    if (!account) { return; }
    await updateAccountTrades(account.id, wishlist, listToTrade);
    navigate('/home');
  };

  /**
   * Handle updating wishlist and list for trading
   */
  const { pokemons } = props;
  const [pokemonToSwap, setPokemonToSwap] = React.useState(-1);
  const [wishlist, setWishlist] = React.useState(new Set<number>());
  const [listToTrade, setListToTrade] = React.useState(new Set<number>());
  const updateList = useCallback((pokemonList: Set<number>, pokemonId: number, isAdd: boolean) => {
    const newList = new Set(pokemonList);
    if (isAdd) { newList.add(pokemonId); }
    else { newList.delete(pokemonId); }
    return newList;
  },[]);
  const updateWishlist = (pokemonId: number, isAdd: boolean) => {
    if (!listToTrade.has(pokemonId)) {
      setWishlist((wishlist) => updateList(wishlist, pokemonId, isAdd));
    }
    else {
      openModal(pokemonId);
    }
  };
  const updateListToTrade = (pokemonId: number, isAdd: boolean) => {
    if (!wishlist.has(pokemonId)) {
      setListToTrade((listToTrade) => updateList(listToTrade, pokemonId, isAdd));
    }
    else {
      openModal(pokemonId);
    }
  };

  /**
   * Handle confirmation of swapping a Pokemon between wishlist and list for trading
   */
  const [modalOpen, setModalOpen] = React.useState(false);
  const openModal = useCallback((pokemonId: number) => {
    setPokemonToSwap(pokemonId);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, [])
  const swapPokemon = () => {
    if (listToTrade.has(pokemonToSwap)) {
      setListToTrade((listToTrade) => updateList(listToTrade, pokemonToSwap, false));
      setWishlist((wishlist) => updateList(wishlist, pokemonToSwap, true));
    }
    else if (wishlist.has(pokemonToSwap)) {
      setWishlist((wishlist) => updateList(wishlist, pokemonToSwap, false));
      setListToTrade((listToTrade) => updateList(listToTrade, pokemonToSwap, true));
    }
    closeModal();
  };

  /**
   * Handle moving between stepper content
   */
  const [activeStep, setActiveStep] = React.useState(0);
  const handleSteps = (isNext: boolean) => {
    if (!isNext) {
      if (activeStep > 0) { // move back
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      }
    }
    else {
      if (activeStep < steps.length-1) { // move forward
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      else if (activeStep === steps.length-1) {
        if (wishlist.size === 0) {
          setActiveStep(1);
        }
        else {
          addAccountTrades();
        }
      }
    }
  };

  const steps: StepInfo[] = [
    {
      label: 'Link Account',
      content: <AccountStepContent handleSteps={handleSteps} isFirstStep />
    },
    {
      label: 'Add to Wishlist',
      content: <PokemonStepContent
        pokemons={pokemons}
        pokemonList={wishlist}
        updatePokemonIds={updateWishlist}
        handleSteps={handleSteps}
      />
    },
    {
      label: 'List for Trading',
      content: <PokemonStepContent
        pokemons={pokemons}
        pokemonList={listToTrade}
        updatePokemonIds={updateListToTrade}
        handleSteps={handleSteps}
        isLastStep
      />
    }
  ];

  return <>
    <TopGradientContainer flexDirection='column'>
      <Stepper 
        activeStep={activeStep}
        sx={{
          alignSelf: 'center',
          width: {xs: '100%', sm: '90%', md: '65%'},
          mb: 2,
          pt: 4
        }}
      >
        {steps.map((step, index) => 
          <Step key={index} completed={activeStep > index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        )}
      </Stepper>
      { steps[activeStep].content }
    </TopGradientContainer>
    <MyModal
      id='confirmlistswap'
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      sxProps={{ width: { xs: 300, sm: 400 } }}
    >
      <Typography id="modal-confirmlistswap-title" variant="h6" component="h2">
          Confirm Swap
        </Typography>
        <Typography id="modal-confirmlistswap-desc" sx={{ mt: 2 }}>
          {
            `This Pokémon is currently in your ` +
            (wishlist.has(pokemonToSwap) ? 'Wishlist' : 'List for Trading') +
            `. Are you sure you want to swap it over to ` +
            (wishlist.has(pokemonToSwap) ? 'List for Trading' : 'Wishlist') +
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
