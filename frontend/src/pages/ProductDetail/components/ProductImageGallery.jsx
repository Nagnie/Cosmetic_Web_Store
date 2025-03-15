import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Image } from "antd";
import PropTypes from "prop-types";

const ProductImageGallery = ({ images = [], maxVisibleThumbnails = 4 }) => {
  // Xử lý dữ liệu đầu vào một lần bằng useMemo
  const imageList = useMemo(() => {
    return images.length ? images : [];
  }, [images]);

  // Hình ảnh mặc định nếu không có ảnh
  const defaultImage = {
    id: 0,
    src: "https://placehold.co/499x499?text=Not+found",
  };

  // State
  const [currentImage, setCurrentImage] = useState(
    imageList[0] || defaultImage,
  );
  const [isChanging, setIsChanging] = useState(false);
  const [nextImage, setNextImage] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showScrollIndicators, setShowScrollIndicators] = useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  // Refs
  const thumbnailsRef = useRef(null);
  const resizeObserverRef = useRef(null);

  // Constants
  const THUMBNAIL_HEIGHT = 110; // Thumbnail height + gap (100px + 10px)
  const LG_BREAKPOINT = 1024;
  const TRANSITION_DELAY_SHORT = 10;
  const TRANSITION_DELAY_NORMAL = 300;
  const SCROLL_CHECK_DELAY = 100;

  // Kiểm tra nếu đang ở màn hình desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= LG_BREAKPOINT);
    };

    // Kiểm tra ban đầu
    checkIfDesktop();

    // Sử dụng ResizeObserver thay vì event listener
    resizeObserverRef.current = new ResizeObserver(checkIfDesktop);
    resizeObserverRef.current.observe(document.body);

    // Cleanup
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Cập nhật currentImage khi imageList thay đổi
  useEffect(() => {
    if (imageList.length === 0) return;
    setCurrentImage(imageList[0]);
  }, [imageList]);

  // Kiểm tra và cập nhật chỉ báo cuộn
  const checkScrollIndicators = useCallback(() => {
    if (!thumbnailsRef.current) return;

    const element = thumbnailsRef.current;
    const hasVerticalScroll = element.scrollHeight > element.clientHeight;
    const hasHorizontalScroll = element.scrollWidth > element.clientWidth;

    setShowScrollIndicators({
      top: isDesktop && element.scrollTop > 0,
      bottom:
        isDesktop &&
        hasVerticalScroll &&
        element.scrollTop < element.scrollHeight - element.clientHeight,
      left: !isDesktop && element.scrollLeft > 0,
      right:
        !isDesktop &&
        hasHorizontalScroll &&
        element.scrollLeft < element.scrollWidth - element.clientWidth,
    });
  }, [isDesktop]);

  // Theo dõi cuộn và cập nhật chỉ báo
  useEffect(() => {
    const currentRef = thumbnailsRef.current;
    if (!currentRef) return;

    // Thêm event listener cho scroll
    currentRef.addEventListener("scroll", checkScrollIndicators);

    // Sử dụng ResizeObserver để theo dõi thay đổi kích thước của thumbnails container
    const resizeObserver = new ResizeObserver(checkScrollIndicators);
    resizeObserver.observe(currentRef);

    // Kích hoạt lại sau khi component render hoàn tất
    const timeoutId = setTimeout(checkScrollIndicators, SCROLL_CHECK_DELAY);

    return () => {
      currentRef.removeEventListener("scroll", checkScrollIndicators);
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [checkScrollIndicators, imageList.length]);

  // Xử lý khi người dùng click vào thumbnail
  const handleImageClick = useCallback(
    (image) => {
      if (currentImage.id === image.id) return;

      setNextImage(image);
      setIsChanging(true);

      // Sử dụng Promise và async/await để xử lý animation tốt hơn
      const changeImage = async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, TRANSITION_DELAY_NORMAL),
        );
        setCurrentImage(image);

        await new Promise((resolve) =>
          setTimeout(resolve, TRANSITION_DELAY_SHORT),
        );
        setIsChanging(false);
        setNextImage(null);
      };

      changeImage();
    },
    [currentImage],
  );

  // Cuộn đến ảnh tiếp theo hoặc trước đó
  const scrollToImage = useCallback(
    (direction) => {
      if (!thumbnailsRef.current) return;

      const element = thumbnailsRef.current;
      const scrollAmount = THUMBNAIL_HEIGHT;

      if (isDesktop) {
        // Cuộn theo chiều dọc trên desktop
        element.scrollBy({
          top: direction === "next" ? scrollAmount : -scrollAmount,
          behavior: "smooth",
        });
      } else {
        // Cuộn theo chiều ngang trên mobile
        element.scrollBy({
          left: direction === "next" ? scrollAmount : -scrollAmount,
          behavior: "smooth",
        });
      }
    },
    [isDesktop],
  );

  // Tính toán các giá trị phụ thuộc
  const maxHeightDesktop = THUMBNAIL_HEIGHT * maxVisibleThumbnails;

  const { totalImages, currentIndex } = useMemo(() => {
    return {
      totalImages: imageList.length,
      currentIndex:
        imageList.findIndex((img) => img.id === currentImage.id) + 1,
    };
  }, [imageList, currentImage.id]);

  // Lazy loading và error handling cho ảnh chính
  const renderMainImage = useMemo(() => {
    if (imageList.length === 0) return null;

    return (
      <Image.PreviewGroup
        items={imageList.map((image) => ({ src: image.src }))}
      >
        <Image
          src={currentImage.src}
          className={`aspect-square w-full object-contain transition-opacity duration-300 ${
            isChanging ? "opacity-0" : "opacity-100"
          }`}
          alt="Hình ảnh sản phẩm"
          placeholder={
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">Đang tải...</span>
            </div>
          }
          fallback="https://placehold.co/499x499?text=Not+found"
        />
      </Image.PreviewGroup>
    );
  }, [imageList, currentImage, isChanging]);

  // Hiển thị thông báo nếu không có hình ảnh
  if (imageList.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-500">
        Không có hình ảnh sản phẩm
      </div>
    );
  }

  // Render chỉ báo cuộn
  const renderScrollIndicator = (position) => {
    const isVertical = position === "top" || position === "bottom";
    const direction =
      position === "top" || position === "left" ? "prev" : "next";

    const arrows = {
      top: "M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z",
      bottom:
        "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z",
      left: "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z",
      right:
        "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z",
    };

    // Chỉ hiển thị nếu có thể cuộn theo hướng đó
    if (!showScrollIndicators[position]) return null;

    return (
      <div
        className={`absolute z-10 cursor-pointer ${
          isVertical
            ? `${position}-0 right-0 left-0 h-6 ${isDesktop ? "flex" : "hidden"} justify-center`
            : `${position}-0 top-0 bottom-0 w-6 ${!isDesktop ? "flex" : "hidden"} items-center`
        }`}
        onClick={() => scrollToImage(direction)}
        role="button"
        aria-label={`Cuộn ${direction === "next" ? "tiếp" : "trước"}`}
      >
        <div
          className={`bg-opacity-70 flex items-center bg-white ${
            isVertical
              ? position === "top"
                ? "rounded-b px-2"
                : "rounded-t px-2"
              : position === "left"
                ? "rounded-r py-2"
                : "rounded-l py-2"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d={arrows[position]} />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="product-gallery select-none">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative order-2 lg:order-1 lg:w-1/6">
          {/* Các chỉ báo cuộn */}
          {renderScrollIndicator("top")}
          {renderScrollIndicator("bottom")}
          {renderScrollIndicator("left")}
          {renderScrollIndicator("right")}

          {/* Container của thumbnails */}
          <div
            ref={thumbnailsRef}
            className="scrollbar-hide relative flex gap-1 overflow-auto overscroll-contain rounded bg-gray-50 p-1 lg:flex-col"
            style={{
              maxHeight: isDesktop ? `${maxHeightDesktop}px` : "110px",
            }}
            aria-label="Thumbnails"
          >
            {imageList.map((image) => (
              <div
                key={image.id || image.src || image}
                className="flex-shrink-0"
                style={{
                  width: isDesktop ? "100%" : "100px",
                }}
              >
                <Image
                  preview={false}
                  src={image.src}
                  alt={`Thumbnail ${imageList.indexOf(image) + 1}`}
                  className={`h-full w-full cursor-pointer object-cover transition-all duration-300 ${
                    currentImage.id === image.id ||
                    (nextImage && nextImage.id === image.id)
                      ? "border-secondary-medium border-2"
                      : "border-2 border-transparent"
                  }`}
                  onClick={() => handleImageClick(image)}
                  fallback="https://placehold.co/124x124?text=Not+found"
                  placeholder={
                    <div className="flex h-24 w-24 items-center justify-center bg-gray-100">
                      <span className="text-xs text-gray-400">Đang tải...</span>
                    </div>
                  }
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Chỉ báo số lượng ảnh */}
          <div
            className="mt-1 text-center text-xs text-gray-500"
            aria-live="polite"
          >
            {currentIndex}/{totalImages}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:w-5/6">{renderMainImage}</div>
      </div>
    </div>
  );
};

ProductImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      src: PropTypes.string.isRequired,
    }),
  ),
  maxVisibleThumbnails: PropTypes.number,
};

export default ProductImageGallery;
