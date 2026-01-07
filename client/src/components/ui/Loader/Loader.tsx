import styles from './Loader.module.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Loader = ({ size = 'medium', color, className }: LoaderProps) => {
  return (
    <div className={`${styles.loaderContainer} ${className || ''}`}>
      <div
        className={`${styles.loader} ${styles[size]}`}
        style={color ? { borderTopColor: color } : {}}
      />
    </div>
  );
};

export default Loader;
