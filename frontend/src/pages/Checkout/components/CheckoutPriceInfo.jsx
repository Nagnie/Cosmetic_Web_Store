import { useState } from "react";
import { message, Space } from "antd";
import { GiftOutlined } from "@ant-design/icons";

import { useCartStore } from "@components/Cart";
import { formatCurrency } from "@utils/utils";
import { DiscountSelector } from "@pages/Cart/components";
import { useModalStore } from "@components/Modal";
import { CouponModalContent } from "@components/Modal/Content";
import { CustomCollapse } from ".";
import { useApplyVoucher } from "@hooks/useVoucherQueries";

const CheckoutPriceInfo = () => {
  const showModal = useModalStore((state) => state.showModal);
  const hideModal = useModalStore((state) => state.hideModal);
  const totalCartPrice = useCartStore((state) => state.totalPrice);
  const discountInfo = useCartStore((state) => state.discountInfo);
  const setDiscountInfo = useCartStore((state) => state.setDiscountInfo);
  const shippingFee = useCartStore((state) => state.shippingFee);

  const finalTotalPrice =
    (discountInfo?.new_total_prices
      ? discountInfo.new_total_prices
      : +totalCartPrice || 0) + (shippingFee ?? 0) || 0;

  const [selectedVoucher, setSelectedVoucher] = useState(() => {
    return {
      code: discountInfo?.code || "",
    };
  });
  const [voucherCode, setVoucherCode] = useState(() => {
    return {
      code: discountInfo?.code || "",
    };
  });

  const applyVoucherMutation = useApplyVoucher({
    onSuccess: (data) => {
      // console.log("Voucher áp dụng thành công:", data);

      setDiscountInfo({
        ...data,
        code: selectedVoucher?.code || voucherCode?.code || "",
      });

      message.success("Áp dụng mã giảm giá thành công!");

      if (selectedVoucher && !voucherCode) {
        setVoucherCode(selectedVoucher.code);
      }
    },
    onError: (error) => {
      console.error("Lỗi khi áp dụng voucher:", error);

      message.error(
        `Không thể áp dụng mã giảm giá: ${error.message || "Vui lòng thử lại sau"}`,
      );

      setVoucherCode("");
      setSelectedVoucher(null);
    },
  });

  const handleVoucherSelect = (voucher) => {
    // console.log(voucher);

    setSelectedVoucher(voucher);

    if (voucher) {
      setVoucherCode({
        code: voucher.code,
      });

      applyVoucherMutation.mutate(voucher.code);
    } else {
      setVoucherCode("");
      setDiscountInfo(null);
    }
  };

  const handleVoucherApply = (code) => {
    if (!code) {
      setVoucherCode("");
      setSelectedVoucher(null);
      setDiscountInfo(null);
      return;
    }

    setVoucherCode({
      code: code,
    });

    setSelectedVoucher(null);

    applyVoucherMutation.mutate(code);
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
          voucherCode={voucherCode?.code ?? ""}
          onApplyVoucher={handleVoucherApply}
          onShowCouponModal={handleShowCouponModal}
          isLoading={applyVoucherMutation.isLoading}
          isApplied={!!discountInfo}
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

        {discountInfo && discountInfo.discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Giảm giá</span>
            <span className="text-sm font-semibold">
              -{formatCurrency({ number: discountInfo.discount })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Phí vận chuyển</span>
          <span className="text-sm font-semibold">
            {formatCurrency({ number: shippingFee ?? 0 })}
          </span>
        </div>
      </div>

      {/* horizontal separate */}
      <div className="my-4 border-t border-gray-200"></div>

      <div className="text-secondary-deep flex items-center justify-between text-xl font-semibold">
        <span>Tổng cộng</span>
        <span>
          {formatCurrency({
            number: finalTotalPrice,
          })}
        </span>
      </div>
    </div>
  );
};
export default CheckoutPriceInfo;
