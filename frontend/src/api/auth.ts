import api from "./axios";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserData;
}

// Register
export const registerUser = async (
  data: RegisterData
) => {
  const response = await api.post(
    "/api/auth/register",
    data
  );

  return response.data;
};

// Login
export const loginUser = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/api/auth/login",
    data
  );

  return response.data;
};

// Forgot Password
export const forgotPassword = async (
  email: string
) => {
  const response = await api.post(
    "/api/auth/forgot-password",
    {
      email,
    }
  );

  return response.data;
};

// Reset Password
export const resetPassword = async (
  token: string,
  password: string
) => {
  const response = await api.post(
    "/api/auth/reset-password",
    {
      token,
      password,
    }
  );

  return response.data;
};