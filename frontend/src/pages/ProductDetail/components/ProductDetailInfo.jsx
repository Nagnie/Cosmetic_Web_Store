import { useState } from "react";
import { Button, Tag } from "antd";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

import QuantitySelector from "./QuantitySelector";
import { formatCurrency } from "@utils/utils";
import { useAddCartItem } from "@hooks/useCartQueries";

const ProductDetailInfo = ({ isShowBottomSheet = false, product = {} }) => {
  const [selectedClassification, setSelectedClassification] = useState(null);

  const classification = product.classification ?? [];
  const [quantity, setQuantity] = useState(1);

  const addCartItemMutation = useAddCartItem();

  const handleAddToCart = async () => {
    const item = {
      id_pro: product.id_pro,
      id_class:
        selectedClassification?.id_class ?? classification[0]?.id_class ?? 0,
      quantity: quantity,
      type: product.type || "product",
    };

    try {
      const res = await addCartItemMutation.mutateAsync(item);

      if (res && res.cart && res.cart.length > 0) {
        toast.success("Thêm vào giỏ hàng thành công");
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const navigate = useNavigate();
  const handleBuyNow = async () => {
    const item = {
      id_pro: product.id_pro,
      id_class:
        selectedClassification?.id_class ?? classification[0]?.id_class ?? 0,
      quantity: quantity,
      type: product.type || "product",
    };

    try {
      const res = await addCartItemMutation.mutateAsync({
        ...item,
        isBuyNow: true,
      });

      if (res && res.cart && res.cart.length > 0) {
        navigate("/checkout");
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  return (
    <div className="text-left">
      <div className="text-primary-dark text-left text-xl font-bold md:text-2xl">
        {product.pro_name ??
          `[DEAL 26/2 - 10/3 HĐ 229K COLORKEY TẶNG 1 GƯƠNG TRANG ĐIỂM COLORKEY + 1
        BÔNG MÚT COLORKEY] Nước Hoa Colorkey Rose Wild Violet Eau De Parfum`}
      </div>
      <div>
        <Tag
          title="Thương hiệu"
          bordered={false}
          className="!rounded-full"
          color="magenta"
        >
          <Link
            to={`/all_products?brand=${product.bra_name}`}
            className="!text-primary !font-bold"
          >
            {product.bra_name ?? "Colorkey"}
          </Link>
        </Tag>
        <Tag
          title="Danh mục"
          bordered={false}
          className="!rounded-full !font-bold"
          color="blue"
        >
          <Link to={`/all_products?category=${product.cat_name}`}>
            {product.cat_name ?? "Nước hoa"}
          </Link>
        </Tag>
        <Tag
          title="Tình trạng"
          bordered={false}
          className="!rounded-full !font-bold"
          color="green"
        >
          {product.pro_status ?? "Còn hàng"}
        </Tag>
      </div>
      <div className="!mt-4">
        <Tag
          title="Giá"
          bordered={false}
          className="!text-primary-dark !flex w-full !items-center !rounded-full !p-2 !px-4 !text-xl !font-bold"
          color="red"
        >
          {(() => {
            const originalPrice = product.origin_price ?? 299000;
            const discountedPrice = product.price ?? 229000;
            const discountPercentage = Math.round(
              ((originalPrice - discountedPrice) / originalPrice) * 100,
            );

            return (
              <>
                <span className="!flex !items-center">
                  <span className="!mr-2 !text-base !text-gray-400 !line-through">
                    {formatCurrency({
                      number: originalPrice,
                    }) ?? "299.000 đ"}
                  </span>
                  <span className="!text-2xl !font-bold">
                    {formatCurrency({
                      number: discountedPrice,
                    }) ?? "229.000 đ"}
                  </span>
                </span>
                {discountPercentage > 0 && (
                  <span className="!bg-secondary-deep !ml-2 !inline-flex !-translate-y-4 !transform !items-center !rounded-md !px-2 !py-1 !text-xs !font-bold !text-white">
                    -{discountPercentage}%
                  </span>
                )}
              </>
            );
          })()}
        </Tag>
      </div>
      {classification.length > 0 && (
        <div className="!mt-4">
          <span className="!font-bold">Phân loại</span>

          <div className="!mt-2 !flex !flex-wrap text-sm">
            {classification.map((item, index) => (
              <Tag
                key={index}
                title={item.name ?? item}
                onClick={() => setSelectedClassification(item)}
                className={`${
                  selectedClassification?.id_class === item.id_class
                    ? "!-translate-y-[1px] !shadow-[0_4px_10px_rgba(87,74,58,0.2),0_0_2px_rgba(87,74,58,0.3)]"
                    : ""
                } !border-primary-dark !text-primary-dark !flex !h-[35px] !w-fit cursor-pointer !items-center !justify-between bg-white !px-4 !font-bold !transition-all !duration-200`}
              >
                {item.name ?? item}
              </Tag>
            ))}
          </div>
        </div>
      )}
      <div className={`!mt-10 ${isShowBottomSheet ? "" : "hidden md:block"}`}>
        <div className="flex items-center space-x-4">
          <span className="font-bold">SỐ LƯỢNG:</span>
          <QuantitySelector onChange={setQuantity} />
        </div>

        <div className="mt-4 flex h-[90px] w-full flex-col gap-2 sm:flex-row sm:gap-4 md:h-auto">
          <Button
            type="default"
            icon={<ShoppingCartOutlined />}
            size="large"
            onClick={() => handleAddToCart()}
            className="!bg-secondary !border-secondary !text-primary-dark flex flex-1 items-center justify-center"
          >
            Thêm vào giỏ
          </Button>

          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            size="large"
            onClick={() => handleBuyNow()}
            className="!bg-primary-dark !border-primary-dark flex flex-1 items-center justify-center !text-white"
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

ProductDetailInfo.propTypes = {
  isShowBottomSheet: PropTypes.bool,
  product: PropTypes.object,
};

export default ProductDetailInfo;
