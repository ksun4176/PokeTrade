import { players } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";
import { Pokemon } from "./types";

const CONFIG: AxiosRequestConfig = {
  withCredentials: true
};

export const getAuthStatus = () => axios.get<players>('http://localhost:9000/api/auth/status', CONFIG);
export const getPokemons = () => axios.get<Pokemon[]>('http://localhost:9000/api/pokemon/pokemons', CONFIG);