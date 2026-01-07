import { useNavigate } from 'react-router-dom';
import { OctagonAlert, Home, ArrowLeft } from 'lucide-react';
import styles from './NotFound.module.scss';
import Button from '../../components/ui/Button/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <OctagonAlert size={80} strokeWidth={1.5} className={styles.icon} />
          <span className={styles.errorCode}>404</span>
        </div>

        <h1 className={styles.title}>Zjechałeś z trasy!</h1>
        <p className={styles.description}>
          Strona, której szukasz, nie parkuje pod tym adresem. Możliwe, że
          została przeniesiona lub link jest nieaktualny.
        </p>

        <div className={styles.actions}>
          <Button
            arial-label="Wróc"
            variant="outline"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft size={18} />}
          >
            Wróć
          </Button>
          <Button
            arial-label="Strona Główna"
            variant="primary"
            onClick={() => navigate('/')}
            icon={<Home size={18} />}
          >
            Strona główna
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
