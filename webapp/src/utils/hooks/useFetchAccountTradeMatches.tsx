import { useEffect, useState } from "react";
import { getAccountTradeMatches } from "../apis";

export function useFetchAccountTradeMatches(accountId?: number) {
  const [accountTradeMatches, setAccountTradeMatches] = useState<Awaited<ReturnType<typeof getAccountTradeMatches>> | null>(null);
  const [accountTradeMatchesError, setError] = useState();
  const [accountTradeMatchesLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    async function startFetching(accountId: number) {
      const accountTradeMatches = await getAccountTradeMatches(accountId);
      if (!ignore) {
        setAccountTradeMatches(accountTradeMatches);
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

  return { accountTradeMatches, accountTradeMatchesError, accountTradeMatchesLoading };
}