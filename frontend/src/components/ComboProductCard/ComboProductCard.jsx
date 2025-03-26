import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { BsCartPlus } from "react-icons/bs";
import { useAddCartItem } from "@hooks/useCartQueries";
import { toast } from "react-toastify";

const ComboProductCard = ({ combo }) => {
  const navigate = useNavigate();

  // Format price with dots as thousand separators and add VNĐ
  const formatPrice = (price) => {
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
  };

  // If no combo is provided, return null
  if (!combo) return null;

  // Extract the first image or use a placeholder
  const mainImage =
      combo.images && combo.images.length > 0
          ? combo.images[0]
          : "https://placehold.co/400x400/png?text=No+Image";

  const addCartItemMutation = useAddCartItem();

  const handleAddToCart = async () => {
    const item = {
      id_pro: combo.id_pro ?? combo?.id_combo ?? 0,
      id_class: combo?.id_class ?? 0,
      quantity: 1,
      type: combo.type || "combo",
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

  const handleBuyNow = async () => {
    const item = {
      id_pro: combo.id_pro ?? combo?.id_combo ?? 0,
      id_class: combo?.id_class ?? 0,
      quantity: 1,
      type: combo.type || "combo",
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

  const MAX_DISPLAY_PRODUCTS = 3;

  return (

      <div className="w-98 overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative">
          <img
              src={mainImage}
              alt={combo.name}
              className="h-80 w-full object-cover"
              onError={(e) => {
                e.target.src = "https://placehold.co/400x400/png?text=Image+Error";
              }}
          />
          {combo.origin_price && (
              <div className="bg-primary absolute top-0 right-0 m-3 rounded-full px-4 py-2 text-sm text-white line-through">
                {formatPrice(combo.origin_price)}
              </div>
          )}
          <div className="bg-primary-deepest absolute top-12 right-0 m-3 rounded-full px-4 py-2 text-white">
            {formatPrice(combo.price)}
          </div>
        </div>
        <div className="p-6">
          <Link to={`/combo/${combo.name}/${combo.id_combo}`} className="text-primary-dark mb-2 block text-2xl font-bold">
            {combo.name}
          </Link>
          <p className="mb-4 text-gray-600">{combo.description}</p>

          <div className="mt-6">
            <h3 className="text-primary-deepest mb-3 text-lg font-semibold">Sản phẩm trong combo:</h3>
            {combo.products && combo.products.length > 0 ? (
                <ul className="space-y-2">
                  {combo.products.slice(0, MAX_DISPLAY_PRODUCTS).map((product) => (
                      <li key={product.id_pro} className="flex justify-between">
                        <Link to={`/products/${encodeURIComponent(product.pro_name)}/${product.id_pro}`} className="text-primary-dark hover:text-orange-800 hover:underline">
                          {product.pro_name}
                        </Link>
                        <span className="text-gray-600">{formatPrice(product.pro_price)}</span>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-gray-500">Không có sản phẩm trong combo này</p>
            )}

            {combo.products.length > MAX_DISPLAY_PRODUCTS ? (
                <div className="mt-2 text-center">
                  <Link to={`/combo/${combo.name}/${combo.id_combo}`} className="text-primary-dark font-semibold hover:underline">
                    ...
                  </Link>
                </div>
            ) : (
                <div className={"mt-2 h-6"}>

                </div>
            )}

            <div className="mt-6 flex justify-center text-center">
              <button
                  onClick={handleBuyNow}
                  className="bg-primary hover:bg-primary-medium mx-2 flex items-center rounded-full px-6 py-2 font-bold text-white transition duration-300"
              >
                <FaShoppingBag size={18} />
                <span className="mx-2">Mua ngay</span>
              </button>
              <button
                  onClick={handleAddToCart}
                  className="bg-primary-light hover:bg-primary-light rounded-full px-6 py-2 font-bold text-white transition duration-300"
              >
                <BsCartPlus size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ComboProductCard;