
import React, { useState } from 'react';
import styles from './Breadcrumbs.module.css';

/**
 * Interface for individual breadcrumb item
 */
export interface BreadcrumbItem {
  /** Unique identifier for the breadcrumb item */
  id: string | number;
  /** Label to display for the breadcrumb */
  label: string;
  /** URL to navigate to when clicked */
  href?: string;
  /** Whether this item is the current/active page */
  isActive?: boolean;
}

/**
 * Props for the Breadcrumbs component
 */
export interface BreadcrumbsProps {
  /** Array of breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Custom separator between breadcrumb items */
  separator?: React.ReactNode;
  /** Maximum number of items to show before collapsing */
  maxItems?: number;
  /** Custom class name for the breadcrumbs container */
  className?: string;
  /** Whether to show the first item (usually home) when collapsed */
  showFirstItem?: boolean;
  /** Whether to show the last item (usually current page) when collapsed */
  showLastItem?: boolean;
  /** Text for the collapsed items indicator */
  collapsedText?: string;
  /** Callback for when a breadcrumb item is clicked */
  onItemClick?: (item: BreadcrumbItem) => void;
}

/**
 * Breadcrumbs component for displaying navigation hierarchy
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = '/',
  maxItems = 0,
  className = '',
  showFirstItem = true,
  showLastItem = true,
  collapsedText = '...',
  onItemClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Handle collapsing logic
  const shouldCollapse = maxItems > 0 && items.length > maxItems && !expanded;
  
  let displayItems = [...items];
  
  if (shouldCollapse) {
    const collapsedItems: BreadcrumbItem[] = [];
    
    if (showFirstItem && items.length > 0) {
      collapsedItems.push(items[0]);
    }
    
    // Add collapsed indicator
    collapsedItems.push({
      id: 'collapsed',
      label: collapsedText,
      href: undefined,
      isActive: false,
    });
    
    if (showLastItem && items.length > 1) {
      collapsedItems.push(items[items.length - 1]);
    }
    
    displayItems = collapsedItems;
  }

  const handleItemClick = (item: BreadcrumbItem, event: React.MouseEvent) => {
    if (item.id === 'collapsed') {
      event.preventDefault();
      setExpanded(true);
      return;
    }
    
    onItemClick?.(item);
  };

  return (
    <nav aria-label="Breadcrumb" className={`${styles.breadcrumbs} ${className}`}>
      <ol className={styles.breadcrumbsList}>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <li 
              key={item.id} 
              className={`${styles.breadcrumbItem} ${item.isActive ? styles.active : ''}`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.href && !item.isActive ? (
                <a 
                  href={item.href} 
                  className={styles.breadcrumbLink}
                  onClick={(e) => handleItemClick(item, e)}
                >
                  {item.label}
                </a>
              ) : (
                <span className={`${styles.breadcrumbText} ${item.id === 'collapsed' ? styles.collapsed : ''}`}>
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
