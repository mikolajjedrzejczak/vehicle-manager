import { Loader2 } from 'lucide-react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const buttonClass = `
    ${styles.button}
    ${styles[`button--${variant}`]}
    ${fullWidth ? styles['button--fullWidth'] : ''}
    ${className || ''}
  `;

  return (
    <button className={buttonClass} disabled={disabled || isLoading} {...props}>
      {isLoading && <Loader2 className={styles.spinner} />}
      {!isLoading && icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
