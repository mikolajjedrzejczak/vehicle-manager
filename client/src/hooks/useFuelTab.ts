import { useState, useEffect } from 'react';
import { useGarageStore } from '../store/garage.store';
import type { Fueling } from '../types/garage.types';

export const useFuelTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFueling, setEditingFueling] = useState<Fueling | null>(null);

  const currentCar = useGarageStore((state) => state.getCurrentCar());
  const deleteFueling = useGarageStore((state) => state.deleteFueling);
  const fetchCurrentCarFuelings = useGarageStore((state) => state.fetchCurrentCarFuelings);
  const isLoading = useGarageStore((state) => state.isLoading);

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
    handleEdit,
    handleAddNew,
    handleDelete,
    closeModal,
  };
};