import { useEffect, useCallback } from 'react';
import { fetchCars } from '../services/garage.service';
import { useGarageStore } from '../store/garage.store';
import { useAuthStore } from '../store/auth.store';

export const useGarageData = () => {
  const token = useAuthStore((state) => state.token);
  const setCars = useGarageStore((state) => state.setCars);
  const setLoading = useGarageStore((state) => state.setLoading);
  const setError = useGarageStore((state) => state.setError);
  const { cars, isLoading, error } = useGarageStore();

  const loadData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await fetchCars();
      setCars(data);
    } catch (err: any) {
      console.error("Błąd API:", err);
      setError('Nie udało się połączyć z API');
    } finally {
      setLoading(false);
    }
  }, [token, setCars, setLoading, setError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    cars,
    isLoading,
    error,
    refresh: loadData,
  };
};