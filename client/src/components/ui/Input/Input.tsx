import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({ label, error, ...props }: InputProps) => {
  console.log(error);
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {label}
        {props.required && <span className={styles.requiredStar}>*</span>}
      </label>
      <input
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        onFocus={(e) => e.target.select()}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;
