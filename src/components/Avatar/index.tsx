
import React, { useState, useEffect } from 'react';
import styles from './Avatar.module.css';

/**
 * Avatar shape variants
 */
export type AvatarVariant = 'circular' | 'rounded' | 'square';

/**
 * Avatar size options
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Avatar component props
 */
export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Fallback initials when image fails to load or isn't provided */
  initials?: string;
  /** Shape variant of the avatar */
  variant?: AvatarVariant;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Optional CSS class name */
  className?: string;
  /** Background color for initials fallback */
  bgColor?: string;
  /** Text color for initials */
  textColor?: string;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Avatar component for displaying user profile images with fallback to initials
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  initials,
  variant = 'circular',
  size = 'md',
  className = '',
  bgColor = '#6366F1', // Indigo-500
  textColor = '#FFFFFF',
  onClick,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  // Reset error state if src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

  // Handle image load error
  const handleError = () => {
    setImageError(true);
  };

  // Get initials from provided string (max 2 characters)
  const getInitials = () => {
    if (!initials) return '';
    
    const parts = initials.trim().split(/\s+/);
    if (parts.length === 1) {
      return initials.substring(0, 2).toUpperCase();
    }
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Combine variant and size classes
  const variantClass = styles[variant];
  const sizeClass = styles[size];

  return (
    <div
      className={`${styles.avatar} ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      data-testid="avatar"
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className={`${styles.image} ${variantClass}`}
          onError={handleError}
        />
      ) : (
        <div
          className={`${styles.initials} ${variantClass}`}
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {getInitials()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
