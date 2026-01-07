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
  const user = useAuthStore((state) => state.user);

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

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || '',
        model: initialData.model || '',
        registrationNumber: initialData.registrationNumber || '',
        year: initialData.year || new Date().getFullYear(),
        mileage: initialData.mileage?.toString() || '',
        vin: initialData.vin || '',
        inspectionDate: initialData.services?.inspection?.endDate || '',
        insuranceDate: initialData.services?.insurance?.endDate || '',
        warrantyDate: initialData.services?.warranty?.endDate || '',
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

    const carPayload: Omit<Car, 'id'> = {
      brand: formData.brand,
      model: formData.model,
      registrationNumber: formData.registrationNumber,
      year: Number(formData.year),
      mileage: formData.mileage === '' ? ('' as any) : Number(formData.mileage),
      vin: formData.vin,
      services: {
        oilChange: initialData?.services?.oilChange || {
          status: '',
          endDate: '',
          nextMileage: 0,
        },
        inspection: {
          ...(initialData?.services?.inspection || {
            status: '',
            nextMileage: 0,
          }),
          endDate: formData.inspectionDate,
        },
        insurance: {
          ...(initialData?.services?.insurance || {
            status: '',
            nextMileage: 0,
          }),
          endDate: formData.insuranceDate,
        },
        warranty: {
          ...(initialData?.services?.warranty || {
            status: '',
            nextMileage: 0,
          }),
          endDate: formData.warrantyDate,
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
        if (!user) return;
        const newCar = await createCar(carPayload, user.id);
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
