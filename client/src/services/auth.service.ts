import apiClient from './apiClient';
import type { LoginBody, RegisterBody, User } from '../types/auth.types';

interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

interface RegisterResponse {
  id: string;
  email: string;
}

export const registerRequest = (data: RegisterBody) => {
  return apiClient.post<RegisterResponse>('/register', data);
};

export const loginRequest = (data: LoginBody) => {
  return apiClient.post<LoginResponse>('/login', data);
};

export const getMeRequest = () => {
  return apiClient.get<User>('/me');
};

export const logoutRequest = () => {
  return apiClient.post('/logout');
};
