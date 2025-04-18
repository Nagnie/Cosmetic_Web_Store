import { useState } from "react";
import { Link } from "react-router-dom";

import { useCartStore } from "@components/Cart";
import CustomSpin from "@components/Spin/CustomSpin";
import images from "@assets/images/PaymentMethods";
import PaymentMethodCard from "./PaymentMethodCard";
import PaymentSelectCard from "./PaymentSelectCard";
import { checkoutPayment } from "@apis/orderApi.js";
import { clearCartSession } from "@utils/utils";
// import { useFinishOrder } from "@hooks/useOrderQueries";
// import { useQueryClient } from "@tanstack/react-query";

const PAYMENT_METHODS = [
  // {
  //   id: "momo",
  //   name: "Ví MoMo",
  //   description: "Thanh toán qua ví điện tử Momo",
  //   icons: [images.momo],
  // },
  {
    id: "other",
    name: "Chuyển khoản ngân hàng (PayOS)",
    description: "Thanh toán qua mã PayOS",
    icons: [images.other],
  },
];

const PAYMENT_SELECTS = [
  {
    id: "full",
    name: "Chuyển khoản full",
    description: "Thanh toán toàn bộ giá trị đơn hàng",
  },
  {
    id: "half",
    name: "Chuyển khoản một nửa",
    description: "Thanh toán một nửa giá trị đơn hàng",
  },
];

const PaymentMethodSelect = () => {
  const itemCount = useCartStore((state) => state.itemCount);
  const clearCart = useCartStore((state) => state.clearCart);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedPaymentSelect, setSelectedPaymentSelect] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedPaymentMethod || !selectedPaymentSelect || !itemCount) return;

    setIsSubmitting(true);

    try {
      const storedData = localStorage.getItem("persistData");
      if (!storedData) {
        alert("Không tìm thấy thông tin đơn hàng.");
        return;
      }

      const orderPayload = JSON.parse(storedData);

      if (selectedPaymentSelect === "half") {
        orderPayload.total_price = Math.floor(orderPayload.total_price / 2);
      }

      const fullPayload = {
        ...orderPayload,
        paid: selectedPaymentSelect,
      };

      // Gửi API
      const res = await checkoutPayment(JSON.stringify(fullPayload));

      // console.log("res", res);
      // localStorage.setItem("url", JSON.stringify(res));

      if (!res) throw new Error("Có lỗi khi gửi thanh toán");

      // Xử lý khi thành công
      // localStorage.removeItem("persistData");
      localStorage.setItem("fullData", JSON.stringify(fullPayload));
      // clearCartSession();
      // clearCart();
      // console.log("persistData", localStorage.getItem("persistData"));
      // console.log("fullData", localStorage.getItem("fullData"));

      window.location.href = res.data;
    } catch (err) {
      console.error("Lỗi khi thanh toán:", err);
      alert("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mt-5 mb-5 rounded-lg bg-white p-4 shadow-sm lg:mt-0">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Hình thức thanh toán
        </h2>
        <div className="mt-2">
          <div className="mb-6 space-y-2">
            {PAYMENT_SELECTS.map((method) => (
              <PaymentSelectCard
                key={method.id}
                method={method}
                selected={selectedPaymentSelect === method.id}
                onSelect={setSelectedPaymentSelect}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Phương thức thanh toán
        </h2>
        <div className="mt-2">
          <div className="mb-6 space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                selected={selectedPaymentMethod === method.id}
                onSelect={setSelectedPaymentMethod}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <Link
              to="/checkout"
              className="text-primary flex shrink-0 items-center justify-center gap-1 text-sm font-semibold"
            >
              <span className="text-primary px-3 underline">Quay lại</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !itemCount ||
                !selectedPaymentMethod ||
                !selectedPaymentSelect
              }
              className={`bg-primary hover:bg-primary-dark flex w-full items-center justify-center rounded-md py-3 text-white transition-colors duration-300 ${
                isSubmitting ||
                !itemCount ||
                !selectedPaymentMethod ||
                !selectedPaymentSelect
                  ? "!cursor-not-allowed opacity-70"
                  : ""
              }`}
            >
              {isSubmitting ? <CustomSpin size="small" /> : null}
              {isSubmitting ? "Đang xử lý..." : "Thanh toán"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelect;
