'use client';
import styles from './BlobShape.module.css';

export default function BlobShape({ color = '#FF6B5B', size = 200, className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.blob} ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M44.7,-76.4C58.8,-69.2,71.8,-58.9,79.6,-45.4C87.4,-31.9,90,-15.9,88.4,-0.9C86.8,14.1,81,28.2,72.8,40.5C64.6,52.8,54,63.3,41.3,71.4C28.6,79.5,14.3,85.2,-0.8,86.6C-15.9,88,-31.8,85.1,-44.7,77.2C-57.6,69.3,-67.5,56.4,-75.2,42.3C-82.9,28.2,-88.4,12.9,-87.8,-1.8C-87.2,-16.5,-80.5,-30.7,-71.6,-43.1C-62.7,-55.5,-51.6,-66.1,-38.6,-73.9C-25.6,-81.7,-10.7,-86.7,2.5,-91C15.7,-95.3,30.6,-83.6,44.7,-76.4Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
