import { players, pokemon_card_dex } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";

const CONFIG: AxiosRequestConfig = {
  withCredentials: true
};

export const getAuthStatus = () => axios.get<players>('http://localhost:9000/api/auth/status', CONFIG);
export const getPokemons = () => axios.get<pokemon_card_dex[]>('http://localhost:9000/api/pokemon/pokemons', CONFIG);