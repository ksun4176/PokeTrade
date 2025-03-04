import { Account } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";
import { AccountTradeDetails, AccountTradeMatches, Pokemon, TradeWithStringUpdated, User } from "./types";
import { TradeTypes } from "./constants";

const CONFIG: AxiosRequestConfig = {
  withCredentials: true
};

/**
 * Get authenticated user information
 * @returns user information
 */
export const getAuthStatus = () => axios.get<User>(`${process.env.REACT_APP_API_URL}/auth/status`, CONFIG);
/**
 * Get accounts linked to user
 * @returns list of accounts
 */
export const getAccounts = () => axios.get<Account[]>(`${process.env.REACT_APP_API_URL}/users/@me/accounts`, CONFIG);
/**
 * Get all available Pokemons
 * @returns list of pokemons
 */
export const getPokemons = () => axios.get<Pokemon[]>(`${process.env.REACT_APP_API_URL}/pokemons`, CONFIG);
/**
 * Get trades linked to an account
 * @param accountId account to find trades linked to
 * @returns list of trades
 */
export const getAccountTrades = (accountId: number) => axios.get<TradeWithStringUpdated[]>(`${process.env.REACT_APP_API_URL}/accounts/${accountId}/trades`, CONFIG);
/**
 * Get matches for trades an account is looking for
 * @param accountId account to find trades linked to
 * @returns matches for trades
 */
export const getAccountTradeMatches = (accountId: number) => axios.get<AccountTradeMatches>(`${process.env.REACT_APP_API_URL}/accounts/${accountId}/tradematches`, CONFIG)
  .then(({ data }) => (
    {
      cardToAccount: new Map(data.cardToAccount),
      accountToPokemon: new Map(data.accountToPokemon)
    }
  ));

/**
 * Update trades linked to an account
 * @param accountId account to update
 * @param wishlist exhaustive wishlist of pokemons
 * @param listForTrade exhaustive list for trading of pokemons
 * @returns number of trades updated
 */
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

/**
 * Log out user
 * @returns "Logout success"
 */
export const postLogOut = () => axios.post<string>(
  `${process.env.REACT_APP_API_URL}/auth/logout`,
  {},
  CONFIG
);

/**
 * Send a message to initiate a trade between two users
 * @param pokemonId Pokemon to send trade message about
 * @param user user to send message to
 * @returns toast message to show when this message is sent
 */
export const sendTradeMessage = (pokemonId: number, user: User) => axios.post<string>(
  `${process.env.REACT_APP_API_URL}/discord/sendtrademessage`,
  {
    pokemonId: pokemonId,
    user: user
  },
  CONFIG
);

/**
 * Update old account or create a new account
 * @param oldAccount Old account details OR null if creating a new account
 * @param newAccountDetails New account details to set
 * @returns Saved account details
 */
export type AccountDetails = {
  inGameName: string;
  friendCode: string;
}
export async function SaveAccountToDb(oldAccount: Account | null, newAccountDetails: AccountDetails) {
  const { inGameName, friendCode } = newAccountDetails;
  let newAccount: Account;
  if (oldAccount) {
    const updateAccountInfoResponse = await axios.put<Account>(
      `${process.env.REACT_APP_API_URL}/accounts/${oldAccount.id}`,
      {
        inGameName,
        friendCode
      },
      CONFIG
    );
    newAccount = updateAccountInfoResponse.data;
  }
  else {
    const createAccountResponse = await axios.post<Account>(
      `${process.env.REACT_APP_API_URL}/users/@me/accounts`,
      {
        inGameName,
        friendCode
      },
      CONFIG
    );
    newAccount = createAccountResponse.data;
  }
  return newAccount;
}