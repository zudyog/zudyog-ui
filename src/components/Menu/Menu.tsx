
import React, { useState, useRef, useEffect } from 'react';
import styles from './Menu.module.css';

/**
 * Interface for menu item data structure
 */
export interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Label text to display */
  label: string;
  /** Optional icon component to display before label */
  icon?: React.ReactNode;
  /** Whether the item is currently disabled */
  disabled?: boolean;
  /** Whether the item is currently selected */
  selected?: boolean;
  /** Optional submenu items */
  children?: MenuItem[];
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Props for the Menu component
 */
export interface MenuProps {
  /** Array of menu items to display */
  items: MenuItem[];
  /** Whether the menu is currently open */
  isOpen: boolean;
  /** Function to call when the menu should close */
  onClose: () => void;
  /** Anchor element or position to attach the menu to */
  anchorEl?: HTMLElement | null;
  /** Horizontal position of the menu relative to anchor */
  anchorOrigin?: 'left' | 'center' | 'right';
  /** Vertical position of the menu relative to anchor */
  anchorVertical?: 'top' | 'bottom';
  /** Optional class name for additional styling */
  className?: string;
  /** Maximum height of the menu in pixels */
  maxHeight?: number;
  /** Width of the menu in pixels */
  width?: number;
  /** Z-index for the menu */
  zIndex?: number;
}

/**
 * A dropdown menu component that supports nested submenus, selection states, and animations
 */
export const Menu: React.FC<MenuProps> = ({
  items,
  isOpen,
  onClose,
  anchorEl,
  anchorOrigin = 'left',
  anchorVertical = 'bottom',
  className = '',
  maxHeight = 300,
  width = 220,
  zIndex = 1000,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on anchor element
  useEffect(() => {
    if (anchorEl && isOpen) {
      const rect = anchorEl.getBoundingClientRect();
      let top = anchorVertical === 'bottom' ? rect.bottom : rect.top;
      let left = rect.left;
      
      if (anchorOrigin === 'center') {
        left = rect.left + rect.width / 2 - width / 2;
      } else if (anchorOrigin === 'right') {
        left = rect.right - width;
      }
      
      // Adjust for viewport boundaries
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      if (top + maxHeight > viewportHeight) {
        top = rect.top - maxHeight;
      }
      
      if (left + width > viewportWidth) {
        left = viewportWidth - width - 10;
      }
      
      if (left < 0) {
        left = 10;
      }
      
      setPosition({ top, left });
    }
  }, [anchorEl, isOpen, anchorOrigin, anchorVertical, maxHeight, width]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        (!anchorEl || !anchorEl.contains(event.target as Node))
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorEl]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle submenu hover
  const handleSubmenuEnter = (id: string) => {
    setActiveSubmenu(id);
  };

  const handleSubmenuLeave = () => {
    setActiveSubmenu(null);
  };

  // Render menu items recursively
  const renderMenuItems = (menuItems: MenuItem[], isSubmenu = false) => {
    return menuItems.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = activeSubmenu === item.id;
      
      return (
        <li 
          key={item.id}
          className={`${styles.menuItem} ${item.selected ? styles.selected : ''} ${item.disabled ? styles.disabled : ''}`}
          onMouseEnter={() => hasChildren && handleSubmenuEnter(item.id)}
          onMouseLeave={hasChildren ? handleSubmenuLeave : undefined}
        >
          <div 
            className={styles.menuItemContent}
            onClick={() => {
              if (!item.disabled && !hasChildren && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.label}>{item.label}</span>
            {hasChildren && (
              <svg className={styles.chevron} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          
          {hasChildren && isActive && (
            <div className={styles.submenu}>
              <ul>{renderMenuItems(item.children!, true)}</ul>
            </div>
          )}
        </li>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className={`${styles.menuContainer} ${className}`}
      style={{ 
        top: position.top, 
        left: position.left,
        maxHeight,
        width,
        zIndex
      }}
    >
      <ul className={styles.menu}>
        {renderMenuItems(items)}
      </ul>
    </div>
  );
};

export default Menu;
