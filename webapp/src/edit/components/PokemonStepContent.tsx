import React from "react";
import { StepContent } from "./StepContent";
import { EditPokemonList } from "./EditPokemonList";
import { Pokemon } from "../../utils/types";

export interface IPokemonStepContentProps {
  /**
   * Map of all available pokemons
   */
  pokemons: Map<number,Pokemon>;
  /**
   * The list of pokemons we are editing
   */
  pokemonList: Set<number>;
  /**
   * Update the list of selected pokemons
   * @param id ID of pokemon
   * @param isAdd Whether this update is adding to list or removing
   */
  updatePokemonIds: (id: number, isAdd: boolean) => void;
  /**
   * Handle stepping through the stepper
   * @param isNext Whether we are handling moving to the next step or previous step
   */
  handleSteps: (isNext: boolean) => void;
  /**
   * Whether this is the first step
   */
  isFirstStep?: boolean;
  /**
   * Whether this is the last step
   */
  isLastStep?: boolean;
}
/**
 * The stepper content for editing a list of Pokemons
 */
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