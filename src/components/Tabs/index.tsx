
import React, { useState, useRef, useEffect } from 'react';
import styles from './Tabs.module.css';

/**
 * Tab item configuration
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Label text to display */
  label: string;
  /** Optional icon component to display before the label */
  icon?: React.ReactNode;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

/**
 * Props for the Tabs component
 */
export interface TabsProps {
  /** Array of tab items to display */
  tabs: TabItem[];
  /** ID of the active tab */
  activeTab: string;
  /** Callback when a tab is selected */
  onTabChange: (tabId: string) => void;
  /** Whether tabs should be centered instead of left-aligned */
  centered?: boolean;
  /** Whether tabs should be scrollable horizontally */
  scrollable?: boolean;
  /** Custom CSS class for the tabs container */
  className?: string;
  /** Custom CSS class for the active tab */
  activeClassName?: string;
  /** Custom CSS class for the tab items */
  tabClassName?: string;
}

/**
 * Tabs component for navigation between different content sections
 */
const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  centered = false,
  scrollable = false,
  className = '',
  activeClassName = '',
  tabClassName = '',
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Update the active indicator position when the active tab changes
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
      const tabElement = tabsRef.current[activeIndex];
      if (tabElement) {
        const { offsetLeft, offsetWidth } = tabElement;

        setIndicatorStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [activeTab, tabs]);

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (scrollable) {
      const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
      if (activeIndex !== -1 && tabsRef.current[activeIndex] && tabsContainerRef.current) {
        const tabElement = tabsRef.current[activeIndex];
        const container = tabsContainerRef.current;

        if (tabElement) {
          const tabLeft = tabElement.offsetLeft;
          const tabWidth = tabElement.offsetWidth;
          const containerWidth = container.offsetWidth;
          const containerScrollLeft = container.scrollLeft;

          // If tab is not fully visible, scroll to make it visible
          if (tabLeft < containerScrollLeft) {
            container.scrollLeft = tabLeft;
          } else if (tabLeft + tabWidth > containerScrollLeft + containerWidth) {
            container.scrollLeft = tabLeft + tabWidth - containerWidth;
          }
        }
      }
    }
  }, [activeTab, scrollable, tabs]);

  return (
    <div
      className={`${styles.tabsContainer} ${className}`}
      data-centered={centered}
      data-scrollable={scrollable}
    >
      <div
        ref={tabsContainerRef}
        className={styles.tabsScroller}
      >
        <div className={styles.tabsList}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              // ref={el => (tabsRef.current[index] = el)} TODO balaji hambeere
              className={`
                ${styles.tab} 
                ${activeTab === tab.id ? `${styles.activeTab} ${activeClassName}` : ''} 
                ${tab.disabled ? styles.disabledTab : ''}
                ${tabClassName}
              `}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
          <span
            className={styles.activeIndicator}
            style={indicatorStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default Tabs;
