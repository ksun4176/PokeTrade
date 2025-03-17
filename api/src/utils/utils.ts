import { Pokemon } from "./types";

/**
 * Get the name of the Pokemon
 * @param pokemon Pokemon to get name for
 * @returns Name of Pokemon
 */
export const getPokemonFullName = (pokemon: Pokemon) => {
  return `${pokemon.name}${pokemon.pokemonPostfix ? ` ${pokemon.pokemonPostfix.name}` : ``} ${pokemon.pokemonCardRarity.name} - ${pokemon.expansion.name} (${pokemon.expansion.code}) #${pokemon.dexId}`;
}

/**
 * Get the name of the Pokemon
 * @param pokemon Pokemon to get name for
 * @returns Name of Pokemon
 */
export const getPokemonShortName = (pokemon: Pokemon) => {
  return `${pokemon.expansion.code} ${pokemon.dexId}/${pokemon.expansion.totalCards} - ${pokemon.name}${pokemon.pokemonPostfix ? ` ${pokemon.pokemonPostfix.name}` : ``} ${pokemon.pokemonCardRarity.name}`;
}