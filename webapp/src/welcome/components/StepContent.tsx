import React from "react";
import { EditPokemonList } from "./EditPokemonList";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export interface IStepContentProps {
  availablePokemons: Set<number>;
  selectedPokemons: Set<number>;
  updateList: (id: number, isAdd: boolean) => void;
  handleSteps: (isNext: boolean) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}
export class StepContent extends React.Component<IStepContentProps> {
  override render() {
    const { availablePokemons, selectedPokemons, updateList, handleSteps, isFirstStep, isLastStep } = this.props;

    return <>
      <EditPokemonList
        availablePokemons={availablePokemons}
        selectedPokemons={selectedPokemons}
        updatePokemonIds={updateList}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
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