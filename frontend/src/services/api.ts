// src/services/api.ts
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://cagayan-de-oro-tour.onrender.com/api";

const getToken = () =>
  localStorage.getItem("access") || localStorage.getItem("token");

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Authorization: getToken() ? `Bearer ${getToken()}` : undefined,
  },
});

export type LoginResponse = {
  access: string;
  refresh: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export const loginUser = async ({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/api/login/", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  await api.post("/api/register/", {
    name,
    email,
    password,
  });
};

export const getBookings = async () => {
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/bookings/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export const deleteBooking = async (id: number) => {
  const token = getToken();
  await axios.delete(`${API_BASE_URL}/bookings/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

export const updateBooking = async (
  id: number,
  data: { destination?: string; date?: string; guests?: number }
) => {
  const token = getToken();
  const response = await axios.put(`${API_BASE_URL}/bookings/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export default api;
