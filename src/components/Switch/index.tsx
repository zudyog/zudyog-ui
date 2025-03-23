
import React, { useState, useEffect } from 'react';
import styles from './Switch.module.css';

/**
 * Props for the Switch component
 */
export interface SwitchProps {
  /** Whether the switch is checked */
  checked?: boolean;
  /** Default checked state (uncontrolled component) */
  defaultChecked?: boolean;
  /** Callback function when the switch state changes */
  onChange?: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Label for the switch */
  label?: string;
  /** Position of the label relative to the switch */
  labelPosition?: 'left' | 'right';
  /** Name attribute for the input element */
  name?: string;
  /** Additional CSS class names */
  className?: string;
  /** ID for the input element */
  id?: string;
  /** Size of the switch */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Switch component for toggling between two states
 */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  labelPosition = 'right',
  name,
  className = '',
  id,
  size = 'md',
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(
    checked !== undefined ? checked : defaultChecked
  );

  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;

    if (checked === undefined) {
      setIsChecked(newChecked);
    }

    onChange?.(newChecked);
  };

  const switchId = id || `switch-${Math.random().toString(36).substring(2, 9)}`;

  const sizeClasses = {
    sm: styles.switchSm,
    md: styles.switchMd,
    lg: styles.switchLg,
  };

  return (
    <div className={`${styles.switchContainer} ${className}`}>
      {label && labelPosition === 'left' && (
        <label
          htmlFor={switchId}
          className={`${styles.switchLabel} ${styles.labelLeft} ${disabled ? styles.disabled : ''}`}
        >
          {label}
        </label>
      )}

      <div className={`${styles.switchWrapper} ${sizeClasses[size]}`}>
        <input
          type="checkbox"
          id={switchId}
          name={name}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.switchInput}
        />
        <label
          htmlFor={switchId}
          className={`${styles.switchToggle} ${isChecked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`}
        >
          <span className={styles.switchThumb} />
        </label>
      </div>

      {label && labelPosition === 'right' && (
        <label
          htmlFor={switchId}
          className={`${styles.switchLabel} ${styles.labelRight} ${disabled ? styles.disabled : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Switch;
