import { DownOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import { CheckoutCard } from ".";
import { useState } from "react";

const CustomCollapse = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Collapse Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="text-secondary-deep flex cursor-pointer items-center rounded-lg border border-gray-200 p-2 select-none"
      >
        <div className="flex items-center">
          <ShoppingCartOutlined />

          <div className="ml-2 flex flex-wrap items-center gap-1 text-sm font-semibold">
            <span>{isOpen ? "Ẩn" : "Hiện"} thông tin giỏ hàng</span>
            <span>(6 sản phẩm)</span>
          </div>
        </div>
        <div>
          {
            <DownOutlined
              className={`transform ${isOpen ? "rotate-180" : ""} transition-transform duration-500 ease-in-out`}
            />
          }
        </div>
      </div>

      {/* Collapse Body */}
      <div className={`${isOpen ? "block" : "hidden"} mt-4 space-y-2`}>
        <CheckoutCard />
        <CheckoutCard />
        <CheckoutCard />
        <CheckoutCard />
        <CheckoutCard />
        <CheckoutCard />

        {/* horizontal separate */}
        <div className="my-4 border-t border-gray-200"></div>
      </div>
    </div>
  );
};
export default CustomCollapse;
