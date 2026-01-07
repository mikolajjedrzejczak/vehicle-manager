import { CarFront, Pencil } from 'lucide-react';
import styles from './OverviewTab.module.scss';
import Modal from '../ui/Modal/Modal';
import { CarForm } from '../forms/CarForm/CarForm';
import { useOverview } from '../../hooks/useOvierview';
import Loader from '../ui/Loader/Loader';

export const OverviewTab = () => {
  const {
    currentCar,
    activeCards,
    isLoading,
    isEditModalOpen,
    setIsEditModalOpen,
    handleEditSuccess,
  } = useOverview();

  if (!currentCar) return null;

  if (isLoading) {
    return <Loader size="large" />;
  }

  return (
    <div className={styles.overview}>
      <section className={styles.overview__mainCard}>
        <div className={styles.overview__header}>
          <div className={styles.overview__titleGroup}>
            <CarFront className={styles.overview__icon} size={24} />
            <h2 className={styles.overview__title}>Informacje o pojeździe</h2>
          </div>
          <button
            className={styles.overview__editBtn}
            onClick={() => setIsEditModalOpen(true)}
            title="Edytuj dane"
            aria-label="Edytuj dane pojazdu"
          >
            <Pencil size={18} />
          </button>
        </div>

        <div className={styles.overview__detailsGrid}>
          <DetailItem
            label="Nr Rejestracyjny"
            value={currentCar.registrationNumber}
          />
          <DetailItem
            label="Marka i Model"
            value={`${currentCar.brand} ${currentCar.model}`}
          />
          <DetailItem
            label="Przebieg"
            value={`${currentCar.mileage.toLocaleString()} km`}
          />
          <DetailItem label="VIN" value={currentCar.vin || '-'} isMono />
        </div>
      </section>

      {activeCards.length > 0 && (
        <section className={styles.overview__statusGrid}>
          {activeCards.map((card: (typeof activeCards)[number]) => (
            <div key={card.id} className={styles.statusCard}>
              <div className={styles.statusCard__header}>
                <span
                  className={`${styles.statusCard__icon} ${
                    styles[`statusCard__icon_${card.id}`]
                  }`}
                >
                  {card.icon}
                </span>
                <span
                  className={`${styles.badge} ${
                    styles[`badge_${card.status}`]
                  }`}
                >
                  {card.statusLabel}
                </span>
              </div>

              <div className={styles.statusCard__content}>
                <h3 className={styles.statusCard__title}>{card.title}</h3>
                <p className={styles.statusCard__value}>{card.value}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`${currentCar.brand} ${currentCar.model}`}
      >
        <CarForm initialData={currentCar} onSuccess={handleEditSuccess} />
      </Modal>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
  isMono?: boolean;
}

const DetailItem = ({ label, value, isMono = false }: DetailItemProps) => (
  <div className={styles.detail}>
    <span className={styles.detail__label}>{label}</span>
    <span
      className={isMono ? styles.detail__value__mono : styles.detail__value}
    >
      {value}
    </span>
  </div>
);
