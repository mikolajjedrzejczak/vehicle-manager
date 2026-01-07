import { useEffect } from 'react';
import type { Car } from '../types/garage.types';
import { createCar, fetchCars } from '../services/garage.service';
import { useGarageStore } from '../store/garage.store';
import { useAuthStore } from '../store/auth.store';

export const useGarageData = () => {
  const { user } = useAuthStore();
  const { setCars, setLoading, setError, addCarToState } = useGarageStore();
  const { cars, isLoading, error } = useGarageStore();

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await fetchCars(user.id);
      setCars(data);
    } catch (err: any) {
      setError('Nie udało się połączyć z API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addCar = async (
    carData: Omit<Car, 'id' | 'fuelings'>,
    onSuccess?: (newCar: Car) => void
  ) => {
    if (!user?.id) return;
    try {
      const newCarFromServer = await createCar(carData, user.id);
      addCarToState(newCarFromServer);

      if (onSuccess) {
        onSuccess(newCarFromServer);
      }
    } catch (err) {
      console.error('Błąd podczas dodawania auta:', err);
      alert('Nie udało się dodać auta do bazy.');
    }
  };

  return {
    cars,
    isLoading,
    error,
    refresh: loadData,
  };
};
