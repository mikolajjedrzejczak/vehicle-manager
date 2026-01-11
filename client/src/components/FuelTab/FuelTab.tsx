import {
  Fuel,
  Pencil,
  Plus,
  Trash2,
  Gauge,
  Droplets,
  Banknote,
} from 'lucide-react';
import styles from './FuelTab.module.scss';
import Button from '../ui/Button/Button';
import Modal from '../ui/Modal/Modal';
import { FuelForm } from '../forms/FuelForm/FuelForm';
import { useFuelTab } from '../../hooks/useFuelTab';
import Loader from '../ui/Loader/Loader';

const FuelTab = () => {
  const {
    currentCar,
    fuelings,
    isLoading,
    isModalOpen,
    editingFueling,
    canEdit,
    handleEdit,
    handleAddNew,
    handleDelete,
    closeModal,
  } = useFuelTab();

  if (!currentCar) return null;

  return (
    <>
      <div className={styles.fuel}>
        <div className={styles.fuel__header}>
          <div className={styles.fuel__titleWrapper}>
            <Fuel className={styles.fuel__icon} size={24} />
            <h2 className={styles.fuel__title}>Historia tankowań</h2>
          </div>
          {canEdit && (
            <Button
              variant="primary"
              onClick={handleAddNew}
              icon={<Plus size={18} />}
            >
              Dodaj
            </Button>
          )}
        </div>

        {isLoading ? (
          <Loader size="large" />
        ) : (
          <>
            <div className={styles.fuel__desktopView}>
              <table className={styles.fuel__table}>
                <thead>
                  <tr>
                    <th>DATA</th>
                    <th>PRZEBIEG</th>
                    <th>LITRY</th>
                    <th>KOSZT</th>
                    {canEdit && (
                      <th className={styles.fuel__actionHeader}>AKCJE</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {fuelings.map((item) => (
                    <tr key={item.id}>
                      <td>{item.date.split('T')[0]}</td>
                      <td>{item.mileage.toLocaleString()} km</td>
                      <td>{item.liters} L</td>
                      <td>{item.cost.toFixed(2)} zł</td>
                      {canEdit && (
                        <td className={styles.fuel__actions}>
                          <button
                            aria-label="Edytuj tankowanie"
                            className={styles.fuel__editBtn}
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            aria-label="Usuń tankowanie"
                            className={styles.fuel__deleteBtn}
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.fuel__mobileView}>
              {fuelings.map((item) => (
                <div key={item.id} className={styles.fuelCard}>
                  <div className={styles.fuelCard__header}>
                    <span className={styles.fuelCard__date}>{item.date}</span>
                    <div className={styles.fuelCard__actions}>
                      <button
                        aria-label="Edytuj tankowanie"
                        className={styles.fuelCard__btnEdit}
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        aria-label="Usuń tankowanie"
                        className={styles.fuelCard__btnDelete}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.fuelCard__content}>
                    <FuelInfoItem
                      icon={<Gauge size={14} />}
                      label="Przebieg"
                      value={`${item.mileage.toLocaleString()} km`}
                    />
                    <FuelInfoItem
                      icon={<Droplets size={14} />}
                      label="Paliwo"
                      value={`${item.liters} L`}
                    />
                    <FuelInfoItem
                      icon={<Banknote size={14} />}
                      label="Koszt"
                      value={`${item.cost.toFixed(2)} zł`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingFueling ? 'Edytuj tankowanie' : 'Dodaj tankowanie'}
      >
        <FuelForm
          initialData={editingFueling}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
};

const FuelInfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className={styles.fuelCard__info}>
    <div className={styles.fuelCard__label}>
      {icon} {label}
    </div>
    <div className={styles.fuelCard__value}>{value}</div>
  </div>
);

export default FuelTab;
