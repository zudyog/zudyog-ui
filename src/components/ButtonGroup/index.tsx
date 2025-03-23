
import React, { Children, cloneElement, isValidElement } from 'react';
import styles from './ButtonGroup.module.css';

/**
 * Button orientation options
 */
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

/**
 * Button size options
 */
export type ButtonGroupSize = 'sm' | 'md' | 'lg';

/**
 * Button variant options
 */
export type ButtonGroupVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/**
 * Props for the ButtonGroup component
 */
export interface ButtonGroupProps {
  /**
   * The children elements, typically Button components
   */
  children: React.ReactNode;

  /**
   * The orientation of the button group
   * @default 'horizontal'
   */
  orientation?: ButtonGroupOrientation;

  /**
   * The size of all buttons in the group
   * @default 'md'
   */
  size?: ButtonGroupSize;

  /**
   * The variant style of all buttons in the group
   * @default 'primary'
   */
  variant?: ButtonGroupVariant;

  /**
   * Whether the buttons should take up the full width of the container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Whether the buttons in the group are disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * ButtonGroup component for grouping related buttons with consistent styling
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled = false,
}) => {
  // Base classes for the button group
  const baseClasses = [
    styles.buttonGroup,
    styles[`orientation-${orientation}`],
    fullWidth ? styles.fullWidth : '',
    className,
  ].filter(Boolean).join(' ');

  // Clone children to pass down props
  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement(child)) {
      // TODO balaji Hambeere
      // return cloneElement(child, {
      //   // size,
      //   // variant,
      //   disabled: disabled || child.props.disabled,
      //   className: `${styles.groupedButton} ${child.props.className || ''}`,
      // });
    }
    return child;
  });

  return (
    <div className={baseClasses} role="group">
      {enhancedChildren}
    </div>
  );
};

export default ButtonGroup;
