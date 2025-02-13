import { players } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";
import { Account, Pokemon } from "./types";

const CONFIG: AxiosRequestConfig = {
  withCredentials: true
};

export const getAuthStatus = () => axios.get<players>('http://localhost:9000/api/auth/status', CONFIG);
export const getAccounts = (userId: number) => axios.get<Account[]>(`http://localhost:9000/api/users/${userId}/accounts`, CONFIG);
export const getPokemons = () => axios.get<Pokemon[]>('http://localhost:9000/api/pokemons', CONFIG);