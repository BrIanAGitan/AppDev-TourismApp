// src/utils/auth.ts
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://cagayan-de-oro-tour.onrender.com/api";

export const getAccessToken = async (): Promise<string | null> => {
  let access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (!access || !refresh) return null;

  // Try test API call
  const testRes = await fetch(`${BASE_URL}/bookings/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  // If access token expired, try refreshing
  if (testRes.status === 401) {
    try {
      const res = await fetch(`${BASE_URL}/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return null;
      }

      const data = await res.json();
      localStorage.setItem("access", data.access);
      return data.access;
    } catch {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return null;
    }
  }

  return access;
};
