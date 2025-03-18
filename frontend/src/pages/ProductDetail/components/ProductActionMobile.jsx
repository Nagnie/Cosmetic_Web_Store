import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAddCartItem } from "@hooks/useCartQueries";
import { toast } from "react-toastify";

const ProductActionMobile = ({ onCartClick, product }) => {
  const navigate = useNavigate();
  const classification = product.classification ?? [];

  const addCartItemMutation = useAddCartItem();

  const handleBuyNow = async () => {
    const item = {
      id_pro: product.id_pro,
      id_class: classification[0]?.id_class ?? 0,
      quantity: 1,
    };

    try {
      const res = await addCartItemMutation.mutateAsync(item);

      if (res && res.cart && res.cart.length > 0) {
        navigate("/cart");
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  };
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex h-14 items-center justify-between border-t border-gray-200 bg-white p-2 shadow-lg">
      <div className="!text-primary flex h-full flex-1 items-center justify-between">
        <div
          className="w-full cursor-pointer !text-2xl"
          onClick={() => navigate("/")}
        >
          <HomeOutlined />
        </div>
        <div className="!bg-primary h-[65%] w-[2px]"></div>
        <div className="w-full cursor-pointer !text-2xl" onClick={onCartClick}>
          <ShoppingCartOutlined />
        </div>
      </div>
      <div
        onClick={() => {
          handleBuyNow();
        }}
        className="!bg-primary-dark !border-primary-dark flex h-full flex-1 cursor-pointer items-center justify-center !font-bold text-white"
      >
        Mua Ngay
      </div>
    </div>
  );
};

ProductActionMobile.propTypes = {
  onCartClick: PropTypes.func,
  product: PropTypes.object,
};

export default ProductActionMobile;
