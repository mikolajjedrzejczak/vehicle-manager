import { useState, useEffect, useMemo } from 'react';
import { useGarageStore } from '../store/garage.store';
import type { Fueling } from '../types/garage.types';
import { useAuthStore } from '../store/auth.store';

export const useFuelTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFueling, setEditingFueling] = useState<Fueling | null>(null);

  const currentCar = useGarageStore((state) => state.getCurrentCar());
  const deleteFueling = useGarageStore((state) => state.deleteFueling);
  const fetchCurrentCarFuelings = useGarageStore((state) => state.fetchCurrentCarFuelings);
  const isLoading = useGarageStore((state) => state.isLoading);

  const userId = useAuthStore((state) => state.userId);
  const userRole = useAuthStore((state) => state.role);

  const canEdit = useMemo(() => {
    if (!currentCar || !userId) return false;

    return String(currentCar.userId) === String(userId);
  }, [currentCar, userId]);

  const isAdmin = userRole === 'Admin';


  useEffect(() => {
    if (currentCar?.id) {
      fetchCurrentCarFuelings();
    }
  }, [currentCar?.id, fetchCurrentCarFuelings]);

  const handleEdit = (fueling: Fueling) => {
    setEditingFueling(fueling);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingFueling(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFueling(null);
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm('Czy na pewno chcesz usunąć to tankowanie?')) {
      deleteFueling(id);
    }
  };

  return {
    currentCar,
    fuelings: currentCar?.fuelings || [],
    isLoading,
    isModalOpen,
    editingFueling,
    canEdit,
    isAdmin,
    handleEdit,
    handleAddNew,
    handleDelete,
    closeModal,
  };
};