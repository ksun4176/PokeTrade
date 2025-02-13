import Box from '@mui/material/Box';
import React, { JSX, useCallback, useContext } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { StepContent } from './components/StepContent';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Pokemon } from '../utils/types';
import { EditPokemonList } from './components/EditPokemonList';
import { EditAccount } from './components/EditAccount';
import { AccountContext } from '../utils/contexts/AccountContext';

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: theme.spacing(4),
  width: 400,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`
}));

type StepInfo = {
  label: string,
  content: JSX.Element,
}

type WelcomeProps = {
  pokemons: Map<number, Pokemon>;
}
export default function Welcome(props: WelcomeProps) {
  const { account } = useContext(AccountContext);
  const [ign, setIgn] = React.useState(account?.in_game_name ?? '');
  const [ignError, setIgnError] = React.useState('');
  const [friendCode, setFriendCode] = React.useState(account?.friend_code ?? '');
  const [friendCodeError, setFriendCodeError] = React.useState('');
  const updateIgn = useCallback((newIgn: string) => {
    setIgn(newIgn);
    if (newIgn.length === 0) {
      setIgnError('In Game Name is required');
    }
    else {
      setIgnError('');
    }
  },[]);
  const updateFriendCode = useCallback((newFriendCode: string) => {
    setFriendCode(newFriendCode);
    if (newFriendCode.length === 0) {
      setFriendCodeError('Friend Code is required');
    }
    else if (!parseInt(newFriendCode)) {
      setFriendCodeError('Friend Code needs to format [0-9]+')
    }
    else {
      setFriendCodeError('');
    }
  },[]);

  const { pokemons } = props;
  const [pokemonToSwap, setPokemonToSwap] = React.useState(-1);
  const [wishlist, setWishlist] = React.useState(new Set<number>());
  const [listToTrade, setListToTrade] = React.useState(new Set<number>());
  const [modalOpen, setModalOpen] = React.useState(false);
  const openModal = useCallback((pokemonId: number) => {
    setPokemonToSwap(pokemonId);
    setModalOpen(true);
  },[]);
  const closeModal = useCallback(() => {
    setModalOpen(false);
  },[]);
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
          setActiveStep(0);
        }
        else {
          console.log(`Finished!`);
        }
      }
    }
  };

  const steps: StepInfo[] = [
    {
      label: 'Link Account',
      content: <StepContent
        handleSteps={handleSteps}
        nextStepDisabled={!ign || !friendCode || !!ignError || !!friendCodeError}
        isFirstStep
      >
        <EditAccount
          ign={ign}
          ignError={ignError}
          updateIgn={updateIgn}
          friendCode={friendCode}
          friendCodeError={friendCodeError}
          updateFriendCode={updateFriendCode} />
      </StepContent>
    },
    {
      label: 'Add to Wishlist',
      content: <StepContent 
        handleSteps={handleSteps}
        nextStepDisabled={wishlist.size === 0}
      >
        <EditPokemonList
          pokemons={pokemons}
          selectedPokemons={wishlist}
          updatePokemonIds={updateWishlist}
        />
      </StepContent>
    },
    {
      label: 'List for Trading',
      content: <StepContent 
        handleSteps={handleSteps}
        nextStepDisabled={listToTrade.size === 0}
        isLastStep
      >
        <EditPokemonList
          pokemons={pokemons}
          selectedPokemons={listToTrade}
          updatePokemonIds={updateListToTrade}
        />
      </StepContent>
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
          width: {xs: '100%', sm: '90%', md: '65%'},
          mb: 2,
        }}
      >
        {steps.map((step, index) => 
          <Step key={index} completed={activeStep > index}>
            <StepLabel>{step.label}</StepLabel>
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
      </ModalContent>
    </Modal>
  </>
}
