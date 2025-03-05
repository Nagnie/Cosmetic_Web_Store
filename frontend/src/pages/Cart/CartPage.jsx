import { Link } from "react-router-dom";
import { CartCard } from "./components";

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
          <p className="border-b-5 border-gray-300 pb-4 text-lg font-semibold">
            Thông tin đơn hàng
          </p>
          <div className="mt-4">
            <div className="border-b border-gray-300 pb-4">
              <div className="flex flex-wrap justify-between">
                <span className="font-semibold sm:text-lg">Tạm tính:</span>
                <span className="!text-primary-deepest font-bold sm:text-lg">
                  1.000.000đ
                </span>
              </div>
              <div className="mt-2 flex flex-wrap justify-between">
                <span className="font-semibold sm:text-lg">Giảm giá:</span>
                <span className="!text-primary-deepest font-bold sm:text-lg">
                  -100.000đ
                </span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap justify-between">
              <span className="text-xl font-semibold sm:text-2xl">
                Tổng cộng:
              </span>
              <span className="!text-primary-deepest text-xl font-bold sm:text-2xl">
                930.000đ
              </span>
            </div>

            <div className="mt-4">
              <p className="font-semibold sm:text-lg">Ghi chú đơn hàng:</p>
              <textarea
                className="focus:ring-secondary mt-2 h-24 w-full resize-none rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:outline-none"
                placeholder="Nhập ghi chú cho đơn hàng của bạn"
              ></textarea>
            </div>

            <button className="bg-primary mt-4 w-full rounded-md py-2 text-white">
              Tiến hành đặt hàng
            </button>

            <div className="mt-2 text-center">
              <Link
                to="/"
                className="text-primary flex items-center justify-center gap-1 text-sm font-semibold"
              >
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_41595_51297)">
                    <path
                      d="M6.58932 0.0136719C6.33748 0.224444 6.08801 0.437932 5.83345 0.644971C4.08177 2.0715 2.32907 3.49668 0.577044 4.92253C0.554644 4.94086 0.534279 4.96122 0.500339 4.99245C2.53271 6.65249 4.55898 8.3071 6.60595 9.97903C6.60595 8.94383 6.60595 7.93274 6.60595 6.89177C6.907 6.92945 7.19312 6.94811 7.47212 7.00276C9.73427 7.44569 11.4293 8.67197 12.496 10.7179C12.8426 11.3828 13.0995 12.0939 13.3985 12.7836C13.4284 12.8525 13.4661 12.918 13.5 12.9852C13.5 11.9781 13.5 10.9715 13.5 9.96443C13.4929 9.92744 13.4813 9.89078 13.479 9.85345C13.4267 8.98762 13.2322 8.15335 12.8585 7.3717C11.751 5.05524 9.9318 3.65246 7.40084 3.18374C7.14391 3.13622 6.88223 3.11654 6.61477 3.08294C6.61477 2.05962 6.61477 1.03665 6.61477 0.0136719C6.60629 0.0136719 6.5978 0.0136719 6.58932 0.0136719Z"
                      fill="#91775E"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_41595_51297">
                      <rect
                        width="13"
                        height="12.9715"
                        fill="white"
                        transform="matrix(-1 0 0 1 13.5 0.0136719)"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
