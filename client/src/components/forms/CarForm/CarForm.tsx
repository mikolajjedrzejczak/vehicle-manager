import { Trash2 } from 'lucide-react';
import styles from './CarForm.module.scss';
import type { Car } from '../../../types/garage.types';
import Input from '../../ui/Input/Input';
import Button from '../../ui/Button/Button';
import { useCarForm } from '../../../hooks/useCarForm';

interface CarFormProps {
  initialData?: Car | null;
  onSuccess: () => void;
}

export const CarForm = ({ initialData, onSuccess }: CarFormProps) => {
  const {
    formData,
    errors,
    isSubmitting,
    isDeleting,
    handleChange,
    handleDelete,
    handleSubmit,
    isEditMode,
  } = useCarForm(initialData, onSuccess);

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <h4 className={styles.form__sectionTitle}>Dane podstawowe</h4>
      <div className={styles.form__grid}>
        <Input
          label="Marka"
          name="brand"
          value={formData.brand}
          error={errors.brand}
          onChange={handleChange}
          required
        />
        <Input
          label="Model"
          name="model"
          value={formData.model}
          error={errors.model}
          onChange={handleChange}
          required
        />
        <Input
          label="Nr rejestracyjny"
          name="registrationNumber"
          value={formData.registrationNumber}
          error={errors.registrationNumber}
          onChange={handleChange}
          required
        />
        <Input
          label="Rok produkcji"
          name="year"
          type="number"
          value={formData.year}
          error={errors.year}
          onChange={handleChange}
          required
        />
        <Input
          label="Aktualny przebieg (km)"
          name="mileage"
          type="number"
          value={formData.mileage}
          error={errors.mileage}
          onChange={handleChange}
          required
        />
        <Input
          label="VIN"
          name="vin"
          value={formData.vin}
          error={errors.vin}
          onChange={handleChange}
          minLength={17}
          maxLength={17}
        />
      </div>

      <h4 className={styles.form__sectionTitle}>Eksploatacja i Terminy</h4>
      <div className={styles.form__grid}>
        <Input
          label="Przegląd do"
          name="inspectionDate"
          type="date"
          value={formData.inspectionDate}
          onChange={handleChange}
        />
        <Input
          label="Ubezpieczenie do"
          name="insuranceDate"
          type="date"
          value={formData.insuranceDate}
          onChange={handleChange}
        />
        <Input
          label="Gwarancja do"
          name="warrantyDate"
          type="date"
          value={formData.warrantyDate}
          onChange={handleChange}
        />
      </div>

      <div className={styles.form__actions}>
        <div className={styles.form__leftActions}>
          {isEditMode && (
            <Button
              aria-label="Usuń pojazd"
              type="button"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              icon={<Trash2 size={16} />}
            >
              Usuń pojazd
            </Button>
          )}
        </div>
        <div className={styles.form__rightActions}>
          <Button
            aria-label={isEditMode ? 'Zapisz zmiany' : 'Dodaj pojazd'}
            type="submit"
            isLoading={isSubmitting}
          >
            {isEditMode ? 'Zapisz zmiany' : 'Dodaj pojazd'}
          </Button>
        </div>
      </div>
    </form>
  );
};
