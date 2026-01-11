import { useState, useEffect } from 'react';
import { useGarageStore } from '../store/garage.store';
import { useAuthStore } from '../store/auth.store';
import { createCar, deleteCar, updateCar } from '../services/garage.service';
import type { Car } from '../types/garage.types';
import { validateCar, type ValidationErrors } from '../utils/validators';

export const useCarForm = (
  initialData: Car | null | undefined,
  onSuccess: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { addCarToState } = useGarageStore();

  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    registrationNumber: '',
    year: new Date().getFullYear(),
    mileage: '',
    vin: '',
    inspectionDate: '',
    insuranceDate: '',
    warrantyDate: '',
  });

  const formatDateForInput = (date: string | null | undefined) => {
    if (!date) return '';
    return date.split('T')[0];
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || '',
        model: initialData.model || '',
        registrationNumber: initialData.registrationNumber || '',
        year: initialData.year || new Date().getFullYear(),
        mileage: initialData.mileage?.toString() || '',
        vin: initialData.vin || '',
        inspectionDate: formatDateForInput(
          initialData.services?.inspection?.endDate
        ),
        insuranceDate: formatDateForInput(
          initialData.services?.insurance?.endDate
        ),
        warrantyDate: formatDateForInput(
          initialData.services?.warranty?.endDate
        ),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldName = name as keyof ValidationErrors;

    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formatDate = (date: string) => (date === '' ? null : date);

    const mileageValue =
      formData.mileage.trim() === '' ? undefined : Number(formData.mileage);

    const carPayload: Omit<Car, 'id'> = {
      userId: userId as string,
      brand: formData.brand,
      model: formData.model,
      registrationNumber: formData.registrationNumber,
      year: Number(formData.year),
      mileage: mileageValue as any,
      vin: formData.vin,
      services: {
        oilChange: {
          status: initialData?.services?.oilChange?.status,
          nextMileage: initialData?.services?.oilChange?.nextMileage || 0,
          endDate: formatDate(initialData?.services?.oilChange?.endDate || ''),
        },
        inspection: {
          status: initialData?.services?.inspection?.status,
          nextMileage: initialData?.services?.inspection?.nextMileage || 0,
          endDate: formatDate(formData.inspectionDate),
        },
        insurance: {
          status: initialData?.services?.insurance?.status,
          nextMileage: initialData?.services?.insurance?.nextMileage || 0,
          endDate: formatDate(formData.insuranceDate),
        },
        warranty: {
          status: initialData?.services?.warranty?.status,
          nextMileage: initialData?.services?.warranty?.nextMileage || 0,
          endDate: formatDate(formData.warrantyDate),
        },
      },
    };
    const validationErrors = validateCar(carPayload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateCar(initialData.id, carPayload);
      } else {
        if (!token) return;
        const newCar = await createCar(carPayload);
        addCarToState(newCar);
      }
      onSuccess();
    } catch (err) {
      console.error('Błąd zapisu pojazdu:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData || !window.confirm(`Usunąć pojazd ${initialData.brand}?`))
      return;

    setIsDeleting(true);
    try {
      await deleteCar(initialData.id);
      onSuccess();
    } catch (err) {
      alert('Błąd podczas usuwania');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isDeleting,
    handleChange,
    handleDelete,
    handleSubmit,
    isEditMode: !!initialData,
  };
};
