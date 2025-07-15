export const LoadingSkeleton = ({ width = '100%', height = '1rem', className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md ${className}`}
          style={{ width, height }}
        />
      ))}
    </>
  );
};
