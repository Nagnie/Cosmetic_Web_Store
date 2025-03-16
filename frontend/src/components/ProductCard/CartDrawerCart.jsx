import { Image } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import { QuantitySelector } from "@pages/ProductDetail/components";
import { formatCurrency } from "@utils/utils";
import { useRemoveCartItem, useUpdateCartItem } from "@hooks/useCartQueries";
import { Link } from "react-router-dom";

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

  const removeCartItemMutation = useRemoveCartItem();

  const handleRemoveItem = () => {
    removeCartItemMutation.mutate({
      id_pro: item.id_pro,
      id_class: item.id_class ?? 0,
      quantity: item.quantity,
    });
  };

  const updateCartItemMutation = useUpdateCartItem();

  const handleUpdateItem = (quantity) => {
    updateCartItemMutation.mutate({
      id_pro: item.id_pro,
      id_class: item.id_class ?? item.old_id_class ?? 0,
      quantity,
      old_id_class: item.id_class,
    });
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3">
      <Link
        to={`/products/${encodeURIComponent(item.pro_name || item.name)}/${item.id_pro}`}
        className="w-1/5 cursor-pointer"
      >
        <Image
          className="aspect-square w-full"
          preview={false}
          loading="lazy"
          src={item?.images?.[0] || item?.image || SAMPLE_ITEM.image}
        />
      </Link>

      <div className="w-4/5">
        <Link
          to={`/products/${encodeURIComponent(item.pro_name || item.name)}/${item.id_pro}`}
          className="cursor-pointer text-[12px] font-semibold !text-black sm:text-sm"
        >
          {item?.name || item?.pro_name || SAMPLE_ITEM.name}
        </Link>

        <p className="text-xs">{item?.class_name}</p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantitySelector
            initialValue={item?.quantity || 1}
            width={28 * 3}
            height={28}
            value={item?.quantity || 1}
            onChange={handleUpdateItem}
          />
          <span className="text-sm font-semibold">
            {formatCurrency({
              number: item?.price || +item?.pro_price || SAMPLE_ITEM.price,
            }) || "229.000 đ"}
          </span>
        </div>
      </div>

      <div className="cursor-pointer" onClick={() => handleRemoveItem()}>
        <CloseOutlined />
      </div>
    </div>
  );
};

CartDrawerCart.propTypes = {
  item: PropTypes.object,
};

export default CartDrawerCart;
