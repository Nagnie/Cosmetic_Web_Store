import { useState } from "react";

import {
  ProductActionMobile,
  ProductDetailInfo,
  ProductImageGallery,
} from "./components";
import { useScrollLock } from "@hooks/useScrollLock";
import CustomCarousel from "./components/CustomCarousel";

const ProductDetail = () => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useScrollLock(showBottomSheet);

  const toggleBottomSheet = () => {
    setShowBottomSheet(!showBottomSheet);
  };

  return (
    <div className="mx-auto mt-35 mb-4 pt-10 sm:px-4">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <ProductImageGallery />
        </div>
        {!showBottomSheet && (
          <div>
            <ProductDetailInfo isShowBottomSheet={showBottomSheet} />
          </div>
        )}
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              aliquam, nunc sed ultricies sollicitudin, metus ex ultricies
              libero, nec tincidunt diam nunc ac justo. Nullam nec eros
              pellentesque, ultricies dolor vel, tincidunt purus. Nulla
              facilisi. Nullam nec eros pellentesque, ultricies dolor vel,
              tincidunt purus. Nulla facilisi. Nullam nec eros pellentesque,
              ultricies dolor vel, tincidunt purus. Nulla facilisi.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className={`text-primary-dark mt-10 mb-4 text-3xl font-semibold`}>
          Sản phẩm cùng brand
        </h2>
        <div>
          <CustomCarousel />
        </div>
      </div>

      <div>
        <h2 className={`text-primary-dark mt-10 mb-4 text-3xl font-semibold`}>
          Sản phẩm cùng danh mục
        </h2>
        <div>
          <CustomCarousel />
        </div>
      </div>

      {showBottomSheet && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 !bg-black !opacity-30"
            onClick={toggleBottomSheet}
          ></div>
          <div className="absolute right-0 bottom-0 left-0 max-h-[80vh] transform overflow-y-auto rounded-t-2xl bg-white p-4 shadow-lg transition-transform duration-300">
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gray-300"></div>
            <ProductDetailInfo isShowBottomSheet={showBottomSheet} />
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
