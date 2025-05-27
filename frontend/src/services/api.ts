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
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Refresh token on 401 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry original request
      }
    }

    return Promise.reject(error);
  }
);

type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
};

export const loginUser = async ({
  username,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/token/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  const { access, refresh } = data;
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);

  return data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  await api.post(
    "/register/", // ✅ FIXED path
    {
      username: name,
      email,
      password,
    },
    {
      headers: {
        Authorization: "",
      },
      withCredentials: true,
    }
  );
};

export const getBookings = async () => {
  const response = await api.get("/bookings/");
  return response.data;
};

export const deleteBooking = async (id: number) => {
  await api.delete(`/bookings/${id}/`);
};

export const updateBooking = async (
  id: number,
  data: { destination?: string; date?: string; guests?: number }
) => {
  const response = await api.put(`/bookings/${id}/`, data);
  return response.data;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    type RefreshResponse = { access: string };
    const response = await axios.post<RefreshResponse>(
      `${API_BASE_URL}/token/refresh/`,
      { refresh }
    );
    const { access } = response.data;
    localStorage.setItem("access", access);
    return access;
  } catch (err) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return null;
  }
};

export default api;
