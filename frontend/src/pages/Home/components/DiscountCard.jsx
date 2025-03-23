import PropTypes from "prop-types";

import "./VoucherCurvedSlider.css";

const DiscountCard = ({ item }) => {
  return (
    <div className="voucher-content">
      <h3 className="voucher-title">{item.title ?? "Giảm 30%"}</h3>
      <div className="voucher-price">{item.price ?? "Tối đa 199.000đ"}</div>
      <p className="voucher-description">
        {item.description ?? "Đơn hàng từ 300.000đ"}
      </p>
      <div className="voucher-code">{item.code ?? "FASHION30"}</div>
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
};

export default DiscountCard;
