const CartDrawerFooter = () => {
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
        <button
          className={`bg-primary-dark mt-2 w-full rounded-lg py-3 text-white`}
        >
          Tiến hành thanh toán
        </button>
      </div>
      <span className={`text-primary-dark mt-1 block w-full text-center`}>
        Xem giỏ hàng
      </span>
    </div>
  );
};
export default CartDrawerFooter;
