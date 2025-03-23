
import React, { forwardRef, useId } from 'react';
import styles from './RadioButton.module.css';

/**
 * Props for the RadioButton component
 */
// TODO balaji hambeere
//extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>
export interface RadioButtonProps {
  /** Label text for the radio button */
  label: string;
  /** Additional class name for the container */
  containerClassName?: string;
  /** Additional class name for the label */
  labelClassName?: string;
  /** Position of the label relative to the radio button */
  labelPosition?: 'left' | 'right';
  /** Size of the radio button */
  size?: 'sm' | 'md' | 'lg';
  /** Custom color for the radio button when checked */
  activeColor?: string;
  className: string,
  disabled: boolean,
}

/**
 * RadioButton component for selecting a single option from a set
 */
export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      label,
      containerClassName = '',
      labelClassName = '',
      labelPosition = 'right',
      size = 'md',
      activeColor,
      className = '',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const id = useId();

    const sizeClasses = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const labelSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const customColorStyle = activeColor ? { '--active-color': activeColor } as React.CSSProperties : {};

    return (
      <div
        className={`inline-flex items-center ${containerClassName} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {labelPosition === 'left' && (
          <label
            htmlFor={id}
            className={`mr-2 ${labelSizeClasses[size]} ${labelClassName} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            id={id}
            type="radio"
            ref={ref}
            disabled={disabled}
            className={`${styles.radioInput} ${sizeClasses[size]} ${className}`}
            style={customColorStyle}
            {...rest}
          />
          <span
            className={`${styles.radioControl} ${sizeClasses[size]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          />
        </div>

        {labelPosition === 'right' && (
          <label
            htmlFor={id}
            className={`ml-2 ${labelSizeClasses[size]} ${labelClassName} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

RadioButton.displayName = 'RadioButton';

export default RadioButton;
