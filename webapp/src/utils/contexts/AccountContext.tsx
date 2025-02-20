import { Account, User } from "@prisma/client";
import { createContext } from "react";

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