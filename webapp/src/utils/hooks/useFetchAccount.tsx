import { useEffect, useState } from "react";
import { getAccounts, getAuthStatus } from "../apis";
import { Account, User } from "@prisma/client";

export function useFetchAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [accountError, setError] = useState();
  const [accountLoading, setLoading] = useState(true);
  useEffect(() => {
    async function startFetching() {
      let authResponse = await getAuthStatus();
      const user = authResponse.data;
      let accountsResponse = await getAccounts();
      const accounts = accountsResponse.data;

      if (!ignore) {
        setUser(user);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
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
      })
      
    return () => {
      ignore = true;
    };
  }, []);

  return { user, account, setAccount, accountError, accountLoading };
}