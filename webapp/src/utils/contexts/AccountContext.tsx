import { Account } from "@prisma/client";
import { createContext } from "react";
import { User } from "../types";

type AccountContextType = {
  /**
   * Logged in user
   */
  user: User | null;
  /**
   * Selected account
   */
  account: Account | null;
  /**
   * Set selected account
   * @param account new account to set it to
   */
  setAccount: (account: Account) => void;
  /**
   * Log out user
   */
  logoutUser: () => void;
}
export const AccountContext = createContext<AccountContextType>({
  user: null,
  account: null,
  setAccount: () => {},
  logoutUser: () => {},
})