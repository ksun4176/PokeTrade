import { useContext, useEffect, useState } from "react";
import { getAccountTrades } from "../apis";
import { AccountContext } from "../contexts/AccountContext";
import { PokemonTrade } from "@prisma/client";

export function useFetchAccountTrades() {
  const { account } = useContext(AccountContext);
  const [trades, setTrades] = useState<PokemonTrade[]>([]);
  const [tradesError, setError] = useState();
  const [tradesLoading, setLoading] = useState(false);
  useEffect(() => {
    if (!account) return;
    setLoading(true);
    getAccountTrades(account.id)
      .then(({ data }) => {
        setTrades(data);
      })
      .catch(error => {
        console.error(error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }, [account]);

  return { trades, setTrades, tradesError, tradesLoading };
}