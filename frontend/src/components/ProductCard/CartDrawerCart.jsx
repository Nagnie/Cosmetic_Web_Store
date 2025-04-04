import { Image } from "antd";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import { QuantitySelector } from "@pages/ProductDetail/components";
import { formatCurrency } from "@utils/utils";
import { useRemoveCartItem, useUpdateCartItem } from "@hooks/useCartQueries";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const SAMPLE_ITEM = {
  id: 1,
  name: "Nước Hoa Colorkey Rose Wild Violet Eau De Parfum",
  image:
    "https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg",
  quantity: 1,
  price: 229000,
};

const CartDrawerCart = ({ item }) => {
  // console.log("CartDrawerCart", { item });
  const [error, setError] = useState(null);
  // Thêm local state để theo dõi số lượng hiện tại
  const [currentQuantity, setCurrentQuantity] = useState(item?.quantity || 1);

  // Cập nhật currentQuantity khi item.quantity thay đổi từ props
  useEffect(() => {
    if (item?.quantity) {
      setCurrentQuantity(item.quantity);
    }
  }, [item?.quantity]);

  const removeCartItemMutation = useRemoveCartItem();

  const handleRemoveItem = () => {
    removeCartItemMutation.mutate({
      id_pro: item.id_pro ?? item.id,
      id_class: item.id_class ?? 0,
      quantity: currentQuantity,
      type: item.type || "product",
    });
  };

  const updateCartItemMutation = useUpdateCartItem();

  const handleUpdateItem = (quantity) => {
    if (quantity === currentQuantity && !updateCartItemMutation.isPending) {
      return;
    }

    setError(null);
    setCurrentQuantity(quantity);

    updateCartItemMutation.mutate(
      {
        id_pro: item.id_pro ?? item.id,
        id_class: item.id_class ?? item.old_id_class ?? 0,
        quantity,
        old_id_class: item.id_class ?? item.old_id_class ?? 0,
        type: item.type || "product",
      },
      {
        onSuccess: () => {
          console.log("Cập nhật số lượng thành công:", quantity);
        },
        onError: (error) => {
          console.error("Lỗi khi cập nhật số lượng:", error);
          setError("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
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
          className="cursor-pointer text-[12px] font-semibold !text-black sm:text-sm"
        >
          {item?.name || item?.pro_name || SAMPLE_ITEM.name}
        </Link>

        <p className="text-xs">{item?.class_name}</p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
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
              width={28 * 4.5}
              height={28}
              value={currentQuantity}
              onChange={handleUpdateItem}
              disabled={updateCartItemMutation.isPending}
            />
          )}
          <span className="text-sm font-semibold">
            {formatCurrency({
              number: item?.price || +item?.pro_price || SAMPLE_ITEM.price,
            }) || "229.000 đ"}
          </span>
        </div>

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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
};

export default CartDrawerCart;
