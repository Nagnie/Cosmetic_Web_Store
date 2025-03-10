import { Link } from "react-router-dom";

import useCartStore from "../ZustandCartStore";

const CartDrawerFooter = () => {
  const { closeCartDrawer } = useCartStore();

  return (
    <div>
      <div className={`flex items-center justify-between`}>
        <span className={`text-primary-dark text-lg font-semibold`}>
          TỔNG TIỀN
        </span>

        <span className={`text-primary-dark text-lg font-semibold`}>
          1.000.000đ
        </span>
      </div>
      <div>
        <Link
          to="/checkout"
          className={`!bg-primary-dark h mt-2 flex w-full items-center justify-center rounded-lg py-3 !text-white transition-opacity duration-300 hover:opacity-90`}
          onClick={() => closeCartDrawer()}
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
export default CartDrawerFooter;
