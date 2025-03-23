
import React from 'react';
import styles from './Badge.module.css';

/**
 * Badge position options
 */
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * Badge color variants
 */
export type BadgeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

/**
 * Badge component props
 */
export interface BadgeProps {
  /** The content to be displayed inside the badge */
  content: number | string;
  /** Maximum value to display, if content is a number and exceeds this value, it will show {max}+ */
  max?: number;
  /** Position of the badge relative to its container */
  position?: BadgePosition;
  /** Color variant of the badge */
  color?: BadgeColor;
  /** Whether the badge should be visible */
  visible?: boolean;
  /** Whether to show the badge as a dot without content */
  dot?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Badge component - displays a small counter or status indicator
 * 
 * @example
 * ```tsx
 * <Badge content={5} color="primary" position="top-right">
 *   <IconButton icon="notifications" />
 * </Badge>
 * ```
 */
export const Badge: React.FC<React.PropsWithChildren<BadgeProps>> = ({
  content,
  max = 99,
  position = 'top-right',
  color = 'primary',
  visible = true,
  dot = false,
  className = '',
  children,
}) => {
  // Format content if it's a number and exceeds max
  const formattedContent = typeof content === 'number' && content > max
    ? `${max}+`
    : content;

  // Determine position classes
  const positionClasses = {
    'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
    'top-left': 'top-0 left-0 -translate-x-1/3 -translate-y-1/3',
    'bottom-right': 'bottom-0 right-0 translate-x-1/3 translate-y-1/3',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3',
  }[position];

  // Determine color classes
  const colorClasses = {
    'primary': 'bg-blue-500 text-white',
    'secondary': 'bg-gray-500 text-white',
    'success': 'bg-green-500 text-white',
    'danger': 'bg-red-500 text-white',
    'warning': 'bg-yellow-500 text-white',
    'info': 'bg-cyan-500 text-white',
  }[color];

  if (!visible) {
    return <>{children}</>;
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      <span
        className={`
          absolute ${positionClasses} ${colorClasses}
          ${dot ? styles.dot : styles.badge}
          flex items-center justify-center
          rounded-full
          ${dot ? 'w-2 h-2' : 'min-w-[1.25rem] h-5 px-1 text-xs font-bold'}
          shadow-sm
          z-10
        `}
      >
        {!dot && formattedContent}
      </span>
    </div>
  );
};

export default Badge;
