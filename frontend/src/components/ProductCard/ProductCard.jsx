import { useAddCartItem } from "@hooks/useCartQueries";
import { formatCurrency } from "@utils/utils";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import {FaShoppingBag} from "react-icons/fa";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  // console.log(product);
  const addCartItemMutation = useAddCartItem();
  const [isHovered, setIsHovered] = useState(false);
  const images = useMemo(() => {
    if (product.images && typeof product.images === "string") {
      return JSON.parse(product.images);
    }

    return product.images;
  }, [product.images]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    const item = {
      id_pro: product.id_pro,
      id_class: product.classification[0]?.id_class ?? 0,
      quantity: 1,
    };

    addCartItemMutation.mutate(item);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Add to cart first
    const item = {
      id_pro: product.id_pro,
      id_class: product.classification[0]?.id_class ?? 0,
      quantity: 1,
    };

    addCartItemMutation.mutate(item, {
      onSuccess: () => {
        // Navigate to checkout page
        window.location.href = "/checkout";
      }
    });
  };

  // Determine product status
  const productStatus = product.status ? "Available" : "Order";

  return (
      <Link
          to={`/products/${encodeURIComponent(product.pro_name || product.name)}/${product.id_pro}`}
          className="flex h-100 w-full flex-col rounded-lg p-4 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product status badge */}
        <div
            className={`absolute top-8 right-0 shadow py-1 px-3 rounded font-semibold ${
                product.status === "Available" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
            }`}
        >
          { product.status }
        </div>

        <img
            loading="lazy"
            src={images?.[0] ?? "https://placehold.co/276x350?text=No%20Image"}
            alt={product.pro_name || product.name}
            className="h-60 w-full rounded object-cover"
        />
        <div className="mt-2">
          <h3 className="text-lg text-left text-primary-deepest font-bold">
            {product.pro_name || product.name}
          </h3>
        </div>
        <div className="mt-2 text-left font-medium">
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
                className="absolute inset-0 rounded-lg flex items-center justify-center gap-2 overflow-hidden"
                initial={{ opacity: 0, y: 20 }} // Bắt đầu ở dưới (y: 20px)
                animate={{ opacity: 1, y: 0 }} // Di chuyển lên vị trí gốc
                exit={{ opacity: 0, y: 20 }} // Khi mất đi, trượt xuống lại
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <button
                  className="bg-white mt-7 text-primary py-2 px-4 rounded flex items-center gap-1 hover:bg-amber-100 transition-colors"
                  onClick={handleBuyNow}
              >
                <FaShoppingBag size={18} />
                <span>Mua ngay</span>
              </button>
              <button
                  className="bg-white mt-7 text-primary py-2 px-4 rounded flex items-center gap-1 hover:bg-amber-50  transition-colors"
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
