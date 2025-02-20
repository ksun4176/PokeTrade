import { useEffect, useState } from "react";
import { getAccountTrades } from "../apis";
import { TradeWithStringUpdated } from "../types";

export function useFetchAccountTrades(accountId?: number) {
  const [accountTrades, setAccountTrades] = useState<TradeWithStringUpdated[]>([]);
  const [accountTradesError, setError] = useState();
  const [accountTradesLoading, setLoading] = useState(false);
  useEffect(() => {
    if (!accountId) return;
    async function startFetching(accountId: number) {
      const { data } = await getAccountTrades(accountId);
      if (!ignore) {
        setAccountTrades(data);
      }
    }
    setLoading(true);
    let ignore = false;
    startFetching(accountId)
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
  }, [accountId]);

  return { accountTrades, accountTradesError, accountTradesLoading };
}
