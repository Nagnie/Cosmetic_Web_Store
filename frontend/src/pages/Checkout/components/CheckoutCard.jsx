import { formatCurrency } from "@utils/utils";
import { Image } from "antd";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SAMPLE_ITEM = {
  id: 1,
  name: "Nước Hoa Colorkey Rose Wild Violet Eau De Parfum",
  image:
    "https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg",
  quantity: 1,
  price: 229000,
};

const CheckoutCard = ({ item }) => {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <Link
        to={`/products/${encodeURIComponent(item.pro_name || item.name)}/${item.id_pro}`}
        className="relative w-1/6 cursor-pointer"
      >
        <div className="absolute -top-2.5 -right-3 z-10 flex items-center justify-center rounded bg-black/25 p-1 px-2 py-0.5 text-sm text-white shadow-md">
          {item?.quantity || SAMPLE_ITEM.quantity}
        </div>
        <Image
          className="aspect-square w-full object-contain"
          preview={false}
          loading="lazy"
          src={item?.images?.[0] || item?.image || SAMPLE_ITEM.image}
        />
      </Link>

      <div className="w-5/6">
        <Link
          to={`/products/${encodeURIComponent(item.pro_name || item.name)}/${item.id_pro}`}
          className="cursor-pointer text-[12px] font-semibold !text-black sm:text-sm"
        >
          {item?.name || item?.pro_name || SAMPLE_ITEM.name}
        </Link>

        <p className="text-xs text-gray-400 sm:text-sm">
          {item?.class_name || item?.class_name || SAMPLE_ITEM.class_name}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2"></div>
      </div>

      <div>
        <span className="text-sm font-semibold">
          {formatCurrency({
            number: item?.price || +item?.pro_price || SAMPLE_ITEM.price,
          })}
        </span>
      </div>
    </div>
  );
};

CheckoutCard.propTypes = {
  item: PropTypes.object.isRequired,
};

export default CheckoutCard;
