import { Pokemon } from "./types";

/**
 * Get the name of the Pokemon
 * @param pokemon Pokemon to get name for
 * @returns Name of Pokemon
 */
export const getPokemonName = (pokemon: Pokemon) => {
  return `${pokemon.expansion.name} ${pokemon.name}${pokemon.pokemonPostfix ? ` ${pokemon.pokemonPostfix.name}` : ``}`;
}