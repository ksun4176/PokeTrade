import { useEffect, useState } from "react";
import { getAccounts, getAuthStatus } from "../apis";
import { Account, User } from "@prisma/client";

export function useFetchAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [accountError, setError] = useState();
  const [accountLoading, setLoading] = useState(false);
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getAuthStatus()
      .then(({ data }) => {
        if (!ignore) {
          setUser(data);
        }
        getAccounts()
          .then(({ data }) => {
            if (!ignore && data.length > 0) {
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
      
    return () => {
      ignore = true;
    };
  }, []);

  return { user, account, setAccount, accountError, accountLoading };
}