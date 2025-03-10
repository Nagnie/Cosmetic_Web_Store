import { useState, useEffect, useRef } from "react";
import { Image } from "antd";
import PropTypes from "prop-types";

const IMAGE_LIST = [
  {
    id: 1,
    src: "https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg",
  },
  {
    id: 2,
    src: "https://product.hstatic.net/200000868185/product/colorkeyyynh_af1deface47e4e01acfc5c8fa5a67759_master.jpg",
  },
  {
    id: 3,
    src: "https://product.hstatic.net/200000868185/product/colorkeyyynh_af1deface47e4e01acfc5c8fa5a67759_master.jpg",
  },
  {
    id: 4,
    src: "https://product.hstatic.net/200000868185/product/colorkeyyynh_af1deface47e4e01acfc5c8fa5a67759_master.jpg",
  },
  {
    id: 5,
    src: "https://product.hstatic.net/200000868185/product/colorkeyyynh_af1deface47e4e01acfc5c8fa5a67759_master.jpg",
  },
  {
    id: 6,
    src: "https://product.hstatic.net/200000868185/product/colorkeyyynh_af1deface47e4e01acfc5c8fa5a67759_master.jpg",
  },
];

const ProductImageGallery = ({ images = [], maxVisibleThumbnails = 4 }) => {
  const imageList = images.length ? images : IMAGE_LIST;
  const [currentImage, setCurrentImage] = useState(imageList[0]);
  const [isChanging, setIsChanging] = useState(false);
  const [nextImage, setNextImage] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showScrollIndicators, setShowScrollIndicators] = useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  const thumbnailsRef = useRef(null);

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024); // 1024px là breakpoint lg trong Tailwind
    };

    // Kiểm tra ban đầu
    checkIfDesktop();

    // Thêm event listener để theo dõi khi resize window
    window.addEventListener("resize", checkIfDesktop);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  // Kiểm tra xem có cần hiển thị các chỉ báo cuộn không
  useEffect(() => {
    const checkScrollIndicators = () => {
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
    };

    checkScrollIndicators();

    // Thêm event listener cho scroll
    const currentRef = thumbnailsRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollIndicators);

      // Kích hoạt lại sau khi component render hoàn tất
      setTimeout(checkScrollIndicators, 100);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScrollIndicators);
      }
    };
  }, [isDesktop, imageList.length]);

  const handleImageClick = (image) => {
    if (currentImage.id === image.id) return;

    setNextImage(image);
    setIsChanging(true);

    setTimeout(() => {
      setCurrentImage(image);

      setTimeout(() => {
        setIsChanging(false);
        setNextImage(null);
      }, 10);
    }, 300);
  };

  // Hàm cuộn đến ảnh tiếp theo hoặc trước đó
  const scrollToImage = (direction) => {
    if (!thumbnailsRef.current) return;

    const element = thumbnailsRef.current;

    if (isDesktop) {
      // Cuộn theo chiều dọc trên desktop
      const scrollAmount = 110; // Chiều cao thumbnail + gap
      element.scrollBy({
        top: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    } else {
      // Cuộn theo chiều ngang trên mobile
      const scrollAmount = 110; // Chiều rộng thumbnail + gap
      element.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (imageList.length === 0) {
    return <div className="text-gray-500">Không có hình ảnh sản phẩm</div>;
  }

  // Tính toán chiều cao của container thumbnail dựa trên số lượng tối đa
  const thumbnailHeight = 110; // Thumbnail height + gap (100px + 10px)
  const maxHeightDesktop = thumbnailHeight * maxVisibleThumbnails;

  const totalImages = imageList.length;
  const currentIndex =
    imageList.findIndex((img) => img.id === currentImage.id) + 1;

  return (
    <div className="product-gallery select-none">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative order-2 lg:order-1 lg:w-1/6">
          {/* Chỉ báo còn ảnh để cuộn phía trên - chỉ hiển thị trên desktop */}
          {showScrollIndicators.top && (
            <div
              className="absolute top-0 right-0 left-0 z-10 hidden h-6 cursor-pointer justify-center lg:flex"
              onClick={() => scrollToImage("prev")}
            >
              <div className="bg-opacity-70 flex items-center rounded-b bg-white px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Chỉ báo còn ảnh để cuộn bên trái - chỉ hiển thị trên mobile */}
          {showScrollIndicators.left && (
            <div
              className="absolute top-0 bottom-0 left-0 z-10 flex h-full w-6 cursor-pointer items-center lg:hidden"
              onClick={() => scrollToImage("prev")}
            >
              <div className="bg-opacity-70 flex items-center rounded-r bg-white py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Container của thumbnails với giới hạn chiều cao/chiều rộng */}
          <div
            ref={thumbnailsRef}
            className="scrollbar-hide relative flex gap-1 overflow-auto overscroll-contain lg:flex-col"
            style={{
              maxHeight: isDesktop ? `${maxHeightDesktop}px` : "110px",
            }}
          >
            {imageList.map((image) => (
              <div
                key={image.id}
                className="flex-shrink-0"
                style={{
                  width: isDesktop ? "100%" : "100px",
                }}
              >
                <Image
                  preview={false}
                  src={image.src}
                  alt="product"
                  className={`h-full w-full cursor-pointer object-cover transition-all duration-300 ${
                    currentImage.id === image.id ||
                    (nextImage && nextImage.id === image.id)
                      ? "border-secondary-medium border-2"
                      : "border-2 border-transparent"
                  }`}
                  onClick={() => handleImageClick(image)}
                  placeholder={
                    <Image
                      preview={false}
                      src={`https://placehold.co/124x124?text=Loading`}
                    />
                  }
                  onError={(e) => {
                    e.target.width = 124;
                    e.target.height = 124;
                    e.target.src =
                      "https://placehold.co/124x124?text=Not found";
                  }}
                />
              </div>
            ))}
          </div>

          {/* Chỉ báo còn ảnh để cuộn phía dưới - chỉ hiển thị trên desktop */}
          {showScrollIndicators.bottom && (
            <div
              className="absolute right-0 bottom-0 left-0 z-10 hidden h-6 cursor-pointer justify-center lg:flex"
              onClick={() => scrollToImage("next")}
            >
              <div className="bg-opacity-70 flex items-center rounded-t bg-white px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Chỉ báo còn ảnh để cuộn bên phải - chỉ hiển thị trên mobile */}
          {showScrollIndicators.right && (
            <div
              className="absolute top-0 right-0 bottom-0 z-10 flex h-full w-6 cursor-pointer items-center lg:hidden"
              onClick={() => scrollToImage("next")}
            >
              <div className="bg-opacity-70 flex items-center rounded-l bg-white py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Chỉ báo số lượng ảnh */}
          <div className="mt-1 text-center text-xs text-gray-500">
            {currentIndex}/{totalImages}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:w-5/6">
          <Image.PreviewGroup
            items={imageList.map((image) => ({
              src: image.src,
            }))}
          >
            <Image
              src={currentImage.src}
              className={`aspect-square w-full object-contain transition-opacity duration-300 ${
                isChanging ? "opacity-0" : "opacity-100"
              }`}
              alt="product"
              placeholder={
                <Image
                  preview={false}
                  src={`https://placehold.co/499x499?text=Loading`}
                />
              }
              onError={(e) => {
                e.target.width = 499;
                e.target.height = 499;
                e.target.src = "https://placehold.co/499x499?text=Not found";
              }}
            />
          </Image.PreviewGroup>
        </div>
      </div>
    </div>
  );
};

ProductImageGallery.propTypes = {
  images: PropTypes.array,
  maxVisibleThumbnails: PropTypes.number,
};

export default ProductImageGallery;
