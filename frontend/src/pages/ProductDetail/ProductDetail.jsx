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
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: ({ signal }) => productsApi.getProductDetail(id, { signal }),
    staleTime: 1000 * 60 * 5, // 5 minutes
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

  return (
    <div className="mx-auto mt-35 mb-4 pt-10 sm:px-4">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <ProductImageGallery images={images} />
        </div>
        <div className={showBottomSheet ? "hidden md:block" : "block"}>
          {isLoading ? (
            <ProductDetailInfoSkeleton isShowBottomSheet={showBottomSheet} />
          ) : (
            <ProductDetailInfo
              product={product}
              isShowBottomSheet={showBottomSheet}
            />
          )}
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center">
          <div className="bg-primary-dark flex items-center justify-between px-6 py-3 text-white">
            <span>Mô tả sản phẩm</span>
          </div>
        </div>

        <div className="mt-4 text-justify">
          <div className="mt-5">
            <p className="text-primary-dark">
              {product?.description || "Không có mô tả cho sản phẩm này."}
            </p>
          </div>
        </div>
      </div>

      {/* Sản phẩm cùng brand */}
      {shouldRenderCarousels && (
        <div>
          <h2 className={`text-primary-dark mt-10 mb-4 text-3xl font-semibold`}>
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
        <div>
          <h2 className={`text-primary-dark mt-10 mb-4 text-3xl font-semibold`}>
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
        <ProductActionMobile
          product={product}
          onCartClick={toggleBottomSheet}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
