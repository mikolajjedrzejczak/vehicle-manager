import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import Button from '../../ui/Button/Button';
import { useHeader } from '../../../hooks/useHeader';
import Logo from '/car-icon.png';

interface HeaderProps {
  carSelectorOpen: boolean;
  onToggleCarSelector: () => void;
}

const Header = ({ carSelectorOpen, onToggleCarSelector }: HeaderProps) => {
  const { carDisplayName, hasCar, handleLogoutClick } = useHeader();

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link to="/" className={styles.header__brand}>
          <img src={Logo} className={styles.header__icon} alt="logo" />
          <h1 className={styles.header__title}>Asystent Garażu</h1>
        </Link>

        <div className={styles.header__actions}>
          <Button
            variant="primary"
            onClick={onToggleCarSelector}
            className={styles.header__carBtn}
            type="button"
          >
            <span>{carDisplayName}</span>
            {hasCar && (
              <div className={styles.header__chevron}>
                {carSelectorOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            )}
          </Button>

          <Button
            variant="primary"
            onClick={handleLogoutClick}
            icon={<LogOut size={18} />}
            className={styles.header__logoutBtn}
            aria-label="Wyloguj się"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
