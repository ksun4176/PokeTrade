import React from "react";
import { EditPokemonList } from "./EditPokemonList";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { pokemon_card_dex } from "@prisma/client";

export interface IStepContentProps {
  pokemons: Map<number, pokemon_card_dex>;
  selectedPokemons: Set<number>;
  updateList: (id: number, isAdd: boolean) => void;
  handleSteps: (isNext: boolean) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}
export class StepContent extends React.Component<IStepContentProps> {
  override render() {
    const { pokemons, selectedPokemons, updateList, handleSteps, isFirstStep, isLastStep } = this.props;

    return <>
      <EditPokemonList
        pokemons={pokemons}
        selectedPokemons={selectedPokemons}
        updatePokemonIds={updateList}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', p: 1 }}>
        <Button
          color="inherit"
          disabled={isFirstStep}
          onClick={() => handleSteps(false)}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button
          variant='contained'
          color='success'
          disabled={selectedPokemons.size === 0}
          onClick={() => handleSteps(true)}
        >
          {isLastStep ? `Finish` : `Next`}
        </Button>
      </Box>
    </>
  }
}