import { Pokemon } from "./types";

export const getPokemonName = (pokemon: Pokemon) => {
  return `${pokemon.expansion.name} ${pokemon.name}${pokemon.pokemonPostfix ? ` ${pokemon.pokemonPostfix.name}` : ``}`;
}