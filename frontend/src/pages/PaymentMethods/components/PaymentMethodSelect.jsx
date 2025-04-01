import { useState } from "react";
import { Link } from "react-router-dom";

import { useCartStore } from "@components/Cart";
import CustomSpin from "@components/Spin/CustomSpin";
import images from "@assets/images/PaymentMethods";
import PaymentMethodCard from "./PaymentMethodCard";
// import { useFinishOrder } from "@hooks/useOrderQueries";
// import { useQueryClient } from "@tanstack/react-query";

const PAYMENT_METHODS = [
  {
    id: "momo",
    name: "Ví MoMo",
    description: "Thanh toán qua ví điện tử Momo",
    icons: [images.momo],
  },
  {
    id: "vnpay",
    name: "Thẻ ATM/Visa/Master/JCB/QR Pay qua cổng VNPAY",
    description: "Thanh toán qua cổng thanh toán VNPAY",
    icons: [images.vnpay, images.visa],
  },
  {
    id: "other",
    name: "Chuyển khoản ngân hàng (VietQR)",
    description: "Thanh toán qua mã VietQR",
    icons: [images.other],
  },
];

const PaymentMethodSelect = () => {
  const itemCount = useCartStore((state) => state.itemCount);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedPaymentMethod || !itemCount) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Đã chọn phương thức thanh toán: ${selectedPaymentMethod}`);
    }, 2000);
  };

  return (
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

        <div className="mt-6 flex items-center justify-between gap-4">
          <Link
            to="/checkout"
            className="text-primary flex shrink-0 items-center justify-center gap-1 text-sm font-semibold"
          >
            <span className="text-primary underline">Quay lại</span>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !itemCount || !selectedPaymentMethod}
            className={`bg-primary hover:bg-primary-dark flex w-full items-center justify-center rounded-md py-3 text-white transition-colors duration-300 ${
              isSubmitting || !itemCount || !selectedPaymentMethod
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
  );
};

export default PaymentMethodSelect;
