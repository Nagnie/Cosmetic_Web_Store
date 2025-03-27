import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  CustomCarousel,
  ProductActionMobile,
  ProductDetailInfo,
  ProductDetailInfoSkeleton,
  ProductImageGallery,
} from "./components";
import { useScrollLock } from "@hooks/useScrollLock";
import productsApi from "@apis/productsApi";

const ProductDetail = () => {
  const { id } = useParams();
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Fetch product details with React Query
  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: ({ signal }) => productsApi.getProductDetail(id, { signal }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Giới hạn số lần thử lại khi gặp lỗi
  });

  // Memoize product data to prevent unnecessary re-renders
  const product = useMemo(() => (data?.data || [])?.[0] || {}, [data]);

  // Memoize images array to prevent recreation on every render
  const images = useMemo(
    () =>
      (product.images || []).map((image) => ({
        id: image.id || image.src || image,
        src: image.src || image,
      })),
    [product.images],
  );

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Handle responsive behavior for bottom sheet
  useEffect(() => {
    const handleResize = () => {
      if (showBottomSheet && window.innerWidth > 768) {
        setShowBottomSheet(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showBottomSheet]);

  useScrollLock(showBottomSheet);

  // Memoize toggle function to prevent recreation on every render
  const toggleBottomSheet = useCallback(() => {
    setShowBottomSheet((prev) => !prev);
  }, []);

  // Memoize query functions to prevent recreations on every render
  const fetchRelatedBrandProducts = useCallback(
    ({ pageParam = 1, limit = 8 }) => {
      if (!product?.id_pro || !product?.bra_name) {
        return Promise.resolve({
          data: { data: [], total_items: 0, page: 1, total_pages: 1 },
        });
      }
      return productsApi.getProductsByBrand(
        {
          brandName: product.bra_name,
          id_pro: product.id_pro,
        },
        {
          pageParam,
          limit,
        },
      );
    },
    [product?.id_pro, product?.bra_name],
  );

  const fetchRelatedCategoryProducts = useCallback(
    ({ pageParam = 1, limit = 8 }) => {
      if (!product?.id_pro || !product?.scat_name) {
        return Promise.resolve({
          data: { data: [], total_items: 0, page: 1, total_pages: 1 },
        });
      }
      return productsApi.getProductsByCategory(
        {
          categoryName: product.scat_name,
          id_pro: product.id_pro,
        },
        {
          pageParam,
          limit,
        },
      );
    },
    [product?.id_pro, product?.scat_name],
  );

  // Memoize query keys to prevent recreations
  const brandProductsQueryKey = useMemo(
    () => ["relatedBrandProducts", product?.bra_name, id],
    [product?.bra_name, id],
  );

  const categoryProductsQueryKey = useMemo(
    () => ["relatedCategoryProducts", product?.scat_name, id],
    [product?.scat_name, id],
  );

  // Don't render carousels until we have product data
  const shouldRenderCarousels = !!product?.id_pro;

  // Hiển thị thông báo lỗi
  const renderErrorMessage = () => {
    if (!isError) return null;

    let errorMessage = "Đã xảy ra lỗi khi tải thông tin sản phẩm.";

    // Xử lý các loại lỗi cụ thể
    if (error?.response) {
      // Lỗi phản hồi từ server
      const status = error.response.status;
      if (status === 404) {
        errorMessage =
          "Không tìm thấy sản phẩm này. Sản phẩm có thể đã bị xóa hoặc không tồn tại.";
      } else if (status >= 500) {
        errorMessage = "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";
      }
    } else if (error?.request) {
      // Lỗi không nhận được phản hồi từ server
      errorMessage =
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.";
    }

    return (
      <div className="my-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {/* Biểu tượng cảnh báo */}
            <svg
              className="h-5 w-5 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="w-full text-center text-sm font-medium">
              {errorMessage}
            </p>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => refetch()}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto mt-40 mb-5 pt-10 sm:px-4">
      {/* Hiển thị thông báo lỗi ở đầu trang */}
      {renderErrorMessage()}

      {/* Nếu đang tải hoặc có lỗi, vẫn hiển thị UI, nhưng trong trường hợp có lỗi, hiển thị nội dung thông báo */}
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          {!isError && <ProductImageGallery images={images} />}
          {isError && (
            <div className="flex h-80 items-center justify-center rounded-md bg-gray-100">
              <span className="text-gray-500">
                Không thể tải hình ảnh sản phẩm
              </span>
            </div>
          )}
        </div>
        <div className={showBottomSheet ? "hidden md:block" : "block"}>
          {isLoading ? (
            <ProductDetailInfoSkeleton isShowBottomSheet={showBottomSheet} />
          ) : isError ? (
            <div className="rounded-md border p-4">
              <h2 className="mb-2 text-xl text-gray-700">
                Thông tin sản phẩm không khả dụng
              </h2>
              <p className="text-gray-500">
                Vui lòng thử lại sau hoặc xem các sản phẩm khác.
              </p>
            </div>
          ) : (
            <ProductDetailInfo
              product={product}
              isShowBottomSheet={showBottomSheet}
            />
          )}
        </div>
      </div>

      {!isError && (
        <>
          <div className="mt-15">
            <div className="flex items-center">
              <div className="bg-primary-dark text-xl flex items-center justify-between rounded px-6 py-3 text-white">
                <span>Mô tả sản phẩm</span>
              </div>
            </div>

            <div className="mt-8 text-justify">
              <div className="mt-5">
                <p className="text-primary-dark text-xl">
                  {product?.description || "Không có mô tả cho sản phẩm này."}
                </p>
              </div>
            </div>
          </div>

          {/* Sản phẩm cùng brand */}
          {shouldRenderCarousels && (
            <div>
              <h2
                className={`text-primary-dark mt-15 mb-6 text-3xl font-semibold`}
              >
                Sản phẩm cùng brand
              </h2>
              <div>
                <CustomCarousel
                  queryKey={brandProductsQueryKey}
                  queryFn={fetchRelatedBrandProducts}
                  emptyMessage="Không có sản phẩm cùng brand"
                  itemsPerPage={8}
                />
              </div>
            </div>
          )}

          {/* Sản phẩm cùng danh mục */}
          {shouldRenderCarousels && (
            <div className={"mb-10"}>
              <h2
                className={`text-primary-dark mt-10 mb-6 text-3xl font-semibold`}
              >
                Sản phẩm cùng danh mục
              </h2>
              <div>
                <CustomCarousel
                  queryKey={categoryProductsQueryKey}
                  queryFn={fetchRelatedCategoryProducts}
                  emptyMessage="Không có sản phẩm cùng danh mục"
                  itemsPerPage={8}
                />
              </div>
            </div>
          )}
        </>
      )}

      {showBottomSheet && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 !bg-black !opacity-30"
            onClick={toggleBottomSheet}
          ></div>
          <div className="absolute right-0 bottom-0 left-0 max-h-[80vh] transform overflow-y-auto rounded-t-2xl bg-white p-4 shadow-lg transition-transform duration-300">
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gray-300"></div>
            {isLoading ? (
              <ProductDetailInfoSkeleton isShowBottomSheet={showBottomSheet} />
            ) : isError ? (
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Không thể tải thông tin sản phẩm
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Vui lòng thử lại sau.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    refetch();
                    toggleBottomSheet();
                  }}
                  className="bg-primary-dark mt-4 w-full rounded-md px-4 py-2 text-white"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <ProductDetailInfo
                product={product}
                isShowBottomSheet={showBottomSheet}
              />
            )}
          </div>
        </div>
      )}

      <div className={`md:hidden ${showBottomSheet ? "hidden" : "block"}`}>
        {!isError && (
          <ProductActionMobile
            product={product}
            onCartClick={toggleBottomSheet}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
