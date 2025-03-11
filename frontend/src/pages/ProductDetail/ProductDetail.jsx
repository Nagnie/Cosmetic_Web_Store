import { useEffect, useState } from "react";
import {
  ProductActionMobile,
  ProductDetailInfo,
  ProductImageGallery,
} from "./components";
import { useScrollLock } from "@hooks/useScrollLock";
import CustomCarousel from "./components/CustomCarousel";
import { useQuery } from "@tanstack/react-query";
import productsApi from "@apis/productsApi";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["product", id],
    queryFn: ({ signal }) => productsApi.getProductDetail(id, { signal }),
  });

  const product = (data?.data || [])?.[0] || {};

  const images = (product.images || []).map((image) => ({
    id: image.id || image.src || image,
    src: image.src || image,
  }));

  const [showBottomSheet, setShowBottomSheet] = useState(false);

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

  const toggleBottomSheet = () => {
    setShowBottomSheet(!showBottomSheet);
  };

  const fetchRelatedBrandProducts = ({ pageParam = 1, limit = 8 }) => {
    if (!product?.id_pro) {
      return Promise.resolve({ data: [], meta: { total: 0 } });
    }
    return productsApi.getProductsByBrand(product.bra_name, {
      pageParam,
      limit,
    });
  };

  const fetchRelatedCategoryProducts = ({ pageParam = 1, limit = 8 }) => {
    if (!product?.id_pro) {
      return Promise.resolve({ data: [], meta: { total: 0 } });
    }
    return productsApi.getProductsByCategory(product.scat_name, {
      pageParam,
      limit,
    });
  };

  return (
    <div className="mx-auto mt-35 mb-4 pt-10 sm:px-4">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <ProductImageGallery images={images} />
        </div>
        <div className={showBottomSheet ? "hidden md:block" : "block"}>
          <ProductDetailInfo
            product={product}
            isShowBottomSheet={showBottomSheet}
          />
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
      {product?.id_pro && (
        <div>
          <h2 className={`text-primary-dark mt-10 mb-4 text-3xl font-semibold`}>
            Sản phẩm cùng brand
          </h2>
          <div>
            <CustomCarousel
              queryKey={["relatedBrandProducts", product.bra_name, id]}
              queryFn={fetchRelatedBrandProducts}
              title="Sản phẩm cùng brand"
              emptyMessage="Không có sản phẩm cùng brand"
              itemsPerPage={8}
            />
          </div>
        </div>
      )}

      {/* Sản phẩm cùng danh mục */}
      {product?.id_pro && (
        <div>
          <h2 className={`text-primary-dark mt-10 mb-4 text-3xl font-semibold`}>
            Sản phẩm cùng danh mục
          </h2>
          <div>
            <CustomCarousel
              queryKey={["relatedCategoryProducts", product.scat_name, id]}
              queryFn={fetchRelatedCategoryProducts}
              title="Sản phẩm cùng danh mục"
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
            <ProductDetailInfo
              product={product}
              isShowBottomSheet={showBottomSheet}
            />
          </div>
        </div>
      )}

      <div className={`md:hidden ${showBottomSheet ? "hidden" : "block"}`}>
        <ProductActionMobile onCartClick={toggleBottomSheet} />
      </div>
    </div>
  );
};

export default ProductDetail;
