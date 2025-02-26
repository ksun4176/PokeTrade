import { useEffect, useState } from "react";
import { getPokemons } from "../apis";
import { Pokemon } from "../types";

/**
 * Fetch all available Pokemons
 */
export function useFetchPokemons() {
  const [pokemons, setPokemons] = useState<Map<number, Pokemon>>(new Map());
  const [pokemonsError, setError] = useState();
  const [pokemonsLoading, setLoading] = useState(true);
  useEffect(() => {
    async function startFetching() {
      const { data } = await getPokemons();
      if (!ignore) {
        const pokemonMap = new Map(data.map(p => [p.id, p]));
        setPokemons(pokemonMap);
      }
      return true;
    }
    let ignore = false;
    startFetching()
      .catch(error => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
      
    return () => {
      ignore = true;
    };
  }, []);

  return { pokemons, pokemonsError, pokemonsLoading };
}
