const ProductCardSkeleton = () => {
  return (
    <div
      className="flex h-100 w-full flex-col justify-between rounded-lg p-4"
      style={{ backgroundColor: "#fff3e7" }}
    >
      {/* Image skeleton */}
      <div className="h-56 w-full animate-pulse rounded bg-gray-200"></div>

      {/* Title skeleton */}
      <div className="mt-2">
        <div className="mx-auto h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Price and button skeleton */}
      <div className="mt-2 flex items-center justify-between">
        <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
        <div
          className="h-10 w-28 animate-pulse rounded-lg"
          style={{ backgroundColor: "#d7cec3" }}
        ></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
