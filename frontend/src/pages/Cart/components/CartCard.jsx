import { ConfigProvider, Image, Select } from "antd";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import { QuantitySelector } from "@pages/ProductDetail/components";
import { formatCurrency } from "@utils/utils";
import { useRemoveCartItem, useUpdateCartItem } from "@hooks/useCartQueries";
import { Link } from "react-router-dom";
import { useState } from "react";

const SAMPLE_ITEM = {
  id: 1,
  name: "Nước Hoa Colorkey Rose Wild Violet Eau De Parfum",
  image:
    "https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg",
  quantity: 1,
  price: 229000,
};

const CartDrawerCart = ({ item, availableClassifications }) => {
  const [error, setError] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(item?.quantity || 1);

  const removeCartItemMutation = useRemoveCartItem();

  const handleRemoveItem = () => {
    removeCartItemMutation.mutate({
      id_pro: item.id_pro ?? item.id,
      id_class: item.id_class ?? 0,
      quantity: item.quantity,
      type: item.type || "product",
    });
  };

  const updateCartItemMutation = useUpdateCartItem();

  const handleUpdateItem = (quantity, newIdClass) => {
    if (quantity === currentQuantity && newIdClass === item.id_class) return;

    setError(null);
    setCurrentQuantity(quantity);

    updateCartItemMutation.mutate(
      {
        id_pro: item.id_pro ?? item.id,
        id_class: newIdClass ?? item.id_class ?? 0,
        quantity,
        old_id_class: item.id_class ?? item.old_id_class ?? 0,
        type: item.type || "product",
      },
      {
        onSuccess: () => {
          console.log("Cập nhật item thành công:", quantity);
        },
        onError: (error) => {
          console.error("Lỗi khi cập nhật item:", error);
          if (newIdClass) {
            setError("Không thể cập nhật phân loại. Vui lòng thử lại sau.");
          } else setError("Không thể cập nhật số lượng. Vui lòng thử lại sau.");

          setCurrentQuantity(item?.quantity || 1);
        },
      },
    );
  };

  return (
    <div className="flex w-full justify-between gap-2 sm:gap-3">
      <Link
        to={
          item.type === "product"
            ? `/products/${encodeURIComponent(item?.pro_name ?? item?.name)}/${item?.id_pro ?? item?.id}`
            : `/combo/${encodeURIComponent(item.name)}/${item.id}`
        }
        className="w-1/5 cursor-pointer"
      >
        <Image
          className="aspect-square w-full"
          preview={false}
          loading="lazy"
          src={
            item?.images?.[0] || item?.image
            // || SAMPLE_ITEM.image
          }
          fallback="https://placehold.co/499x499?text=Not+found"
        />
      </Link>

      <div className="w-4/5">
        <Link
          to={
            item.type === "product"
              ? `/products/${encodeURIComponent(item?.pro_name ?? item?.name)}/${item?.id_pro ?? item?.id}`
              : `/combo/${encodeURIComponent(item.name)}/${item.id}`
          }
          className="!hover:text-primary !sm:text-lg cursor-pointer !text-[14px] !font-semibold !text-black"
        >
          {item?.name || item?.pro_name || SAMPLE_ITEM.name}
        </Link>

        {availableClassifications && availableClassifications?.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: "#9b9b9b" }}
            >
              Phân loại:
            </span>
            <ConfigProvider
              theme={{
                components: {
                  Select: {
                    colorPrimary: "#91775E",
                    colorBorder: "#C8B6A6",
                    controlItemBgActive: "#F1DEC9",
                    controlItemBgHover: "#F1DEC9",
                    optionSelectedBg: "#F1DEC9",
                    optionSelectedColor: "#574A3A",
                    hoverBorderColor: "#91775E",
                  },
                },
              }}
            >
              <Select
                value={item?.id_class || 0}
                loading={updateCartItemMutation.isPending}
                onChange={(value) => {
                  handleUpdateItem(item?.quantity, value);
                }}
              >
                {availableClassifications.map((classification) => (
                  <Select.Option
                    key={classification.id_class}
                    value={classification.id_class}
                  >
                    {classification.name}
                  </Select.Option>
                ))}
              </Select>
            </ConfigProvider>
          </div>
        )}

        <div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            {updateCartItemMutation.isPending ? (
              <div className="flex h-7 items-center px-4">
                <LoadingOutlined className="text-secondary-deep" />
                <span className="ml-2 text-xs text-gray-500">
                  Đang cập nhật...
                </span>
              </div>
            ) : (
              <QuantitySelector
                initialValue={currentQuantity}
                width={35 * 3}
                height={35}
                value={currentQuantity}
                onChange={handleUpdateItem}
                disabled={updateCartItemMutation.isPending}
              />
            )}
            <span className="font-semibold sm:text-lg">
              {formatCurrency({
                number: item?.price || +item?.pro_price || SAMPLE_ITEM.price,
              })}
            </span>
          </div>

          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>

      <div
        className={`cursor-pointer ${removeCartItemMutation.isPending ? "opacity-50" : ""}`}
        onClick={() => !removeCartItemMutation.isPending && handleRemoveItem()}
      >
        {removeCartItemMutation.isPending ? (
          <LoadingOutlined />
        ) : (
          <CloseOutlined />
        )}
      </div>
    </div>
  );
};

CartDrawerCart.propTypes = {
  item: PropTypes.object,
  availableClassifications: PropTypes.array,
};

export default CartDrawerCart;
