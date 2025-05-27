let isRefreshing = false;

export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (!access || !refresh) {
    redirectToLogin();
    throw new Error("Missing access or refresh token");
  }

  // First attempt with current access token
  let response = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${access}`,
    },
  });

  if (response.status !== 401) {
    return response;
  }

  // Already tried refreshing, don't repeat
  if (isRefreshing) {
    return response;
  }

  isRefreshing = true;

  try {
    const refreshResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!refreshResponse.ok) {
      redirectToLogin();
      throw new Error("Refresh token expired");
    }

    const data = await refreshResponse.json();
    localStorage.setItem("access", data.access);

    // Retry original request with new token
    response = await fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${data.access}`,
      },
    });

    return response;
  } catch (err) {
    console.error("Token refresh failed:", err);
    redirectToLogin();
    throw err;
  } finally {
    isRefreshing = false;
  }
}

function redirectToLogin() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
