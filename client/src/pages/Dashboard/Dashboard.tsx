import styles from './Dashboard.module.scss';
import Header from '../../components/layout/Header/Header';
import CarSelector from '../../components/layout/Header/CarSelector/CarSelector';
import DashboardTabs from '../../components/DashboardTabs/DashboardTabs';
import Modal from '../../components/ui/Modal/Modal';
import { Plus } from 'lucide-react';
import { CarForm } from '../../components/forms/CarForm/CarForm';
import { useDashboard } from '../../hooks/useDashboard';
import Button from '../../components/ui/Button/Button';

const Dashboard = () => {
  const {
    cars,
    currentCar,
    currentCarId,
    error,
    showCarSelector,
    isAddModalOpen,
    toggleCarSelector,
    openAddModal,
    closeAddModal,
    handleSelectCar,
    setShowCarSelector,
  } = useDashboard();

  return (
    <>
      <Header
        carSelectorOpen={showCarSelector}
        onToggleCarSelector={toggleCarSelector}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="Dodaj nowy pojazd"
      >
        <CarForm onSuccess={closeAddModal} />
      </Modal>

      {showCarSelector && (
        <CarSelector
          cars={cars}
          selectedCarId={currentCarId || cars[0]?.id}
          onSelectCar={handleSelectCar}
          onClose={() => setShowCarSelector(false)}
        />
      )}

      <main className={styles.dashboard__container}>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.dashboard__content}>
            {currentCar ? (
              <DashboardTabs />
            ) : (
              <EmptyGarage onAddClick={openAddModal} />
            )}
          </div>
        )}
      </main>
    </>
  );
};

interface EmptyGarage {
  onAddClick: () => void;
}

const EmptyGarage = ({ onAddClick }: EmptyGarage) => (
  <div className={styles.dashboard__empty}>
    <p>Twój garaż jest pusty!</p>
    <Button
      aria-label="Dodaj Pierwszy Pojazd"
      variant="primary"
      onClick={onAddClick}
      icon={<Plus size={18} />}
      className={styles.dashboard__addBtn}
    >
      Dodaj pierwszy pojazd
    </Button>
  </div>
);

export default Dashboard;
