import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useState } from 'react';
import {
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../services/auth.service';
import { AxiosError } from 'axios';
import {
  validateLogin,
  validateRegister,
  type ValidationErrors,
} from '../utils/validators';

export const useAuth = () => {
  const navigate = useNavigate();

  const zustandLogin = useAuthStore((state) => state.login);
  const zustandLogout = useAuthStore((state) => state.logout);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLogin({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await loginRequest({ email, password });
      const { accessToken, user } = response.data;

      zustandLogin(accessToken, user);

      navigate('/');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        setErrors({
          email: err.response?.data?.message || 'Niepoprawny email lub hasło',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRegister({
      email,
      password,
      confirmPassword,
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    let success = false;

    try {
      await registerRequest({ email, password });

      setConfirmPassword('');
      success = true;
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        setErrors({
          email:
            err.response?.data?.message || 'Konto z tym adresem już istnieje',
        });
        success = false;
      }
    } finally {
      setIsLoading(false);
    }

    return success;
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.error('Błąd podczas wylogowywania (serwer):', err);
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
    confirmPassword,
    setConfirmPassword,
    isLoading,
    errors,
    setErrors,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
