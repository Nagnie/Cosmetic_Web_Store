import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import { useModalStore } from "@components/Modal";
import { VoucherModalContent } from "@components/Modal/Content";

import "./VoucherCurvedSlider.css";

const VoucherCurvedSlider = ({
  items = [],
  itemsToShow = 5,
  autoSlide = false,
  autoSlideInterval = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const animationTimeoutRef = useRef(null);

  // Định nghĩa khoảng cách giữa các item
  const itemGap = 20;
  const itemWidth = 280;

  // Memoized function để tránh tạo lại hàm trong mỗi render
  const responsiveItemsToShow = useCallback(() => {
    if (viewportWidth >= 1200) return itemsToShow;
    if (viewportWidth >= 768) return Math.max(3, itemsToShow - 2);
    if (viewportWidth >= 480) return Math.max(2, itemsToShow - 3);
    return 1;
  }, [viewportWidth, itemsToShow]);

  const currentItemsToShow = responsiveItemsToShow();
  const halfItemsToShow = Math.floor(currentItemsToShow / 2);

  // Xác định số lượng items hiển thị dựa trên kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    // Sử dụng debounce để tránh gọi quá nhiều lần khi resize
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    handleResize(); // Gọi khi khởi tạo

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Tự động trượt nếu được bật
  useEffect(() => {
    let interval;
    if (autoSlide && items.length > 1) {
      interval = setInterval(() => {
        if (!isAnimating) {
          handleNext();
        }
      }, autoSlideInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSlide, autoSlideInterval, isAnimating, items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating]);

  // Reset trạng thái animation sau khi hoàn tất
  useEffect(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Thời gian bằng với thời gian transition

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    if (isAnimating || items.length <= 1) return;
    setIsAnimating(true);

    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? items.length - 1 : newIndex;
    });
  }, [isAnimating, items.length]);

  const handleNext = useCallback(() => {
    if (isAnimating || items.length <= 1) return;
    setIsAnimating(true);

    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex >= items.length ? 0 : newIndex;
    });
  }, [isAnimating, items.length]);

  // Xử lý touch events cho mobile
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX; // Reset touchEnd
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isAnimating || items.length <= 1) return;

    // Swipe threshold
    const minSwipeDistance = 50;
    const swipeDistance = touchEndX.current - touchStartX.current;

    if (swipeDistance > minSwipeDistance) {
      handlePrev();
    } else if (swipeDistance < -minSwipeDistance) {
      handleNext();
    }
  }, [isAnimating, items.length, handlePrev, handleNext]);

  // Xử lý click vào item
  const handleItemClick = useCallback(
    (index, position) => {
      // Nếu đang animating hoặc đã active rồi thì không làm gì
      if (position === 0 && !isAnimating) {
        handleShowVoucherModal();

        return;
      }

      if (isAnimating || position === 0 || items.length <= 1) return;

      setIsAnimating(true);
      setActiveIndex(index);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAnimating, items.length],
  );

  // Hàm xác định xem item có phải là item gây vấn đề không
  const isProblemItem = useCallback(
    (position, yPosition) => {
      // Các item phía bên phải và nằm quá thấp được coi là item gây vấn đề
      return position > halfItemsToShow * 0.8 && yPosition > 100;
    },
    [halfItemsToShow],
  );

  const showModal = useModalStore((state) => state.showModal);
  const hideModal = useModalStore((state) => state.hideModal);

  const activeItem = items[activeIndex];

  const handleShowVoucherModal = () => {
    // Khi click vào voucher, hiển thị modal với nội dung là VoucherModalContent
    showModal(
      <VoucherModalContent item={activeItem.metadata} onCancel={hideModal} />,
      {
        title: (
          <div className="text-primary-deepest pb-2 text-center text-2xl font-bold">
            Chi tiết voucher
          </div>
        ),
        width: window.innerWidth < 640 ? "90%" : 500,
        styles: {
          header: {
            backgroundColor: "#FAF5F0",
            borderBottom: "1px solid #C8B6A6",
          },
          body: {
            padding: 0,
            backgroundColor: "#FAF5F0",
          },
          content: {
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(145, 119, 94, 0.15)",
          },
        },
      },
    );
  };

  // Kiểm tra nếu không có items hoặc chỉ có 1 item
  if (!items.length) {
    return (
      <div className="voucher-slider-container empty">Không có dữ liệu</div>
    );
  }

  return (
    <div className="voucher-slider-outer-container">
      <div className="voucher-slider-container">
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            className="voucher-nav-button prev"
            disabled={isAnimating}
            aria-label="Voucher trước"
          >
            <span>&#10094;</span>
          </button>
        )}

        <div
          className="voucher-slider-overflow-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="voucher-slider-wrapper">
            <div className="voucher-curved-slider" ref={sliderRef}>
              {items.map((item, index) => {
                // Tính toán vị trí tương đối so với activeIndex
                let position = index - activeIndex;

                // Xử lý vòng tròn để các item luôn hiển thị liên tục
                if (position < -halfItemsToShow - 1) {
                  position += items.length;
                } else if (position > halfItemsToShow + 1) {
                  position -= items.length;
                }

                // Chỉ render các items trong phạm vi hiển thị mở rộng
                if (Math.abs(position) > halfItemsToShow + 2) {
                  return null;
                }

                // Tính góc xoay dựa trên vị trí, giảm dần khi ra xa
                const rotation = position * 4;

                // Hiển thị các item trong khoảng cần hiển thị
                const isVisible = Math.abs(position) <= halfItemsToShow + 0.5;

                // Xác định item mép
                const isEdgeItem = Math.abs(position) > halfItemsToShow;

                // Tăng hệ số độ cong cho đường parabol (bình phương)
                const yPositionFactor = Math.abs(position) < 1 ? 4 : 15;
                const yPosition =
                  Math.pow(Math.abs(position), 2) * yPositionFactor;

                // Giảm scale mạnh hơn cho các item ở xa
                const scaleFactor = Math.abs(position) < 1 ? 0.05 : 0.1;
                const scale =
                  1 - Math.min(0.3, Math.abs(position) * scaleFactor);

                // Xác định item gây vấn đề
                const hasProblem = isProblemItem(position, yPosition);

                // Các class động
                const itemClasses = [
                  "voucher-item",
                  isVisible ? "visible" : "hidden",
                  position === 0 ? "center" : "",
                  isEdgeItem ? "edge" : "",
                  isVisible && position !== 0 ? "clickable" : "",
                  hasProblem ? "problem-item" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={index}
                    className={itemClasses}
                    style={{
                      transform: `
                                                translateX(${position * (itemWidth + itemGap)}px) 
                                                translateY(${yPosition}px)
                                                rotate(${rotation}deg)
                                                scale(${scale})
                                            `,
                      zIndex: isVisible ? 10 - Math.abs(position) : -1,
                      opacity: isVisible
                        ? Math.max(0.4, 1 - Math.abs(position) * 0.25)
                        : 0,
                    }}
                    onClick={() => handleItemClick(index, position)}
                  >
                    <div className="voucher-inner">
                      {item.content}

                      {/* Đánh dấu phần đục lỗ trên voucher */}
                      <div className="voucher-hole left"></div>
                      <div className="voucher-hole right"></div>

                      {/* Đường đứt đoạn */}
                      <div className="voucher-dashed-line"></div>

                      {/* Thêm nút click để active cho các item chưa active */}
                      {position !== 0 && isVisible && !isEdgeItem && (
                        <div className="voucher-click-overlay">
                          <div className="click-indicator">
                            <span>Xem</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {items.length > 1 && (
          <button
            onClick={handleNext}
            className="voucher-nav-button next"
            disabled={isAnimating}
            aria-label="Voucher tiếp theo"
          >
            <span>&#10095;</span>
          </button>
        )}

        {/* Chỉ báo trang */}
        {items.length > 1 && (
          <div className="voucher-pagination">
            {items.map((_, index) => (
              <button
                key={index}
                className={`pagination-dot ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => {
                  if (!isAnimating && index !== activeIndex) {
                    setIsAnimating(true);
                    setActiveIndex(index);
                  }
                }}
                aria-label={`Voucher ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Hiển thị chỉ báo số trang */}
        {items.length > 1 && (
          <div className="voucher-page-counter">
            {activeIndex + 1} / {items.length}
          </div>
        )}
      </div>
    </div>
  );
};

VoucherCurvedSlider.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node.isRequired,
    }),
  ),
  itemsToShow: PropTypes.number,
  autoSlide: PropTypes.bool,
  autoSlideInterval: PropTypes.number,
};

export default VoucherCurvedSlider;
