import { useState } from "react";
import {
  ProductActionMobile,
  ProductDetailInfo,
  ProductImageGallery,
} from "./components";
import { useScrollLock } from "@hooks/useScrollLock";

const ProductDetail = () => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useScrollLock(showBottomSheet);

  const toggleBottomSheet = () => {
    setShowBottomSheet(!showBottomSheet);
  };

  return (
    <div className="container mx-auto mb-4 px-4">
      <div className="mt-35 grid w-full grid-cols-1 gap-4 pt-10 md:grid-cols-2">
        <div>
          <ProductImageGallery />
        </div>
        {!showBottomSheet && (
          <div>
            <ProductDetailInfo isShowBottomSheet={showBottomSheet} />
          </div>
        )}
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
