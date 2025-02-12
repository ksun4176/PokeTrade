import { useEffect, useState } from "react";
import { getAuthStatus } from "../apis";
import { players } from "@prisma/client";

export function useFetchUser() {
  const [user, setUser] = useState<players | null>(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAuthStatus()
      .then(({ data }) => {
        console.log(data)
        setUser(data);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, error, loading };
}