// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

export type LoginResponse = {
  access: string;
  refresh: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export const loginUser = async ({ email, password }: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/api/login/", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string): Promise<void> => {
  await api.post("/api/register/", {
    name,
    email,
    password,
  });
};

export default api;
