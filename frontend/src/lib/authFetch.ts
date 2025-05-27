export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (!access || !refresh) {
    throw new Error("No access or refresh token available");
  }

  // First attempt with current access token
  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${access}`,
    },
  });

  if (response.status !== 401) {
    return response;
  }

  // Try refreshing the access token
  const refreshResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!refreshResponse.ok) {
    throw new Error("Unable to refresh token");
  }

  const data = await refreshResponse.json();
  localStorage.setItem("access", data.access);

  // Retry the original request with new access token
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${data.access}`,
    },
  });
}
