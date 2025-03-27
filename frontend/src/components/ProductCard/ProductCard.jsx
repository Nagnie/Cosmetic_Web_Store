import { useAddCartItem } from "@hooks/useCartQueries";
import { formatCurrency } from "@utils/utils";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { FaShoppingBag } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // console.log(product);
  const addCartItemMutation = useAddCartItem();
  const [isHovered, setIsHovered] = useState(false);
  const images = useMemo(() => {
    if (product.images && typeof product.images === "string") {
      return JSON.parse(product.images);
    }

    return product.images;
  }, [product.images]);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const item = {
      id_pro: product.id_pro,
      id_class: product.classification[0]?.id_class ?? 0,
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

  const handleBuyNow = async (e) => {
    e.preventDefault();

    const item = {
      id_pro: product.id_pro,
      id_class: product.classification[0]?.id_class ?? 0,
      quantity: 1,
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
    <Link
      to={`/products/${encodeURIComponent(product.pro_name || product.name)}/${product.id_pro}`}
      className="relative flex h-100 w-full flex-col rounded-lg p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product status badge */}
      <div
        className={`absolute top-8 right-0 rounded px-3 py-1 font-semibold shadow ${
          product.status === "Có sẵn"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {product.status}
      </div>

      <img
        loading="lazy"
        src={
          images?.[0] === "" || images?.[0] === undefined || images === null
            ? "https://placehold.co/276x350?text=No%20Image"
            : images?.[0]
        }
        alt={product.pro_name || product.name}
        className="h-60 w-full rounded object-cover"
      />
      <div className="mt-2">
        <h3 className="text-primary-deepest text-left text-lg font-bold">
          {product.pro_name || product.name}
        </h3>
      </div>
      <div className="text-left font-medium text-gray-400 line-through">
        <span className="text-sm">
          {formatCurrency({
            number: Number(product.origin_price),
            useFullCurrencyName: true,
          })}
        </span>
      </div>
      <div className="text-left font-semibold text-amber-900">
        <span className="text-lg">
          {formatCurrency({
            number: Number(product.price),
            useFullCurrencyName: true,
          })}
        </span>
      </div>

      {/* Hover action buttons */}
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
            onClick={handleBuyNow}
          >
            <FaShoppingBag size={18} />
            <span>Mua ngay</span>
          </button>
          <button
            className="text-primary mt-7 flex items-center gap-1 rounded bg-white px-4 py-2 transition-colors hover:bg-amber-50"
            onClick={handleAddToCart}
          >
            <BsCartPlus size={22} />
          </button>
        </motion.div>
      )}
    </Link>
  );
};

export default ProductCard;
