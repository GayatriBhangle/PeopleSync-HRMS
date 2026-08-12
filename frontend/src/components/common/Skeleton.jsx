import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
        />
      ))}
    </>
  );
};
