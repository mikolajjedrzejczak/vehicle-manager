import styles from './DashboardTabs.module.scss';
import { useState } from 'react';
import { Fuel, Wrench, Car } from 'lucide-react';
import { OverviewTab } from '../OverviewTab/OverviewTab';
import FuelTab from '../FuelTab/FuelTab';
import type { TabId } from '../../types/garage.types';

const TAB_CONFIG = [
  { id: 'overview', label: 'Podgląd', icon: <Car size={20} /> },
  { id: 'fueling', label: 'Paliwo', icon: <Fuel size={20} /> },
  { id: 'services', label: 'Serwis', icon: <Wrench size={20} /> },
] as const;

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'fueling':
        return <FuelTab />;
      case 'services':
        return <div>Historia Serwisowa</div>;
      default:
        return <OverviewTab />;
    }
  };
  return (
    <div className={styles.tabs}>
      <div className={styles.tabs__header}>
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabs__btn} ${
              activeTab === tab.id ? styles.tabs__btn_active : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.tabs__content}>{renderTabContent()}</div>
    </div>
  );
};

export default DashboardTabs;
