import { useEffect, useState } from "react";
import { getPokemons } from "../apis";
import { pokemon_card_dex } from "@prisma/client";

export function useFetchPokemons() {
  const [pokemons, setPokemons] = useState<Map<number, pokemon_card_dex>>();
  const [pokemonsError, setError] = useState();
  const [pokemonsLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getPokemons()
      .then(({ data }) => {
        const pokemonMap = new Map(data.map(p => [p.id, p]));
        setPokemons(pokemonMap);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }, []);

  return { pokemons, pokemonsError, pokemonsLoading };
}