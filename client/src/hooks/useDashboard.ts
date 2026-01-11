import { useEffect, useState, useCallback } from 'react';
import { useGarageStore } from '../store/garage.store';
import { useGarageData } from './useGarageData';
import { useAuthStore } from '../store/auth.store';

export const useDashboard = () => {
  const { cars, isLoading, error, currentCarId, setCurrentCar } =
    useGarageStore();
  const currentCar = useGarageStore((state) => state.getCurrentCar());
  const { refresh } = useGarageData();
  const token = useAuthStore((state) => state.token);

  const [showCarSelector, setShowCarSelector] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      refresh();
    }
  }, [token, refresh]);

  const toggleCarSelector = useCallback(() => {
    setShowCarSelector((prev) => !prev);
  }, []);

  const openAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const closeAddModal = useCallback(() => setIsAddModalOpen(false), []);

  const handleSelectCar = (id: string | number) => {
    setCurrentCar(id);
    setShowCarSelector(false);
  };

  return {
    cars,
    currentCar,
    currentCarId,
    isLoading,
    error,
    showCarSelector,
    isAddModalOpen,
    toggleCarSelector,
    openAddModal,
    closeAddModal,
    handleSelectCar,
    setShowCarSelector,
  };
};
