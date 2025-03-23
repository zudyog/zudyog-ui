
import React, { forwardRef, useEffect, useRef } from 'react';
import styles from './Checkbox.module.css';

/**
 * Props for the Checkbox component
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text for the checkbox */
  label?: string;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Custom icon component to display when checked */
  checkedIcon?: React.ReactNode;
  /** Custom icon component to display when unchecked */
  uncheckedIcon?: React.ReactNode;
  /** Custom icon component to display when indeterminate */
  indeterminateIcon?: React.ReactNode;
  /** Additional class name for the checkbox container */
  containerClassName?: string;
  /** Additional class name for the checkbox input */
  inputClassName?: string;
  /** Additional class name for the checkbox label */
  labelClassName?: string;
  /** Error message to display */
  error?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
}

/**
 * Checkbox component for selecting multiple options
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      indeterminate = false,
      checkedIcon,
      uncheckedIcon,
      indeterminateIcon,
      containerClassName = '',
      inputClassName = '',
      labelClassName = '',
      className = '',
      error,
      disabled = false,
      checked,
      onChange,
      ...rest
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || innerRef;

    useEffect(() => {
      if (resolvedRef && 'current' in resolvedRef && resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, resolvedRef]);

    const renderIcon = () => {
      if (indeterminate && indeterminateIcon) {
        return indeterminateIcon;
      }
      if (checked && checkedIcon) {
        return checkedIcon;
      }
      if (!checked && uncheckedIcon) {
        return uncheckedIcon;
      }
      return null;
    };

    const customIcon = renderIcon();

    return (
      <div className={`${styles.checkboxContainer} ${containerClassName}`}>
        <label
          className={`${styles.checkboxLabel} ${disabled ? styles.disabled : ''} ${labelClassName}`}
        >
          <div className={`${styles.inputWrapper} ${className}`}>
            <input
              type="checkbox"
              ref={resolvedRef}
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              className={`${styles.checkboxInput} ${inputClassName} ${
                error ? styles.error : ''
              }`}
              {...rest}
            />
            {customIcon ? (
              <div className={styles.customIcon}>{customIcon}</div>
            ) : (
              <div
                className={`${styles.checkbox} ${checked ? styles.checked : ''} ${
                  indeterminate ? styles.indeterminate : ''
                } ${disabled ? styles.disabled : ''}`}
              >
                {indeterminate ? (
                  <span className={styles.indeterminateMark} />
                ) : checked ? (
                  <svg
                    className={styles.checkmark}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : null}
              </div>
            )}
          </div>
          {label && <span className={styles.labelText}>{label}</span>}
        </label>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
