import { DollarSign, Droplets, Hash, Info, TrendingUp } from 'lucide-react';
import styles from './CarStatsTab.module.scss';
import { useCarStats } from '../../hooks/useCarStats';
import Loader from '../ui/Loader/Loader';

export const CarStats = () => {
  const { stats, loading, carId } = useCarStats();

  if (loading) return <Loader size="large" />;
  
  if (!carId) return null;

  if (!stats || stats.fuelingsCount === 0) {
    return (
      <div className={styles.no_stats}>
        <Info size={20} />
        <p>Brak danych do wyświetlenia. Dodaj pierwsze tankowanie, aby zobaczyć statystyki.</p>
      </div>
    );
  }

  return (
    <div className={styles.stats_grid}>
      <div className={styles.stat_card}>
        <DollarSign className={styles.icon_cost} size={20} />
        <div className={styles.stat_info}>
          <span>Suma wydatków</span>
          <strong>{stats.totalCost.toLocaleString()} zł</strong>
        </div>
      </div>

      <div className={styles.stat_card}>
        <Droplets className={styles.icon_fuel} size={20} />
        <div className={styles.stat_info}>
          <span>Paliwo łącznie</span>
          <strong>{stats.totalLiters.toLocaleString()} L</strong>
        </div>
      </div>

      <div className={styles.stat_card}>
        <TrendingUp className={styles.icon_avg} size={20} />
        <div className={styles.stat_info}>
          <span>Średnia cena</span>
          <strong>{stats.averagePricePerLiter.toFixed(2)} zł/L</strong>
        </div>
      </div>

      <div className={styles.stat_card}>
        <Hash className={styles.icon_count} size={20} />
        <div className={styles.stat_info}>
          <span>Liczba tankowań</span>
          <strong>{stats.fuelingsCount}</strong>
        </div>
      </div>
    </div>
  );
};
