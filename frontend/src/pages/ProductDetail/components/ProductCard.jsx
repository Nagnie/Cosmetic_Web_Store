import { Image } from "antd";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import { FaShoppingBag } from "react-icons/fa";
import { motion } from "framer-motion";

import { formatCurrency } from "@utils/utils";
import { useAddCartItem } from "@hooks/useCartQueries";
import { toast } from "react-toastify";

const SAMPLE_PRODUCT = {
  images: [
    "https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg",
  ],
  brand: "Colorkey",
  name: "[DEAL 26/2 - 10/3 HĐ 229K COLORKEY TẶNG 1 GƯƠNG TRANG ĐIỂM COLORKEY + 1 BÔNG MÚT COLORKEY] Nước Hoa Colorkey Rose Wild Violet Eau De Parfum",
  price: 229000,
};

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const classification = product.classification ?? [];

  const addCartItemMutation = useAddCartItem();

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const item = {
      id_pro: product.id_pro,
      id_class: classification[0]?.id_class ?? 0,
      quantity: 1,
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
  const handleBuyNow = async (e) => {
    e.preventDefault();
    const item = {
      id_pro: product.id_pro,
      id_class: classification[0]?.id_class ?? 0,
      quantity: 1,
      type: product.type || "product",
    };

    try {
      const res = await addCartItemMutation.mutateAsync(item);

      if (res && res.cart && res.cart.length > 0) {
        toast.success("Thêm vào giỏ hàng thành công");
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
    <div>
      <div
        className="product-image relative aspect-square p-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={`/products/${encodeURIComponent(product.pro_name)}/${product.id_pro}`}
          className="aspect-square w-full"
        >
          <Image
            preview={false}
            src={
              product.images?.[0] || product.image || SAMPLE_PRODUCT.images[0]
            }
            alt="product"
            className="aspect-square w-full cursor-pointer object-contain"
          />
        </Link>
        {isHovered && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-2 overflow-hidden rounded-lg"
            initial={{ opacity: 0, y: 20 }} // Bắt đầu ở dưới (y: 20px)
            animate={{ opacity: 1, y: 0 }} // Di chuyển lên vị trí gốc
            exit={{ opacity: 0, y: 20 }} // Khi mất đi, trượt xuống lại
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <button
              className="text-primary mt-7 flex items-center gap-1 rounded bg-white px-4 py-2 transition-colors hover:bg-amber-100"
              onClick={(e) => handleBuyNow(e)}
            >
              <FaShoppingBag size={18} />
              <span>Mua ngay</span>
            </button>
            <button
              className="text-primary mt-7 flex items-center gap-1 rounded bg-white px-4 py-2 transition-colors hover:bg-amber-50"
              onClick={(e) => handleAddToCart(e)}
            >
              <BsCartPlus size={22} />
            </button>
          </motion.div>
        )}
      </div>
      <div className="product-info p-2 text-left">
        <div>
          <div className="text-[10px] font-bold uppercase">
            {product.brand || product.bra_name || SAMPLE_PRODUCT.brand}
          </div>
        </div>
        <h3
          title={product.pro_name || SAMPLE_PRODUCT.name}
          className="line-clamp-2 font-medium"
        >
          <Link
            to={`/products/${encodeURIComponent(product.pro_name)}/${product.id_pro}`}
          >
            {product.pro_name || SAMPLE_PRODUCT.name}
          </Link>
        </h3>
        <div>
          <span className="!mr-2 !text-[10px] font-bold !text-gray-400 !line-through">
            {formatCurrency({
              number:
                product.origin_price ?? product.pro_origin_price ?? 299000,
            }) ?? "299.000 đ"}
          </span>
          <span className="text-primary-dark font-bold">
            {formatCurrency({
              number:
                Number(product.price || product.pro_price) ||
                SAMPLE_PRODUCT.price,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
