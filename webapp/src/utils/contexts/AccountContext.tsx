import { Account, User } from "@prisma/client";
import { createContext } from "react";

type AccountContextType = {
  user: User | null;
  account: Account | null;
  updateAccount: (account: Account) => void;
}
export const AccountContext = createContext<AccountContextType>({
  user: null,
  account: null,
  updateAccount: () => {}
})