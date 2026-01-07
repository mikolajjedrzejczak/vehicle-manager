import { useState, useEffect, useCallback } from 'react';

export const useCarSelector = (onClose: () => void) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  return {
    isAddModalOpen,
    openAddModal,
    closeAddModal,
  };
};