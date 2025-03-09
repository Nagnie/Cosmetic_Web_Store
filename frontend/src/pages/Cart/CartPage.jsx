import { CartCard, CartPriceInfo } from "./components";

const CartPage = () => {
  return (
    <div className="mx-auto mt-35 mb-4 pt-10 lg:px-4">
      <div className="flex flex-col gap-4 text-left lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full rounded-md bg-white p-4 px-2 shadow-md sm:px-4 lg:w-4/5 lg:px-6">
          <div className="border-b-5 border-gray-300 pb-4">
            <div className="flex items-center justify-between">
              <h1 className="!text-xl font-bold">Giỏ hàng:</h1>
              <span className="!text-sm text-gray-500 underline underline-offset-5">
                11 sản phẩm
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <CartCard />
            <CartCard />
            <CartCard />
            <CartCard />
          </div>
        </div>
        <div className="w-full rounded-md bg-white p-4 px-6 shadow-md lg:w-2/5">
          <CartPriceInfo />
        </div>
      </div>
    </div>
  );
};
export default CartPage;
