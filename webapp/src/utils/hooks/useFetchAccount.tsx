import { useEffect, useState } from "react";
import { getAccounts, getAuthStatus } from "../apis";
import { Account, User } from "@prisma/client";

export function useFetchAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [accountError, setError] = useState();
  const [accountLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAuthStatus()
      .then(({ data }) => {
        setUser(data);
        getAccounts()
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

  return { user, account, setAccount, accountError, accountLoading };
}