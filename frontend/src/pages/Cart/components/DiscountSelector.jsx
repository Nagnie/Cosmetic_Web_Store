import { useState, useEffect } from "react";
import { Button, Input, Tooltip } from "antd";
import {
  TagOutlined,
  GiftOutlined,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

const colors = {
  primary: {
    DEFAULT: "#91775E",
    light: "#C8B6A6",
    dark: "#675746",
  },
  secondary: {
    DEFAULT: "#F1DEC9",
    dark: "#E5C9A8",
  },
  neutral: {
    DEFAULT: "#FFFFFF",
  },
  action: {
    cancel: "#B25D48",
    cancelLight: "#F8E8E6",
    success: "#6B8E67",
  },
};

const DiscountSelector = ({
  voucherCode,
  onApplyVoucher,
  onShowCouponModal,
  isLoading = false,
  isApplied = false,
}) => {
  const [inputCode, setInputCode] = useState("");
  const [internalIsApplied, setInternalIsApplied] = useState(false);

  useEffect(() => {
    setInputCode(voucherCode || "");
    setInternalIsApplied(isApplied || !!voucherCode);
  }, [voucherCode, isApplied]);

  const handleInputChange = (e) => {
    setInputCode(e.target.value.toUpperCase());

    if (internalIsApplied) {
      setInternalIsApplied(false);
    }
  };

  const handleApplyClick = () => {
    if (inputCode.trim()) {
      onApplyVoucher(inputCode);
    }
  };

  const handleCancelVoucher = (e) => {
    if (e) {
      e.stopPropagation();
    }

    setInputCode("");
    setInternalIsApplied(false);
    onApplyVoucher("");
  };

  // Render suffix cho Input tùy thuộc vào trạng thái
  const renderInputSuffix = () => {
    if (isLoading) {
      return <LoadingOutlined style={{ color: colors.primary.DEFAULT }} />;
    }

    if (inputCode && internalIsApplied) {
      return (
        <Tooltip title="Hủy mã giảm giá">
          <CloseCircleFilled
            onClick={handleCancelVoucher}
            style={{
              color: colors.action.cancel,
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            className="hover:scale-110"
          />
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Input và Apply Button - responsive với Tailwind */}
      <div className="flex w-full flex-col sm:flex-row sm:space-x-0">
        <Input
          className="mb-2 w-full flex-grow uppercase sm:mb-0"
          size="large"
          placeholder="Nhập mã giảm giá"
          prefix={<TagOutlined style={{ color: colors.primary.DEFAULT }} />}
          suffix={renderInputSuffix()}
          style={{
            borderColor: internalIsApplied
              ? colors.primary.DEFAULT
              : colors.primary.light,
            color: colors.primary.dark,
            backgroundColor: internalIsApplied
              ? "rgba(145, 119, 94, 0.08)"
              : "inherit",
            transition: "all 0.3s ease",
          }}
          value={inputCode}
          onChange={handleInputChange}
          onPressEnter={
            !isLoading && !internalIsApplied ? handleApplyClick : undefined
          }
          disabled={isLoading || internalIsApplied}
        />
        <Button
          className="w-full sm:w-auto"
          size="large"
          type="primary"
          onClick={internalIsApplied ? handleCancelVoucher : handleApplyClick}
          style={{
            backgroundColor: internalIsApplied
              ? colors.action.cancel
              : colors.primary.DEFAULT,
            borderColor: internalIsApplied
              ? colors.action.cancel
              : colors.primary.DEFAULT,
            color: colors.neutral.DEFAULT,
            transition: "all 0.3s ease",
          }}
          loading={isLoading}
          disabled={isLoading && !internalIsApplied}
        >
          {internalIsApplied ? "Hủy mã" : "Áp dụng"}
        </Button>
      </div>

      {/* Thông báo mã giảm giá đã được áp dụng */}
      {internalIsApplied && inputCode && (
        <div
          className="mt-1 flex items-center text-sm"
          style={{ color: colors.action.success }}
        >
          <span className="mr-1">✓</span> Mã giảm giá đã được áp dụng
        </div>
      )}

      <div className="mt-2 flex justify-center sm:justify-start">
        <Button
          type="link"
          icon={<GiftOutlined style={{ color: colors.primary.DEFAULT }} />}
          onClick={onShowCouponModal}
          className="p-0 text-sm sm:text-base"
          style={{
            color: colors.primary.DEFAULT,
            fontWeight: 500,
          }}
          disabled={isLoading}
        >
          Chọn mã giảm giá
        </Button>
      </div>
    </div>
  );
};

DiscountSelector.propTypes = {
  voucherCode: PropTypes.string,
  onApplyVoucher: PropTypes.func,
  onShowCouponModal: PropTypes.func,
  isLoading: PropTypes.bool,
  isApplied: PropTypes.bool,
};

export default DiscountSelector;
