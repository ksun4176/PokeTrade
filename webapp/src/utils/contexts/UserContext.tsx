import { players } from "@prisma/client";
import { createContext } from "react";

type UserContextType = {
  user: players | null;
}
export const UserContext = createContext<UserContextType>({
  user: null
})