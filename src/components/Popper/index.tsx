
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Popper.module.css';

/**
 * Placement options for the popper element
 */
export type PopperPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * Modifier for adjusting popper behavior
 */
export interface PopperModifier {
  name: string;
  options?: Record<string, any>;
}

/**
 * Props for the Popper component
 */
export interface PopperProps {
  /** Reference element to position against */
  referenceElement: HTMLElement | null;
  /** Content to display in the popper */
  children: ReactNode;
  /** Whether the popper is visible */
  isOpen?: boolean;
  /** Placement of the popper relative to the reference element */
  placement?: PopperPlacement;
  /** Optional modifiers for positioning behavior */
  modifiers?: PopperModifier[];
  /** Whether to render in a portal */
  usePortal?: boolean;
  /** Z-index for the popper */
  zIndex?: number;
  /** Additional CSS class for the popper */
  className?: string;
  /** Callback when clicking outside the popper */
  onClickOutside?: () => void;
  /** Offset from the reference element in pixels [x, y] */
  offset?: [number, number];
  /** Whether to match the width of the reference element */
  matchWidth?: boolean;
}

/**
 * Popper component for positioning elements relative to a reference element
 */
export const Popper: React.FC<PopperProps> = ({
  referenceElement,
  children,
  isOpen = false,
  placement = 'bottom',
  modifiers = [],
  usePortal = true,
  zIndex = 1000,
  className = '',
  onClickOutside,
  offset = [0, 8],
  matchWidth = false,
}) => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [popperStyles, setPopperStyles] = useState({
    position: 'absolute',
    top: '0',
    left: '0',
    transform: 'translate3d(0, 0, 0)',
    width: 'auto',
  });
  const popperRef = useRef<HTMLDivElement>(null);

  // Calculate position of popper
  useEffect(() => {
    if (!referenceElement || !popperElement || !isOpen) return;

    const updatePosition = () => {
      if (!referenceElement || !popperElement) return;

      const refRect = referenceElement.getBoundingClientRect();
      const popperRect = popperElement.getBoundingClientRect();

      let top = 0;
      let left = 0;

      // Apply offset
      const [offsetX, offsetY] = offset;

      // Calculate position based on placement
      switch (placement) {
        case 'top':
          top = refRect.top - popperRect.height - offsetY;
          left = refRect.left + (refRect.width - popperRect.width) / 2 + offsetX;
          break;
        case 'top-start':
          top = refRect.top - popperRect.height - offsetY;
          left = refRect.left + offsetX;
          break;
        case 'top-end':
          top = refRect.top - popperRect.height - offsetY;
          left = refRect.right - popperRect.width + offsetX;
          break;
        case 'bottom':
          top = refRect.bottom + offsetY;
          left = refRect.left + (refRect.width - popperRect.width) / 2 + offsetX;
          break;
        case 'bottom-start':
          top = refRect.bottom + offsetY;
          left = refRect.left + offsetX;
          break;
        case 'bottom-end':
          top = refRect.bottom + offsetY;
          left = refRect.right - popperRect.width + offsetX;
          break;
        case 'left':
          top = refRect.top + (refRect.height - popperRect.height) / 2 + offsetY;
          left = refRect.left - popperRect.width - offsetX;
          break;
        case 'left-start':
          top = refRect.top + offsetY;
          left = refRect.left - popperRect.width - offsetX;
          break;
        case 'left-end':
          top = refRect.bottom - popperRect.height + offsetY;
          left = refRect.left - popperRect.width - offsetX;
          break;
        case 'right':
          top = refRect.top + (refRect.height - popperRect.height) / 2 + offsetY;
          left = refRect.right + offsetX;
          break;
        case 'right-start':
          top = refRect.top + offsetY;
          left = refRect.right + offsetX;
          break;
        case 'right-end':
          top = refRect.bottom - popperRect.height + offsetY;
          left = refRect.right + offsetX;
          break;
        default:
          top = refRect.bottom + offsetY;
          left = refRect.left + offsetX;
      }

      // Apply modifiers
      modifiers.forEach(modifier => {
        if (modifier.name === 'preventOverflow' && modifier.options?.boundary === 'viewport') {
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Prevent overflow right
          if (left + popperRect.width > viewportWidth) {
            left = viewportWidth - popperRect.width - 8;
          }

          // Prevent overflow left
          if (left < 8) {
            left = 8;
          }

          // Prevent overflow bottom
          if (top + popperRect.height > viewportHeight) {
            top = viewportHeight - popperRect.height - 8;
          }

          // Prevent overflow top
          if (top < 8) {
            top = 8;
          }
        }
      });

      // Apply scroll position
      top += window.scrollY;
      left += window.scrollX;

      setPopperStyles({
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translate3d(0, 0, 0)',
        width: matchWidth ? `${refRect.width}px` : 'auto',
      });
    };

    updatePosition();

    // Add event listeners for repositioning
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [referenceElement, popperElement, isOpen, placement, modifiers, offset, matchWidth]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen || !onClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popperRef.current &&
        !popperRef.current.contains(event.target as Node) &&
        referenceElement &&
        !referenceElement.contains(event.target as Node)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClickOutside, referenceElement]);

  // Create popper content
  const popperContent = isOpen ? (
    <div
      ref={(el) => {
        popperRef.current = el;
        setPopperElement(el);
      }}
      className={`${styles.popper} ${className}`}
      // TODO Balaji Hambeere
      // style={{
      //   ...popperStyles,
      //   zIndex,
      // }}
      data-placement={placement}
    >
      {children}
    </div>
  ) : null;

  // Render with or without portal
  if (!isOpen) return null;

  if (usePortal) {
    return createPortal(popperContent, document.body);
  }

  return popperContent;
};

export default Popper;
