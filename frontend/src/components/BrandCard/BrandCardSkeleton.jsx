const BrandCardSkeleton = () => {
    return (
        <div
            className="flex h-66 w-55 flex-col items-center justify-center rounded-lg p-4"
            style={{ backgroundColor: "#fff3e7" }}
        >
            {/* Brand logo skeleton */}
            <div className="h-32 w-32 animate-pulse rounded-full bg-gray-200"></div>

            {/* Brand name skeleton */}
            <div className="mt-4 h-5 w-24 animate-pulse rounded bg-gray-200"></div>

            {/* Small line skeleton (for additional text if any) */}
            <div className="mt-2 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
        </div>
    );
};

export default BrandCardSkeleton;