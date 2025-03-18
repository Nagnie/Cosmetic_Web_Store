import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import useCartStore from "../ZustandCartStore";
import { formatCurrency } from "@utils/utils";

const CartDrawerFooter = ({ totalPrice, itemCount }) => {
  const { closeCartDrawer } = useCartStore();

  return (
    <div>
      <div className={`flex items-center justify-between`}>
        <span className={`text-primary-dark text-lg font-semibold`}>
          TỔNG TIỀN
        </span>

        <span className={`text-primary-dark text-lg font-semibold`}>
          {formatCurrency({
            number: totalPrice,
          })}
        </span>
      </div>
      <div>
        <Link
          to="/checkout"
          className={`!bg-primary-dark h mt-2 flex w-full items-center justify-center rounded-lg py-3 !text-white transition-opacity duration-300 ${itemCount === 0 ? "!cursor-not-allowed opacity-50" : "hover:opacity-90"}`}
          onClick={(e) => {
            if (itemCount === 0) {
              e.preventDefault();
              return;
            }
            closeCartDrawer();
          }}
        >
          Tiến hành đặt hàng
        </Link>
      </div>
      <Link
        to="/cart"
        className={`!text-primary-dark mt-1 block w-full text-center`}
        onClick={() => closeCartDrawer()}
      >
        Xem giỏ hàng
      </Link>
    </div>
  );
};

CartDrawerFooter.propTypes = {
  totalPrice: PropTypes.number,
  itemCount: PropTypes.number,
};

export default CartDrawerFooter;
