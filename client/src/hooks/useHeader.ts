import { useAuthStore } from '../store/auth.store';
import { useGarageStore } from '../store/garage.store';

export const useHeader = () => {
  const logout = useAuthStore((state) => state.logout);
  const currentCar = useGarageStore((state) => state.getCurrentCar());

  const hasCar = !!(currentCar && currentCar.brand);

  const carDisplayName = hasCar 
    ? `${currentCar.brand} ${currentCar.model} • ${currentCar.registrationNumber}`
    : 'Wybierz lub dodaj pojazd';

  const handleLogoutClick = () => {
    if (window.confirm('Czy na pewno chcesz się wylogować?')) {
      logout();
    }
  };

  return {
    carDisplayName,
    hasCar,
    handleLogoutClick,
  };
};