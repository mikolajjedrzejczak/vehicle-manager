import { Plus } from 'lucide-react';
import type { Car } from '../../../../types/garage.types';
import { useCarSelector } from '../../../../hooks/useCarSelector';
import styles from './CarSelector.module.scss';
import Button from '../../../ui/Button/Button';
import Modal from '../../../ui/Modal/Modal';
import { CarForm } from '../../../forms/CarForm/CarForm';

interface CarSelectorProps {
  cars: Car[];
  selectedCarId: number | string | null;
  onSelectCar: (id: number | string) => void;
  onClose: () => void;
}

const CarSelector = ({
  cars,
  selectedCarId,
  onSelectCar,
  onClose,
}: CarSelectorProps) => {
  const { isAddModalOpen, openAddModal, closeAddModal } =
    useCarSelector(onClose);

  const handleSelect = (id: number | string) => {
    onSelectCar(id);
    onClose();
  };

  const handleAddSuccess = () => {
    closeAddModal();
    onClose();
  };

  return (
    <>
      <div className={styles.carSelector}>
        <div className={styles.carSelector__backdrop} onClick={onClose} />
        <div className={styles.carSelector__panel}>
          <header className={styles.carSelector__header}>
            <h3 className={styles.carSelector__title}>Wybierz pojazd</h3>
            <Button
              variant="primary"
              className={styles.carSelector__addBtn}
              onClick={openAddModal}
              icon={<Plus size={16} />}
            >
              Dodaj pojazd
            </Button>
          </header>

          <nav className={styles.carSelector__list}>
            {cars.map((car) => (
              <CarSelectItem
                key={car.id}
                car={car}
                isActive={car.id === selectedCarId}
                onSelect={() => handleSelect(car.id)}
              />
            ))}
          </nav>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="Dodaj nowy pojazd"
      >
        <CarForm onSuccess={handleAddSuccess} />
      </Modal>
    </>
  );
};

interface CarSelectItemProp {
  car: Car;
  isActive: boolean;
  onSelect: () => void;
}

const CarSelectItem = ({ car, isActive, onSelect }: CarSelectItemProp) => {
  const itemClasses = [
    styles.carSelector__item,
    isActive ? styles.carSelector__item_active : '',
  ].join(' ');

  return (
    <button onClick={onSelect} className={itemClasses} type="button">
      <div className={styles.carSelector__content}>
        <div>
          <h4 className={styles.carSelector__carName}>
            {car.brand} {car.model}
          </h4>
          <p className={styles.carSelector__details}>
            {car.registrationNumber} • Rocznik {car.year}
          </p>
          <p className={styles.carSelector__mileage}>
            {car.mileage.toLocaleString()} km
          </p>
        </div>
        {isActive && <span className={styles.carSelector__badge}>Aktywny</span>}
      </div>
    </button>
  );
};

export default CarSelector;
