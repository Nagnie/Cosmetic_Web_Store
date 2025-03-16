import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { CheckoutCustomerInfo, CheckoutPriceInfo } from "./components";
import { useCartStore } from "@components/Cart";

const CheckoutPage = () => {
  const cartItemCount = useCartStore((state) => state.itemCount);

  const routes = [
    {
      title: (
        <>
          <HomeOutlined className="mr-1 text-base" />
          <span>Trang chủ</span>
        </>
      ),
      href: "/",
    },
    {
      title: `Giỏ hàng (${cartItemCount})`,
      href: "/cart",
    },
    {
      title: "Thông tin đặt hàng",
      href: "/checkout",
    },
  ];

  return (
    <div className="mx-auto mt-35 mb-4 pt-10 lg:px-4">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb separator=">" items={routes} />
      </div>

      <div className="grid grid-cols-1 gap-2 text-left lg:grid-cols-2 lg:gap-8">
        {/* Left */}
        <div className="order-2 lg:order-1">
          <CheckoutCustomerInfo />
        </div>
        {/* Right */}
        <div className="order-1 lg:order-2">
          <CheckoutPriceInfo />
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
