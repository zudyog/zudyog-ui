
import React, { ReactNode } from 'react';
import styles from './List.module.css';

/**
 * List item interface
 */
export interface ListItem {
  /** Unique identifier for the item */
  id: string | number;
  /** Primary text content */
  primary: string;
  /** Optional secondary text content */
  secondary?: string;
  /** Optional icon to display before the text */
  icon?: ReactNode;
  /** Optional action element to display at the end of the item */
  action?: ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the item is selected */
  selected?: boolean;
  /** Custom CSS class for the item */
  className?: string;
}

/**
 * List component props
 */
export interface ListProps {
  /** Array of list items to display */
  items: ListItem[];
  /** Optional header text for the list */
  header?: string;
  /** Whether to show dividers between items */
  dividers?: boolean;
  /** Whether the list is dense (reduced padding) */
  dense?: boolean;
  /** Whether the list items should have hover effect */
  hoverable?: boolean;
  /** Function called when an item is clicked */
  onItemClick?: (item: ListItem) => void;
  /** Custom CSS class for the list */
  className?: string;
  /** Custom CSS class for list items */
  itemClassName?: string;
  /** Whether the list is loading */
  loading?: boolean;
  /** Number of skeleton items to show when loading */
  loadingItemCount?: number;
  /** Custom CSS class for the list container */
  containerClassName?: string;
}

/**
 * List component for displaying a collection of items vertically
 */
export const List: React.FC<ListProps> = ({
  items,
  header,
  dividers = false,
  dense = false,
  hoverable = true,
  onItemClick,
  className = '',
  itemClassName = '',
  loading = false,
  loadingItemCount = 3,
  containerClassName = '',
}) => {
  const renderSkeletonItems = () => {
    return Array(loadingItemCount)
      .fill(0)
      .map((_, index) => (
        <div 
          key={`skeleton-${index}`} 
          className={`${styles.listItem} ${styles.skeleton} animate-pulse`}
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ));
  };

  const renderItems = () => {
    return items.map((item, index) => {
      const isLast = index === items.length - 1;
      
      return (
        <React.Fragment key={item.id}>
          <li 
            className={`
              ${styles.listItem}
              ${dense ? styles.dense : ''}
              ${hoverable ? styles.hoverable : ''}
              ${item.disabled ? styles.disabled : ''}
              ${item.selected ? styles.selected : ''}
              ${itemClassName}
              ${item.className || ''}
            `}
            onClick={() => {
              if (!item.disabled && onItemClick) {
                onItemClick(item);
              }
            }}
            tabIndex={item.disabled ? -1 : 0}
            aria-disabled={item.disabled}
          >
            {item.icon && <div className={styles.icon}>{item.icon}</div>}
            
            <div className={styles.content}>
              <div className={styles.primary}>{item.primary}</div>
              {item.secondary && (
                <div className={styles.secondary}>{item.secondary}</div>
              )}
            </div>
            
            {item.action && <div className={styles.action}>{item.action}</div>}
          </li>
          
          {dividers && !isLast && <div className={styles.divider}></div>}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`${styles.container} ${containerClassName}`}>
      {header && <h3 className={styles.header}>{header}</h3>}
      
      <ul className={`${styles.list} ${className}`}>
        {loading ? renderSkeletonItems() : renderItems()}
      </ul>
      
      {items.length === 0 && !loading && (
        <div className={styles.emptyState}>No items to display</div>
      )}
    </div>
  );
};

export default List;
