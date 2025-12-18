import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useState } from 'react';
import {
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../services/auth.service';
import { AxiosError } from 'axios';

export const useAuth = () => {
  const navigate = useNavigate();

  const zustandLogin = useAuthStore((state) => state.login);
  const zustandLogout = useAuthStore((state) => state.logout);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginRequest({ email, password });
      const { accessToken, user } = response.data;

      zustandLogin(accessToken, user);

      navigate('/');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Niepoprawny email lub hasło';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await registerRequest({ email, password });

      navigate('/login');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Niepoprawny email lub hasło';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.error('Błąd podczas wylogowywania (serwer):', error);
    } finally {
      zustandLogout();
      navigate('/login');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
