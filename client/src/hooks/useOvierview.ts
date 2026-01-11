import { useState, useMemo } from 'react';
import { useGarageStore } from '../store/garage.store';
import { useGarageData } from './useGarageData';
import { calculateDateStatus, calculateOilStatus } from '../utils/utils.garage';
import { Wrench, Calendar, Shield, FileText } from 'lucide-react';
import React from 'react';
import { useAuthStore } from '../store/auth.store';

export const useOverview = () => {
  const currentCar = useGarageStore((state) => state.getCurrentCar());
  const isLoading = useGarageStore((state) => state.isLoading);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { refresh } = useGarageData();

  const userId = useAuthStore((state) => state.userId);
  const userRole = useAuthStore((state) => state.role);

  const canEdit = useMemo(() => {
    if (!currentCar || !userId) return false;

    return String(currentCar.userId) === String(userId);
  }, [currentCar, userId]);

  const isAdmin = userRole === 'Admin';

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    refresh();
  };

  const activeCards = useMemo(() => {
    if (!currentCar) return [];

    const oilInfo = calculateOilStatus(currentCar.mileage);
    const inspectionInfo = calculateDateStatus(
      currentCar.services?.inspection?.endDate?.split('T')[0]
    );
    const insuranceInfo = calculateDateStatus(
      currentCar.services?.insurance?.endDate?.split('T')[0]
    );
    const warrantyInfo = calculateDateStatus(
      currentCar.services?.warranty?.endDate?.split('T')[0]
    );

    const cards = [
      {
        id: 'oil',
        title: 'Olej silnikowy',
        value: `Za ${oilInfo.kmToNext.toLocaleString()} km`,
        icon: React.createElement(Wrench, { size: 20 }),
        status: oilInfo.status,
        statusLabel: oilInfo.statusLabel,
        isVisible: true,
      },
      {
        id: 'inspection',
        title: 'Przegląd',
        value: inspectionInfo.isExpired
          ? `Wygasł: ${currentCar.services.inspection?.endDate?.split('T')[0]}`
          : `Ważny do: ${
              currentCar.services.inspection?.endDate?.split('T')[0]
            }`,
        icon: React.createElement(Calendar, { size: 20 }),
        status: inspectionInfo.status,
        statusLabel: inspectionInfo.label,
        isVisible: !!currentCar.services.inspection?.endDate?.split('T')[0],
      },
      {
        id: 'insurance',
        title: 'Ubezpieczenie',
        value: insuranceInfo.isExpired
          ? `Wygasło: ${currentCar.services.insurance?.endDate?.split('T')[0]}`
          : `Wygasa: ${currentCar.services.insurance?.endDate?.split('T')[0]}`,
        icon: React.createElement(Shield, { size: 20 }),
        status: insuranceInfo.status,
        statusLabel: insuranceInfo.label,
        isVisible: !!currentCar.services.insurance?.endDate?.split('T')[0],
      },
      {
        id: 'warranty',
        title: 'Gwarancja',
        value: `Do: ${currentCar.services.warranty?.endDate?.split('T')[0]}`,
        icon: React.createElement(FileText, { size: 20 }),
        status: warrantyInfo.status,
        statusLabel: warrantyInfo.label,
        isVisible: !!currentCar.services.warranty?.endDate?.split('T')[0],
      },
    ];

    return cards.filter((card) => card.isVisible);
  }, [currentCar]);

  return {
    currentCar,
    activeCards,
    isLoading,
    isEditModalOpen,
    setIsEditModalOpen,
    handleEditSuccess,
    canEdit,
    isAdmin,
  };
};
