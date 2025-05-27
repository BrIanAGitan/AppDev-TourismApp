export const authFetch = async (url: string, options: RequestInit = {}) => {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, try refresh
  if (response.status === 401 && refresh) {
    const refreshRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("access", data.access);

      // Retry original request with new token
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${data.access}`,
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    } else {
      // Refresh failed, force logout
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }
  }

  return response;
};
