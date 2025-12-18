import './styles/global.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import PublicRoute from './components/PublicRoute.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import LoginPage from './pages/auth/Login/LoginPage.tsx';
import RegisterPage from './pages/auth/Register/RegisterPage.tsx';
import HomePage from './pages/Home/HomePage.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: Error) => {
        if (error instanceof AxiosError && error?.response?.status === 401) {
          return false;
        }
        return failureCount > 3;
      },
    },
  },
});

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
