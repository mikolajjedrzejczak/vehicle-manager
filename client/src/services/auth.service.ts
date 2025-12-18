import type { LoginBody, RegisterBody, User } from '../types/auth.types';
import apiClient from './apiClient';

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
  return apiClient.post<RegisterResponse>('/auth/register', data);
};

export const loginRequest = (data: LoginBody) => {
  return apiClient.post<LoginResponse>('/auth/login', data);
}

export const logoutRequest = () => {
  return apiClient.post('/auth/logout');
};