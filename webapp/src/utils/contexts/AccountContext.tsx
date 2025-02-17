import { Account } from "@prisma/client";
import { createContext } from "react";

type AccountContextType = {
  account: Account | null;
  updateAccount: (account: Account) => void;
}
export const AccountContext = createContext<AccountContextType>({
  account: null,
  updateAccount: () => {}
})