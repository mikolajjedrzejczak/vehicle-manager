import { useState, useEffect, useMemo } from 'react';
import { useGarageStore } from '../store/garage.store';
import type { Fueling } from '../types/garage.types';
import { validateFueling, type ValidationErrors } from '../utils/validators';

export const useFuelForm = (
  initialData: Fueling | null | undefined,
  onSuccess: () => void
) => {
  const { addFueling, updateFueling, getCurrentCar } = useGarageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const currentCar = getCurrentCar();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    liters: '',
    cost: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        mileage: initialData.mileage.toString(),
        liters: initialData.liters.toString(),
        cost: initialData.cost.toString(),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pricePerLiter = useMemo(() => {
    if (!formData.liters || !formData.cost) return null;
    const price = Number(formData.cost) / Number(formData.liters);
    return isNaN(price) || !isFinite(price) ? null : price.toFixed(2);
  }, [formData.liters, formData.cost]);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationData = {
    date: formData.date,
    mileage: formData.mileage,
    liters: formData.liters,
    cost: formData.cost,
  };
  
  const lastMileageForValidation = initialData 
    ? 0 
    : (Number(currentCar?.mileage) || 0);

  const validationErrors = validateFueling(
    validationData as any,
    lastMileageForValidation
  );

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const payload = {
    carId: Number(currentCar?.id),
    date: formData.date,
    mileage: Number(formData.mileage),
    liters: Number(formData.liters),
    cost: Number(formData.cost),
  };

  setIsSubmitting(true);

  try {
    if (initialData) {
      await updateFueling(initialData.id, payload);
    } else {
      await addFueling(payload);
    }
    
    onSuccess();
  } catch (err) {
    console.error('Błąd formularza tankowania:', err);
  } finally {
    setIsSubmitting(false);
  }
};

  return {
    formData,
    errors,
    isSubmitting,
    pricePerLiter,
    isEditMode: !!initialData,
    handleChange,
    handleSubmit,
  };
};
