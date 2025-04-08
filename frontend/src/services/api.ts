// services/api.ts

export type LoginResponse = {
    access: string;
    refresh: string;
  };
  
  type LoginPayload = {
    email: string;
    password: string;
  };
  
  const loginUser = async ({ email, password }: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }), // ✅ Django expects `username`
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Login failed");
    }
  
    return response.json();
  };
  
  export const registerUser = async (name: string, email: string, password: string): Promise<void> => {
    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Registration failed");
    }
  };
  
  export default loginUser;
  