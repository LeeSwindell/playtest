const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoginResponse {
  access_token: string;
  expiration: string;
  token_type: string;
}

async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An error occurred");
  }
  return response.json();
}

export const authAPI = {
  login,
};
