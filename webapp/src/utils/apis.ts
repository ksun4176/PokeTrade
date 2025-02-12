import { players } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";

const CONFIG: AxiosRequestConfig = {
  withCredentials: true
};

export const getAuthStatus = () => axios.get<players>('http://localhost:9000/api/auth/status', CONFIG);