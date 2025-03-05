import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProductActionMobile = ({ onCartClick }) => {
  const navigate = useNavigate();

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
      <div className="!bg-primary-dark !border-primary-dark flex h-full flex-1 cursor-pointer items-center justify-center !font-bold text-white">
        <button>Mua Ngay</button>
      </div>
    </div>
  );
};

ProductActionMobile.propTypes = {
  onCartClick: PropTypes.func,
};

export default ProductActionMobile;
