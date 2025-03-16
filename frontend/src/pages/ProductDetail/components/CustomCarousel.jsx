import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

import { ProductCard } from ".";

const LoadingProductCard = () => (
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
);

const CustomCarousel = ({
  queryKey,
  queryFn,
  emptyMessage = "Không có sản phẩm nào",
  itemsPerPage = 8,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [touchDelta, setTouchDelta] = useState(0);
  // const [loadingMore, setLoadingMore] = useState(false);
  const carouselRef = useRef(null);

  // React Query infinite fetch products - adjusted for your API format
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => queryFn({ pageParam, limit: itemsPerPage }),
    getNextPageParam: (lastPage) => {
      // Sử dụng cấu trúc API mới
      const totalPages = lastPage?.data?.total_pages || 0;
      const currentPage = lastPage?.data?.page || 0;

      // Nếu còn trang tiếp theo thì trả về số trang kế
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Làm phẳng mảng các trang sản phẩm thành một mảng duy nhất
  const products = data?.pages.flatMap((page) => page?.data?.data || []) || [];

  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1; // Mobile view
      if (window.innerWidth < 1024) return 2; // Tablet view
      return 4; // Desktop view
    }
    return 4; // Default to desktop view
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerView = getItemsPerView();
      setItemsPerView(newItemsPerView);

      // Ensure currentIndex is still valid after resize
      const maxIndex = Math.max(0, products.length - newItemsPerView);
      setCurrentIndex((prev) => Math.min(prev, maxIndex));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [products.length]);

  const loadMoreProducts = async () => {
    if (isFetchingNextPage || !hasNextPage) return;

    // setLoadingMore(true);
    await fetchNextPage();
    // setLoadingMore(false);
  };

  const nextSlide = async () => {
    const maxIndex = Math.max(0, products.length - itemsPerView);

    // If we're near the end and there's more data to load
    if (currentIndex >= maxIndex - 2 && hasNextPage && !isFetchingNextPage) {
      await loadMoreProducts();
    }

    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      return Math.min(newIndex, products.length - itemsPerView);
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsTouching(true);
    setTouchDelta(0);
  };

  const handleTouchMove = (e) => {
    if (!isTouching) return;
    const currentX = e.touches[0].clientX;
    const delta = touchStartX - currentX;
    setTouchDelta(delta);
  };

  const handleTouchEnd = async () => {
    setIsTouching(false);
    if (touchDelta > 50) {
      await nextSlide();
    } else if (touchDelta < -50) {
      prevSlide();
    }
    setTouchDelta(0);
  };

  // Render skeleton loading cards
  const renderLoadingCards = () => {
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
  };

  // Show empty state when no products
  if (!isLoading && !isError && products.length === 0) {
    return <div className="py-8 text-center text-gray-500">{emptyMessage}</div>;
  }

  // Tính tổng số sản phẩm từ phản hồi API gần nhất
  const totalItems = data?.pages[data.pages.length - 1]?.total_items || 0;

  return (
    <div className="relative w-full py-8 pt-2">
      {/* Loading overlay for initial load */}
      {isLoading && (
        <div className="bg-opacity-60 absolute inset-0 z-20 flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader className="mx-auto h-10 w-10 animate-spin text-blue-600" />
            <p className="mt-2 font-medium text-blue-600">
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
        <div className="absolute top-1/2 right-12 z-10 flex -translate-y-1/2 items-center rounded-lg bg-blue-500 px-3 py-2 text-white shadow-lg">
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
          (currentIndex >= products.length - itemsPerView && !hasNextPage) ||
          isLoading ||
          isFetchingNextPage
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
            `Đang hiển thị ${currentIndex + 1} đến ${Math.min(
              currentIndex + itemsPerView,
              products.length,
            )} trong số ${totalItems || products.length} sản phẩm`}
        </div>

        {hasNextPage && !isLoading && !isFetchingNextPage && (
          <button
            onClick={loadMoreProducts}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            Tải thêm sản phẩm
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

CustomCarousel.propTypes = {
  queryKey: PropTypes.array.isRequired,
  queryFn: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
  itemsPerPage: PropTypes.number,
};

export default CustomCarousel;
