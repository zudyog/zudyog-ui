
import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

/**
 * Button variant types
 */
export type ButtonVariant = 'contained' | 'outlined' | 'text';

/**
 * Button color options
 */
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

/**
 * Button size options
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button component props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The content of the button */
  children: React.ReactNode;
  /** The variant of the button */
  variant?: ButtonVariant;
  /** The color of the button */
  color?: ButtonColor;
  /** The size of the button */
  size?: ButtonSize;
  /** If true, the button will be disabled */
  disabled?: boolean;
  /** If true, the button will show a loading spinner */
  loading?: boolean;
  /** If true, the button will take the full width of its container */
  fullWidth?: boolean;
  /** Optional start icon */
  startIcon?: React.ReactNode;
  /** Optional end icon */
  endIcon?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional class names */
  className?: string;
}

/**
 * A customizable button component with different variants, colors, sizes, and loading state.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  className,
  onClick,
  ...rest
}) => {
  // Base classes that apply to all buttons
  const baseClasses = clsx(
    styles.button,
    styles[`button-${variant}`],
    styles[`button-${color}`],
    styles[`button-${size}`],
    {
      [styles.disabled]: disabled,
      [styles.loading]: loading,
      [styles.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <span className={styles.spinner}>
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      {startIcon && !loading && <span className={styles.startIcon}>{startIcon}</span>}
      <span className={styles.content}>{children}</span>
      {endIcon && !loading && <span className={styles.endIcon}>{endIcon}</span>}
    </button>
  );
};

export default Button;
