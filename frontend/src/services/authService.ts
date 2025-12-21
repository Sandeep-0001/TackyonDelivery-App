import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';

interface SignUpResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface SignInResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const signUp = async (name: string, email: string, password: string, code: string): Promise<SignUpResponse> => {
  const response = await axios.post(`${API_URL}/api/auth/signup`, {
    name,
    email,
    password,
    code
  });
  return response.data;
};

export const signIn = async (email: string, password: string): Promise<SignInResponse> => {
  const response = await axios.post(`${API_URL}/api/auth/signin`, {
    email,
    password
  });
  return response.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const sendEmailOtp = async (email: string) => {
  const response = await axios.post(`${API_URL}/api/auth/otp/send`, { email });
  return response.data;
};
