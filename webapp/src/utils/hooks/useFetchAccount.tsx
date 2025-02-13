import { useEffect, useState } from "react";
import { getAccounts, getAuthStatus } from "../apis";
import { Account } from "../types";

export function useFetchAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [accountError, setError] = useState();
  const [accountLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAuthStatus()
      .then(({ data }) => {
        const userId = data.id;
        getAccounts(userId)
          .then(({ data }) => {
            if (data.length > 0) {
              setAccount(data[0]);
            }
          })
          .catch(error => {
            console.error(error);
            setError(error);
          })
      })
      .catch(error => {
        console.error(error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }, []);

  return { account, setAccount, accountError, accountLoading };
}