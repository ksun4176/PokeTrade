import { Account, User } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";
import { AccountTradeDetails, AccountTradeMatches, Pokemon, TradeWithStringUpdated } from "./types";
import { TradeTypes } from "./constants";

const CONFIG: AxiosRequestConfig = {
  withCredentials: true
};

export const getAuthStatus = () => axios.get<User>(`${process.env.REACT_APP_API_URL}/auth/status`, CONFIG);
export const getAccounts = () => axios.get<Account[]>(`${process.env.REACT_APP_API_URL}/users/@me/accounts`, CONFIG);
export const getPokemons = () => axios.get<Pokemon[]>(`${process.env.REACT_APP_API_URL}/pokemons`, CONFIG);
export const getAccountTrades = (accountId: number) => axios.get<TradeWithStringUpdated[]>(`${process.env.REACT_APP_API_URL}/accounts/${accountId}/trades`, CONFIG);
export const getAccountTradeMatches = (accountId: number) => axios.get<AccountTradeMatches>(`${process.env.REACT_APP_API_URL}/accounts/${accountId}/tradematches`, CONFIG)
  .then(({ data }) => (
    {
      cardToAccount: new Map(data.cardToAccount),
      accountToPokemon: new Map(data.accountToPokemon)
    }
  ));

export const updateAccountInfo = (accountId: number, inGameName?: string, friendCode?: string) => axios.put<Account>(
  `${process.env.REACT_APP_API_URL}/accounts/${accountId}`,
  {
    inGameName,
    friendCode
  },
  CONFIG
);

export const updateAccountTrades = (accountId: number, wishlist: Set<number>, listForTrade: Set<number>) => {
  const trades: AccountTradeDetails[] = [
    ...Array.from(wishlist).map(id => ({tradeType: TradeTypes.Request, pokemon: id})),
    ...Array.from(listForTrade).map(id => ({tradeType: TradeTypes.Offer, pokemon: id})),
  ];

  return axios.post<number>(
    `${process.env.REACT_APP_API_URL}/accounts/${accountId}/trades`,
    {
      trades,
    },
    CONFIG
  );
}

export const createAccount = (inGameName: string, friendCode: string) => axios.post<Account>(
  `${process.env.REACT_APP_API_URL}/users/@me/accounts`,
  {
    inGameName,
    friendCode
  },
  CONFIG
);

export const postLogOut = () => axios.post(
  `${process.env.REACT_APP_API_URL}/auth/logout`,
  {},
  CONFIG
);