import React, { useState } from 'react';
import styles from './AuthPage.module.scss';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import { useAuth } from '../../hooks/useAuth';

export const AuthPage = () => {
  const {
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
  } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleToggle = () => {
    setIsLoginMode(!isLoginMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    if (isLoginMode) {
      handleLogin(e);
    } else {
      handleRegister(e).then((res) => (res ? handleToggle() : null));
    }
  };

  return (
    <div className={styles.auth}>
      <div className={styles.auth__card}>
        <h1 className={styles.auth__title}>
          {isLoginMode ? 'Witaj ponownie' : 'Utwórz konto'}
        </h1>
        <p className={styles.auth__subtitle}>
          {isLoginMode ? 'Zaloguj się do garażu' : 'Zarządzaj swoją flotą'}
        </p>

        <form
          onSubmit={handleFormSubmit}
          className={styles.auth__form}
          noValidate
        >
          <Input
            label="Email"
            type="email"
            value={email}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Hasło"
            type="password"
            error={errors.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />

          {!isLoginMode && (
            <Input
              label="Powtórz hasło"
              type="password"
              value={confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={4}
            />
          )}

          <Button
            aria-label={isLoginMode ? 'Zaloguj się' : 'Zarejestruj się'}
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            {isLoginMode ? 'Zaloguj się' : 'Zarejestruj się'}
          </Button>

          <div className={styles.auth__footer}>
            <span className={styles['auth-text']}>
              {isLoginMode ? 'Nie masz konta? ' : 'Masz już konto? '}
            </span>

            <Button
              aria-label={isLoginMode ? 'Zarejestruj się' : 'Zaloguj się'}
              type="button"
              variant="outline"
              onClick={handleToggle}
              className={styles['auth__toggle']}
            >
              {isLoginMode ? 'Zarejestruj się' : 'Zaloguj się'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
