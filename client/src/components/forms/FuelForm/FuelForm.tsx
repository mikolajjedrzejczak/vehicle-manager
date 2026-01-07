import { Calculator } from 'lucide-react';
import styles from './FuelForm.module.scss';
import type { Fueling } from '../../../types/garage.types';
import Input from '../../ui/Input/Input';
import Button from '../../ui/Button/Button';
import { useFuelForm } from '../../../hooks/useFuelForm';

interface FuelFormProps {
  initialData?: Fueling | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FuelForm = ({
  initialData,
  onSuccess,
  onCancel,
}: FuelFormProps) => {
  const {
    formData,
    errors,
    isSubmitting,
    pricePerLiter,
    isEditMode,
    handleChange,
    handleSubmit,
  } = useFuelForm(initialData, onSuccess);

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.form__grid}>
        <Input
          label="Data tankowania"
          name="date"
          type="date"
          value={formData.date}
          error={errors.date}
          onChange={handleChange}
          required
        />
        <Input
          label="Stan licznika (km)"
          name="mileage"
          type="number"
          value={formData.mileage}
          error={errors.mileage}
          onChange={handleChange}
          placeholder="Np. 154200"
          required
        />
        <Input
          label="Paliwo (L)"
          name="liters"
          type="number"
          step="0.01"
          value={formData.liters}
          error={errors.liters}
          onChange={handleChange}
          placeholder="Np. 50.2"
          required
        />
        <Input
          label="Koszt (zł)"
          name="cost"
          type="number"
          step="0.01"
          value={formData.cost}
          error={errors.cost}
          onChange={handleChange}
          placeholder="Np. 320.50"
          required
        />
      </div>

      {pricePerLiter && (
        <div className={styles.form__info}>
          <Calculator size={16} />
          <span>
            Cena za litr: <strong>{pricePerLiter} zł/L</strong>
          </span>
        </div>
      )}

      <div className={styles.form__actions}>
        <Button variant="outline" type="button" onClick={onCancel}>
          Anuluj
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEditMode ? 'Zapisz zmiany' : 'Dodaj tankowanie'}
        </Button>
      </div>
    </form>
  );
};
