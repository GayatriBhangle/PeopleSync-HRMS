import React from 'react';

const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800/80 rounded-xl ${className}`}
    />
  );
};

export default Skeleton;
