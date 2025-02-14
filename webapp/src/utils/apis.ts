import { PokemonTrade, User } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";
import { Account, AccountTradeDetails, Pokemon } from "./types";
import { API_URL, TradeTypes } from "./constants";

const CONFIG: AxiosRequestConfig = {
  withCredentials: true
};

export const getAuthStatus = () => axios.get<User>(`${API_URL}/auth/status`, CONFIG);
export const getAccounts = () => axios.get<Account[]>(`${API_URL}/users/@me/accounts`, CONFIG);
export const getPokemons = () => axios.get<Pokemon[]>(`${API_URL}/pokemons`, CONFIG);
export const getAccountTrades = (accountId: number) => axios.get<PokemonTrade[]>(`${API_URL}/accounts/${accountId}/trades`, CONFIG);

export const updateAccountInfo = (accountId: number, inGameName?: string, friendCode?: string) => axios.put<Account>(
  `${API_URL}/accounts/${accountId}`,
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
    `${API_URL}/accounts/${accountId}/trades`,
    {
      trades,
    },
    CONFIG
  );
}

export const createAccount = (inGameName: string, friendCode: string) => axios.post<Account>(
  `${API_URL}/users/@me/accounts`,
  {
    inGameName,
    friendCode
  },
  CONFIG
);