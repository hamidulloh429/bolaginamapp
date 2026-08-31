'use client';
import styles from './QuantitySelector.module.css';

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={styles.selector}>
      <button 
        className={styles.btn} 
        onClick={handleDecrease} 
        disabled={value <= min}
      >
        -
      </button>
      <span className={styles.value}>{value}</span>
      <button 
        className={styles.btn} 
        onClick={handleIncrease} 
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
