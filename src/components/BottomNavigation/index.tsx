
import React, { useState } from 'react';
import styles from './BottomNavigation.module.css';

/**
 * Interface for individual navigation item
 */
export interface NavItem {
  /** Unique identifier for the item */
  id: string;
  /** Label text to display */
  label: string;
  /** Icon component to display */
  icon: React.ReactNode;
  /** Optional badge count to display */
  badgeCount?: number;
  /** Whether this item is disabled */
  disabled?: boolean;
}

/**
 * Props for the BottomNavigation component
 */
export interface BottomNavigationProps {
  /** Array of navigation items to display */
  items: NavItem[];
  /** ID of the initially active item */
  initialActiveId?: string;
  /** Callback when an item is selected */
  onItemSelect?: (itemId: string) => void;
  /** Custom CSS class for the container */
  className?: string;
  /** Whether to show labels */
  showLabels?: boolean;
  /** Whether to show the active indicator */
  showActiveIndicator?: boolean;
}

/**
 * A mobile bottom navigation component with support for icons, labels, and active states
 */
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  initialActiveId,
  onItemSelect,
  className = '',
  showLabels = true,
  showActiveIndicator = true,
}) => {
  const [activeId, setActiveId] = useState<string>(initialActiveId || (items.length > 0 ? items[0].id : ''));

  const handleItemClick = (itemId: string) => {
    if (itemId !== activeId) {
      setActiveId(itemId);
      onItemSelect?.(itemId);
    }
  };

  return (
    <nav className={`${styles.bottomNav} ${className}`}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            className={`${styles.navItem} ${isActive ? styles.active : ''} ${item.disabled ? styles.disabled : ''}`}
            onClick={() => !item.disabled && handleItemClick(item.id)}
            disabled={item.disabled}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={styles.iconContainer}>
              {item.icon}
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span className={styles.badge}>{item.badgeCount > 99 ? '99+' : item.badgeCount}</span>
              )}
            </div>
            
            {showLabels && <span className={styles.label}>{item.label}</span>}
            
            {showActiveIndicator && isActive && <div className={styles.activeIndicator} />}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
