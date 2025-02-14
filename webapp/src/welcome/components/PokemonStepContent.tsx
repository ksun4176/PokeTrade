import React from "react";
import { StepContent } from "./StepContent";
import { EditPokemonList } from "./EditPokemonList";
import { Pokemon } from "../../utils/types";

export interface IPokemonStepContentProps {
  pokemons: Map<number,Pokemon>;
  pokemonList: Set<number>;
  updatePokemonIds: (id: number, isAdd: boolean) => void;
  handleSteps: (isNext: boolean) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}
export class PokemonStepContent extends React.Component<IPokemonStepContentProps> {
  override render() {
    const { pokemons, pokemonList, updatePokemonIds, handleSteps, isFirstStep, isLastStep } = this.props;

    return <StepContent 
      handleSteps={handleSteps}
      nextStepDisabled={pokemonList.size === 0}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
    >
      <EditPokemonList
        pokemons={pokemons}
        selectedPokemons={pokemonList}
        updatePokemonIds={updatePokemonIds}
      />
    </StepContent>
  }
}