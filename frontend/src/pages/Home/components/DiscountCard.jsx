import PropTypes from "prop-types";
import { useCartStore } from "@components/Cart";
import { formatCurrency } from "@utils/utils";
import { Tooltip } from "antd";

import "./VoucherCurvedSlider.css";
// import "./DiscountCard.css";

const DiscountCard = ({ item, onClick }) => {
  const totalPrice = useCartStore((state) => state.totalPrice);
  const minOrderValue = item.minOrderValue || 300000; // Giá trị mặc định nếu không có minOrderValue

  // Kiểm tra xem tổng giá trị đơn hàng có đạt điều kiện không
  const isEligible = totalPrice >= minOrderValue;

  // Nội dung của tooltip
  const tooltipContent = !isEligible ? (
    <div>
      <p className="text-center text-sm text-gray-700">
        Chưa đủ điều kiện để áp dụng voucher
      </p>
      <div className="mt-2 text-sm">
        <div className="flex justify-between">
          Hiện tại:{" "}
          <span className="font-bold">
            {formatCurrency({ number: totalPrice })}
          </span>
        </div>
        <div
          className={`flex justify-between ${
            totalPrice < minOrderValue ? "text-red-500" : ""
          }`}
        >
          Còn thiếu:{" "}
          <span
            className={`font-bold ${
              totalPrice < minOrderValue ? "text-red-500" : ""
            }`}
          >
            {formatCurrency({ number: minOrderValue - totalPrice })}
          </span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div
      className={`voucher-content ${!isEligible ? "voucher-disabled" : ""}`}
      onClick={onClick}
    >
      <h3 className="voucher-title">{item.title ?? "Giảm 30%"}</h3>
      <div className="voucher-price">{item.price ?? "Tối đa 199.000đ"}</div>
      <p className="voucher-description">
        {item.description ??
          `Đơn hàng từ ${formatCurrency({
            number: minOrderValue,
          })}`}
      </p>

      {isEligible ? (
        <div className="voucher-code">{item.code ?? "FASHION30"}</div>
      ) : (
        <Tooltip
          title={tooltipContent}
          color="#fff"
          styles={{
            body: {
              color: "#333",
            },
          }}
          placement="top"
        >
          <div className="voucher-code voucher-code-locked">
            <span className="voucher-lock-icon">🔒</span>
            <span className="voucher-lock-text">Chưa đủ điều kiện</span>
          </div>
        </Tooltip>
      )}

      <p className="voucher-expiry">HSD: {item.expiry || "10/04/2025"}</p>

      <div className="voucher-ribbon">
        <span className="voucher-ribbon-text">{item.ribbonText ?? "30%"}</span>
      </div>
      <div className="voucher-pattern"></div>
    </div>
  );
};

DiscountCard.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func,
};

export default DiscountCard;
