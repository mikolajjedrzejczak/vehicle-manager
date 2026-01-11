import { useState, useEffect } from 'react';
import { getCarStats } from '../services/garage.service';
import { useGarageStore } from '../store/garage.store';
import type { Stats } from '../types/garage.types';

export const useCarStats = () => {
  const currentCar = useGarageStore((state) => state.getCurrentCar());
  const carId = currentCar?.id;

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCarStats(carId);
        setStats(data);
      } catch (err) {
        console.error('Błąd pobierania statystyk:', err);
        setError('Nie udało się pobrać statystyk');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [carId]);

  return { stats, loading, error, carId };
};
