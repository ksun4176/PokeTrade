import Box from '@mui/material/Box';
import React, { JSX } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { StepContent } from './components/StepContent';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { gray } from '../sharedTheme/themePrimitives';
import Button from '@mui/material/Button';
import { Pokemon } from '../utils/types';

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: theme.spacing(4),
  width: 400,
  backgroundColor: gray[50],
  borderRadius: (theme.vars || theme).shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  boxShadow: 'none',
  ...theme.applyStyles('dark', {
    backgroundColor: gray[800],
  }),
}));

type StepInfo = {
  label: string,
  content: JSX.Element,
}

type WelcomeProps = {
  pokemons: Map<number, Pokemon>;
}
export default function Welcome(props: WelcomeProps) {
  const [activeStep, setActiveStep] = React.useState(0);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [pokemonToSwap, setPokemonToSwap] = React.useState(-1);

  const [wishlist, setWishlist] = React.useState(new Set<number>());
  const [listToTrade, setListToTrade] = React.useState(new Set<number>());

  const { pokemons } = props;

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
          setActiveStep(0);
        }
        else {
          console.log(`Finished!`);
        }
      }
    }
  }

  const updateList = (pokemonList: Set<number>, pokemonId: number, isAdd: boolean) => {
    const newList = new Set(pokemonList);
    if (isAdd) { newList.add(pokemonId); }
    else { newList.delete(pokemonId); }
    return newList;
  }
  const updateWishlist = (pokemonId: number, isAdd: boolean) => {
    if (!listToTrade.has(pokemonId)) {
      setWishlist((wishlist) => updateList(wishlist, pokemonId, isAdd));
    }
    else {
      openModal(pokemonId);
    }
  }
  const updateListToTrade = (pokemonId: number, isAdd: boolean) => {
    if (!wishlist.has(pokemonId)) {
      setListToTrade((listToTrade) => updateList(listToTrade, pokemonId, isAdd));
    }
    else {
      openModal(pokemonId);
    }
  }

  const openModal = (pokemonId: number) => {
    setPokemonToSwap(pokemonId);
    setModalOpen(true);
  }
  const closeModal = () => {
    setPokemonToSwap(-1);
    setModalOpen(false);
  }
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
  }

  const steps: StepInfo[] = [
    {
      label: 'Wishlist',
      content: <StepContent 
        pokemons={pokemons}
        selectedPokemons={wishlist}
        updateList={updateWishlist}
        handleSteps={handleSteps}
        isFirstStep
      />
    },
    {
      label: 'List for Trading',
      content: <StepContent 
        pokemons={pokemons}
        selectedPokemons={listToTrade}
        updateList={updateListToTrade}
        handleSteps={handleSteps}
        isLastStep
      />
    }
  ];

  return <>
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='flex-start'
      position='fixed'
      top={0}
      right={0}
      bottom={0}
      left={0}
    >
      <Typography
        variant='h6'
        component="h2"
        textAlign='center'
        paddingTop={1}
        paddingBottom={1}
      >
        Welcome to the PokéTrade!
      </Typography>
      <Stepper 
        activeStep={activeStep}
        sx={{
          alignSelf: 'center',
          width: {xs: '90%', sm: '75%', md: '50%'},
          mb: 2,
        }}
      >
        {steps.map((step, index) => 
          <Step key={index} completed={activeStep > index}>
            <StepLabel>{`Add to ${step.label}`}</StepLabel>
          </Step>
        )}
      </Stepper>
      { steps[activeStep].content }
    </Box>
    <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby="modal-confirmlistswap-title"
      aria-describedby="modal-confirmlistswap-desc"
    >
      <ModalContent sx={{ width: { xs: 300, sm: 400 } }}>
        <Typography id="modal-confirmlistswap-title" variant="h6" component="h2">
          Confirm Swap
        </Typography>
        <Typography id="modal-confirmlistswap-desc" sx={{ mt: 2 }}>
          {
            `This Pokémon is currently in your ` +
            (wishlist.has(pokemonToSwap) ? steps[0].label : steps[1].label) +
            `. Are you sure you want to swap it over to ` +
            (wishlist.has(pokemonToSwap) ? steps[1].label : steps[0].label) +
            ` instead?`
          }
        </Typography>
        <Box display='flex' mt={2}>
          <Box flex='1 1 auto' />
          <Button variant='contained' color='success' sx={{ mr: 1 }} onClick={swapPokemon}>Confirm</Button>
          <Button onClick={closeModal}>Cancel</Button>
        </Box>
      </ModalContent>
    </Modal>
  </>
}
