
import React, { useState, useEffect, useRef } from 'react';
import styles from './ImageList.module.css';

/**
 * Image item interface
 */
export interface ImageItem {
  /** Unique identifier for the image */
  id: string | number;
  /** URL of the image */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Optional title to display in the item bar */
  title?: string;
  /** Optional description to display in the item bar */
  description?: string;
  /** Optional width for variable sizing (1-3) */
  colSpan?: 1 | 2 | 3;
  /** Optional height for variable sizing (1-3) */
  rowSpan?: 1 | 2 | 3;
}

/**
 * ImageList component props
 */
export interface ImageListProps {
  /** Array of image items to display */
  images: ImageItem[];
  /** Number of columns in the grid */
  columns?: number;
  /** Gap between grid items in pixels */
  gap?: number;
  /** Whether to use masonry layout */
  masonry?: boolean;
  /** Whether to show item bars with title/description */
  showItemBars?: boolean;
  /** Function called when an image is clicked */
  onImageClick?: (image: ImageItem) => void;
  /** Custom class name */
  className?: string;
}

/**
 * ImageList component displays a collection of images in an organized grid
 * with support for variable item sizes, masonry layout, and item bars.
 */
export const ImageList: React.FC<ImageListProps> = ({
  images,
  columns = 3,
  gap = 16,
  masonry = false,
  showItemBars = false,
  onImageClick,
  className = '',
}) => {
  const [masonryColumns, setMasonryColumns] = useState<ImageItem[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create masonry layout columns
  useEffect(() => {
    if (masonry && images.length > 0) {
      const cols: ImageItem[][] = Array.from({ length: columns }, () => []);
      
      // Distribute images across columns
      images.forEach((image, index) => {
        const columnIndex = index % columns;
        cols[columnIndex].push(image);
      });
      
      setMasonryColumns(cols);
    }
  }, [images, columns, masonry]);

  // Handle image click
  const handleImageClick = (image: ImageItem) => {
    if (onImageClick) {
      onImageClick(image);
    }
  };

  // Render masonry layout
  if (masonry) {
    return (
      <div 
        ref={containerRef}
        className={`${styles.masonryContainer} ${className}`}
        style={{ gap: `${gap}px` }}
      >
        {masonryColumns.map((column, colIndex) => (
          <div key={colIndex} className={styles.masonryColumn} style={{ gap: `${gap}px` }}>
            {column.map((image) => (
              <div 
                key={image.id} 
                className={styles.masonryItem}
                onClick={() => handleImageClick(image)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className={styles.image}
                />
                {showItemBars && (image.title || image.description) && (
                  <div className={styles.itemBar}>
                    {image.title && <h3 className={styles.itemTitle}>{image.title}</h3>}
                    {image.description && <p className={styles.itemDescription}>{image.description}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Render grid layout
  return (
    <div 
      ref={containerRef}
      className={`${styles.gridContainer} ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`
      }}
    >
      {images.map((image) => (
        <div 
          key={image.id} 
          className={styles.gridItem}
          style={{ 
            gridColumn: image.colSpan ? `span ${image.colSpan}` : 'span 1',
            gridRow: image.rowSpan ? `span ${image.rowSpan}` : 'span 1'
          }}
          onClick={() => handleImageClick(image)}
        >
          <img 
            src={image.src} 
            alt={image.alt} 
            className={styles.image}
          />
          {showItemBars && (image.title || image.description) && (
            <div className={styles.itemBar}>
              {image.title && <h3 className={styles.itemTitle}>{image.title}</h3>}
              {image.description && <p className={styles.itemDescription}>{image.description}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageList;
