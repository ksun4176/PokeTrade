import { Account } from "@prisma/client";
import { createContext } from "react";
import { User } from "../types";

type AccountContextType = {
  user: User | null;
  account: Account | null;
  setAccount: (account: Account) => void;
  logoutUser: () => void;
}
export const AccountContext = createContext<AccountContextType>({
  user: null,
  account: null,
  setAccount: () => {},
  logoutUser: () => {},
})