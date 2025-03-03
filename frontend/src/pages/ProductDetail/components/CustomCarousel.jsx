import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
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

const CustomCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [touchDelta, setTouchDelta] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const carouselRef = useRef(null);
  const itemsPerLoad = 8; // Number of items to load per API call

  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1; // Mobile view
      if (window.innerWidth < 1024) return 2; // Tablet view
      return 4; // Desktop view
    }
    return 4; // Default to desktop view
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  // Simulate API call to fetch products
  const fetchProducts = async (pageNum) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    // Simulate API delay - longer delay for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data generation - replace with your actual API call
    const newProducts = Array(itemsPerLoad)
      .fill(null)
      .map((_, index) => ({
        id: (pageNum - 1) * itemsPerLoad + index + 1,
        name: `Product ${(pageNum - 1) * itemsPerLoad + index + 1}`,
        price: (Math.random() * 100 + 10).toFixed(2),
      }));

    // Simulate end of data after page 3
    const noMoreData = pageNum >= 3;

    if (pageNum === 1) {
      setLoading(false);
    } else {
      setLoadingMore(false);
    }

    setHasMore(!noMoreData);

    return newProducts;
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      const initialProducts = await fetchProducts(1);
      setProducts(initialProducts);
    };

    loadInitialData();
  }, []);

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

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const preventDefaultTouch = (e) => e.preventDefault();

    carousel.addEventListener("touchstart", preventDefaultTouch, {
      passive: false,
    });
    carousel.addEventListener("touchmove", preventDefaultTouch, {
      passive: false,
    });

    return () => {
      carousel.removeEventListener("touchstart", preventDefaultTouch);
      carousel.removeEventListener("touchmove", preventDefaultTouch);
    };
  }, []);

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    const newProducts = await fetchProducts(nextPage);

    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setPage(nextPage);
  };

  const nextSlide = async () => {
    const maxIndex = Math.max(0, products.length - itemsPerView);

    // If we're near the end and there's more data to load
    if (currentIndex >= maxIndex - 2 && hasMore && !loadingMore) {
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
    e.preventDefault();
    setTouchStartX(e.touches[0].clientX);
    setIsTouching(true);
    setTouchDelta(0);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
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

  return (
    <div className="relative w-full py-8 pt-2">
      {/* Loading overlay for initial load */}
      {loading && (
        <div className="bg-opacity-60 absolute inset-0 z-20 flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader className="mx-auto h-10 w-10 animate-spin text-blue-600" />
            <p className="mt-2 font-medium text-blue-600">
              Đang tải sản phẩm...
            </p>
          </div>
        </div>
      )}

      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="relative mx-auto w-full touch-pan-y overflow-hidden"
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
          {loading ? (
            renderLoadingCards()
          ) : (
            <>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <ProductCard />
                </div>
              ))}

              {/* Loading more indicator */}
              {loadingMore && renderLoadingCards()}
            </>
          )}
        </div>
      </div>

      {/* Loading indicator for "load more" */}
      {loadingMore && (
        <div className="absolute top-1/2 right-12 z-10 flex -translate-y-1/2 items-center rounded-lg bg-blue-500 px-3 py-2 text-white shadow-lg">
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-sm">Đang tải thêm...</span>
        </div>
      )}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0 || loading}
        className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        disabled={
          (currentIndex >= products.length - itemsPerView && !hasMore) ||
          loading ||
          loadingMore
        }
        className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination info */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {!loading &&
            `Đang hiển thị ${currentIndex + 1} đến ${Math.min(currentIndex + itemsPerView, products.length)} trong số ${hasMore ? "nhiều" : products.length} sản phẩm`}
        </div>

        {hasMore && !loading && !loadingMore && (
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

export default CustomCarousel;
