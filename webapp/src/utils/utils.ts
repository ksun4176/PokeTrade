import { Account } from "@prisma/client";
import { Pokemon } from "./types";
import { AccountStatus } from "./constants";

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
  return `${pokemon.expansion.code} ${pokemon.name}${pokemon.pokemonPostfix ? ` ${pokemon.pokemonPostfix.name}` : ``} ${pokemon.pokemonCardRarity.name}`;
}

/**
 * Get the color for the account status
 * @param account Account to look at
 * @returns Color to use for indicating status
 */
export const getAccountStatusColor = (account: Account) => {
  return account.status === AccountStatus.Available ? 'green' : 'red'
}