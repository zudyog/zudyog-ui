
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Portal.module.css';

/**
 * Props for the Portal component
 */
interface PortalProps {
  /** The content to be rendered in the portal */
  children: React.ReactNode;
  /** Whether the portal is disabled (content renders in place) */
  disabled?: boolean;
  /** Custom container element to render the portal into */
  container?: Element | null;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Portal component for rendering children into a DOM node outside of parent hierarchy
 * 
 * @example
 * // Basic usage
 * <Portal>
 *   <div>This content will be rendered at the end of document.body</div>
 * </Portal>
 * 
 * @example
 * // With custom container
 * <Portal container={document.getElementById('modal-root')}>
 *   <div>This content will be rendered in the specified container</div>
 * </Portal>
 * 
 * @example
 * // Disabled portal (renders in place)
 * <Portal disabled>
 *   <div>This content will be rendered in the normal component tree</div>
 * </Portal>
 */
export const Portal = ({
  children,
  disabled = false,
  container,
  className = '',
}: PortalProps) => {
  const [mountNode, setMountNode] = useState<Element | null>(null);

  useEffect(() => {
    if (disabled) {
      return;
    }
    
    // Use the provided container or default to document.body
    const targetElement = container || document.body;
    setMountNode(targetElement);

    return () => {
      setMountNode(null);
    };
  }, [container, disabled]);

  // If portal is disabled, render children directly
  if (disabled) {
    return <>{children}</>;
  }

  // If we don't have a mount node yet, don't render anything
  if (!mountNode) {
    return null;
  }

  // Create portal to render children in the mount node
  return createPortal(
    <div className={`${styles.portal} ${className}`}>
      {children}
    </div>,
    mountNode
  );
};

export default Portal;
