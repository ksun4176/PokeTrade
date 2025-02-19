import { useEffect, useState } from "react";
import { getAccountTrades } from "../apis";
import { TradeWithStringUpdated } from "../types";

export function useFetchAccountTrades(accountId?: number) {
  const [accountTrades, setAccountTrades] = useState<TradeWithStringUpdated[]>([]);
  const [accountTradesError, setError] = useState();
  const [accountTradesLoading, setLoading] = useState(false);
  useEffect(() => {
    if (!accountId) {
      return
    }
    let ignore = false;
    setLoading(true);
    getAccountTrades(accountId)
      .then(({ data }) => {
        if (!ignore) {
          setAccountTrades(data);
        }
      })
      .catch(error => {
        console.error(error);
        setError(error);
      })
      .finally(() => setLoading(false));
    
    return () => {
      ignore = true;
    };
  }, [accountId]);

  return { accountTrades, setAccountTrades, accountTradesError, accountTradesLoading };
}