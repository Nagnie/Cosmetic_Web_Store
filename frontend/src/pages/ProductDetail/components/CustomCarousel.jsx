import { useState, useEffect, useRef, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

import { ProductCard } from ".";

const LoadingProductCard = memo(() => (
  <div className="relative flex h-full flex-col rounded-lg border bg-white p-4 shadow-md">
    <div className="mb-4 h-40 w-full animate-pulse rounded-md bg-gray-200"></div>
    <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
    <div className="mb-1 h-4 w-full animate-pulse rounded bg-gray-200"></div>
    <div className="mb-4 h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
    <div className="mt-auto">
      <div className="mb-2 h-6 w-1/4 animate-pulse rounded bg-gray-200"></div>
      <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
    </div>
  </div>
));

LoadingProductCard.displayName = "LoadingProductCard";

const CustomCarousel = memo(
  ({
    queryKey,
    queryFn,
    emptyMessage = "Không có sản phẩm nào",
    itemsPerPage = 8,
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(0);
    const [isTouching, setIsTouching] = useState(false);
    const [touchDelta, setTouchDelta] = useState(0);
    const [reachedEnd, setReachedEnd] = useState(false);
    const [itemsPerView, setItemsPerView] = useState(4); // Default to desktop view
    const carouselRef = useRef(null);
    const isInitialMount = useRef(true);

    // React Query infinite fetch products
    const {
      data,
      isLoading,
      isError,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
    } = useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = 1 }) =>
        queryFn({ pageParam, limit: itemsPerPage }),
      getNextPageParam: (lastPage) => {
        const totalPages = lastPage?.data?.total_pages || 0;
        const currentPage = lastPage?.data?.page || 0;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      staleTime: 1 * 60 * 1000, // 1 minute
    });

    // Flatten products array
    const products =
      data?.pages.flatMap((page) => page?.data?.data || []) || [];

    // Get total items count
    const totalItems =
      data?.pages[data.pages.length - 1]?.data?.total_items || products.length;

    const getItemsPerView = useCallback(() => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) return 1; // Mobile view
        if (window.innerWidth < 1024) return 2; // Tablet view
        return 4; // Desktop view
      }
      return 4; // Default to desktop view
    }, []);

    // Initialize items per view on mount
    useEffect(() => {
      setItemsPerView(getItemsPerView());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to check if we're at the end of available products
    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      const maxIndex = Math.max(0, products.length - itemsPerView);
      const isAtEnd = currentIndex >= maxIndex;

      // If we're at the end of visible products and no more pages to load
      if (isAtEnd && !hasNextPage && !isFetchingNextPage) {
        setReachedEnd(true);
      } else {
        setReachedEnd(false);
      }
    }, [
      currentIndex,
      products.length,
      itemsPerView,
      hasNextPage,
      isFetchingNextPage,
    ]);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        const newItemsPerView = getItemsPerView();
        setItemsPerView(newItemsPerView);

        // Ensure currentIndex is still valid after resize
        const maxIndex = Math.max(0, products.length - newItemsPerView);
        setCurrentIndex((prev) => Math.min(prev, maxIndex));
      };

      const debouncedHandleResize = debounce(handleResize, 100);
      window.addEventListener("resize", debouncedHandleResize);

      return () => {
        window.removeEventListener("resize", debouncedHandleResize);
      };
    }, [getItemsPerView, products.length]);

    const loadMoreProducts = useCallback(async () => {
      if (isFetchingNextPage || !hasNextPage) return;
      await fetchNextPage();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const nextSlide = useCallback(async () => {
      // Check if we need to preemptively load more data
      const maxIndex = Math.max(0, products.length - itemsPerView);
      const willReachEnd = currentIndex + 1 >= maxIndex;

      if (willReachEnd && hasNextPage && !isFetchingNextPage) {
        await loadMoreProducts();
      }

      // Only advance if we can
      if (currentIndex < products.length - itemsPerView) {
        setCurrentIndex((prev) => prev + 1);
      } else if (hasNextPage && !isFetchingNextPage) {
        // If already at the end but more data is coming, don't advance yet
      } else {
        // At the end with no more data, mark as reached end
        setReachedEnd(true);
      }
    }, [
      currentIndex,
      hasNextPage,
      isFetchingNextPage,
      itemsPerView,
      loadMoreProducts,
      products.length,
    ]);

    const prevSlide = useCallback(() => {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const handleTouchStart = useCallback((e) => {
      setTouchStartX(e.touches[0].clientX);
      setIsTouching(true);
      setTouchDelta(0);
    }, []);

    const handleTouchMove = useCallback(
      (e) => {
        if (!isTouching) return;
        const currentX = e.touches[0].clientX;
        const delta = touchStartX - currentX;
        setTouchDelta(delta);
      },
      [isTouching, touchStartX],
    );

    const handleTouchEnd = useCallback(async () => {
      setIsTouching(false);
      if (touchDelta > 50) {
        await nextSlide();
      } else if (touchDelta < -50) {
        prevSlide();
      }
      setTouchDelta(0);
    }, [nextSlide, prevSlide, touchDelta]);

    // Calculate if there are more items to show
    const hasMoreItems =
      currentIndex < products.length - itemsPerView || hasNextPage;

    // Render skeleton loading cards
    const renderLoadingCards = useCallback(() => {
      return Array(itemsPerView)
        .fill(null)
        .map((_, index) => (
          <div
            key={`loading-${index}`}
            className="flex-shrink-0 px-2"
            style={{ width: `${100 / itemsPerView}%` }}
          >
            <LoadingProductCard />
          </div>
        ));
    }, [itemsPerView]);

    // Show empty state when no products
    if (!isLoading && !isError && products.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">{emptyMessage}</div>
      );
    }

    // console.log("Render carousel");

    return (
      <div className="relative w-full py-8 pt-2">
        {/* Loading overlay for initial load */}
        {isLoading && (
          <div className="bg-opacity-60 bg-background absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center">
              <Loader className="text-primary-dark mx-auto h-10 w-10 animate-spin" />
              <p className="text-primary-dark mt-2 font-medium">
                Đang tải sản phẩm...
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="py-8 text-center text-red-500">
            Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.
          </div>
        )}

        {/* Carousel container */}
        <div
          ref={carouselRef}
          className="relative mx-auto w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {isLoading ? (
              renderLoadingCards()
            ) : (
              <>
                {products.map((product) => (
                  <div
                    key={product.id_pro}
                    className="flex-shrink-0 px-2"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}

                {/* Loading more indicator */}
                {isFetchingNextPage && renderLoadingCards()}
              </>
            )}
          </div>
        </div>

        {/* Loading indicator for "load more" */}
        {isFetchingNextPage && (
          <div className="bg-primary absolute top-1/2 right-12 z-10 flex -translate-y-1/2 items-center rounded-lg px-3 py-2 text-white shadow-lg">
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm">Đang tải thêm...</span>
          </div>
        )}

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0 || isLoading}
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          disabled={
            isLoading || isFetchingNextPage || !hasMoreItems || reachedEnd
          }
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>

        {/* Pagination info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {!isLoading &&
              products.length > 0 &&
              `Đang hiển thị ${Math.min(currentIndex + 1, products.length)} đến ${Math.min(
                currentIndex + itemsPerView,
                products.length,
              )} trong số ${totalItems} sản phẩm`}
          </div>
        </div>
      </div>
    );
  },
);

// Simple debounce function for resize handler
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

CustomCarousel.displayName = "CustomCarousel";

CustomCarousel.propTypes = {
  queryKey: PropTypes.array.isRequired,
  queryFn: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
  itemsPerPage: PropTypes.number,
};

export default CustomCarousel;
