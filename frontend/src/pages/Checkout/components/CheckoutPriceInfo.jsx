import { useState } from "react";
import { Space } from "antd";
import { GiftOutlined } from "@ant-design/icons";

import { useCartStore } from "@components/Cart";
import { formatCurrency } from "@utils/utils";
import { DiscountSelector } from "@pages/Cart/components";
import { useModalStore } from "@components/Modal";
import { CouponModalContent } from "@components/Modal/Content";
import { CustomCollapse } from ".";

const VOUCHER = [
  {
    id: 1,
    title: "Giảm giá cố định",
    price: "200.000đ",
    description: "Áp dụng cho đơn hàng từ 1.000.000đ",
    code: "HOLIDAY200K",
    expiry: "30/04/2025",
    ribbonText: "200K",
  },
  {
    id: 2,
    title: "Freeship Extra",
    price: "50.000đ",
    description: "Miễn phí vận chuyển toàn quốc",
    code: "FREESHIP50",
    expiry: "15/04/2025",
    ribbonText: "SHIP",
  },
  {
    id: 3,
    title: "Giảm 30%",
    price: "Tối đa 199.000đ",
    description: "Đơn hàng từ 300.000đ",
    code: "FASHION30",
    expiry: "10/04/2025",
    ribbonText: "30%",
  },
  {
    id: 4,
    title: "Voucher Sinh Nhật",
    price: "300.000đ",
    description: "Quà tặng đặc biệt cho thành viên",
    code: "BIRTHDAY300",
    expiry: "05/04/2025",
    ribbonText: "GIFT",
  },
  {
    id: 5,
    title: "Giảm 15%",
    price: "Tối đa 50.000đ",
    description: "Đơn hàng từ 200.000đ",
    code: "NEW15PCT",
    expiry: "20/04/2025",
    ribbonText: "15%",
  },
  {
    id: 6,
    title: "Giảm 20%",
    price: "Tối đa 500.000đ",
    description: "Cho sản phẩm điện tử, công nghệ",
    code: "TECH20PCT",
    expiry: "25/04/2025",
    ribbonText: "20%",
  },
  {
    id: 7,
    title: "Giảm 50%",
    price: "Tối đa 1.000.000đ",
    description: "Dành cho khách hàng VIP",
    code: "VIP50PCT",
    expiry: "01/05/2025",
    ribbonText: "50%",
  },
  {
    id: 8,
    title: "Giảm 15%",
    price: "Tối đa 100.000đ",
    description: "Cho tất cả đồ gia dụng",
    code: "HOME15PCT",
    expiry: "12/04/2025",
    ribbonText: "15%",
  },
  {
    id: 9,
    title: "Giảm 15%",
    price: "Tối đa 100.000đ",
    description: "Cho tất cả đồ gia dụng",
    code: "HOME15PCT",
    expiry: "12/04/2025",
    ribbonText: "15%",
  },
];

const CheckoutPriceInfo = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");

  const showModal = useModalStore((state) => state.showModal);
  const hideModal = useModalStore((state) => state.hideModal);
  const totalCartPrice = useCartStore((state) => state.totalPrice);

  // Hàm xử lý khi voucher được chọn từ modal
  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);

    // Nếu voucher được chọn, cập nhật voucherCode
    if (voucher) {
      setVoucherCode(voucher.code);
    } else {
      setVoucherCode("");
    }
  };

  // Hàm xử lý khi mã voucher được nhập thủ công
  const handleVoucherApply = (code) => {
    setVoucherCode(code);

    // Tìm voucher tương ứng với code để cập nhật selectedVoucher
    if (code) {
      // Import VOUCHER từ CouponModalContent hoặc từ service
      const voucher = VOUCHER.find(
        (v) => v.code.toLowerCase() === code.toLowerCase(),
      );
      setSelectedVoucher(voucher || null);
    } else {
      setSelectedVoucher(null);
    }
  };

  // Hiển thị modal với CouponModalContent
  const handleShowCouponModal = () => {
    showModal(
      <CouponModalContent
        onApplyCoupon={handleVoucherSelect}
        selectedVoucher={selectedVoucher}
        onCancel={hideModal}
      />,
      {
        title: (
          <Space>
            <GiftOutlined />
            <span>Chọn mã giảm giá</span>
          </Space>
        ),
        styles: {
          header: {
            backgroundColor: "",
            borderBottom: "",
          },
          body: {
            padding: 0,
            backgroundColor: "",
          },
          mask: {
            backgroundColor: "rgba(145, 119, 94, 0.2)",
          },
          content: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        },
      },
    );
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div>
        {/* List CheckoutCard */}

        <CustomCollapse />
      </div>

      <div className="mt-4">
        {/* Coupon */}
        <DiscountSelector
          voucherCode={voucherCode}
          onApplyVoucher={handleVoucherApply}
          onShowCouponModal={handleShowCouponModal}
        />
      </div>

      {/* horizontal separate */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* Price Info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Tạm tính</span>
          <span className="text-sm font-semibold">
            {formatCurrency({ number: +totalCartPrice || 0 })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Phí vận chuyển</span>
          <span className="text-sm font-semibold">0đ</span>
        </div>
      </div>

      {/* horizontal separate */}
      <div className="my-4 border-t border-gray-200"></div>

      <div className="text-secondary-deep flex items-center justify-between text-xl font-semibold">
        <span>Tổng cộng</span>
        <span>{formatCurrency({ number: +totalCartPrice || 0 })}</span>
      </div>
    </div>
  );
};
export default CheckoutPriceInfo;
