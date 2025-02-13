import { createContext } from "react";
import { Account } from "../types";

type AccountContextType = {
  account: Account | null;
  updateAccount: (account: Account) => void;
}
export const AccountContext = createContext<AccountContextType>({
  account: null,
  updateAccount: () => {}
})