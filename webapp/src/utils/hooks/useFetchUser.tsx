import { useEffect, useState } from "react";
import { getAuthStatus } from "../apis";
import { players } from "@prisma/client";

export function useFetchUser() {
  const [user, setUser] = useState<players | null>(null);
  const [userError, setError] = useState();
  const [userLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAuthStatus()
      .then(({ data }) => {
        setUser(data);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, userError, userLoading };
}