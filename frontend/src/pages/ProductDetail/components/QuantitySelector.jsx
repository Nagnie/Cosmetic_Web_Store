import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const QuantitySelector = ({
  initialValue = 1,
  min = 1,
  max = 99,
  onChange,
  width = 180,
  height = 40,
  value,
  disabled = false,
}) => {
  const [quantity, setQuantity] = useState(() => initialValue);
  const [inputValue, setInputValue] = useState(() => initialValue.toString());

  // Đồng bộ hóa state nội bộ với prop value khi nó thay đổi
  useEffect(() => {
    if (value !== undefined && value !== quantity) {
      setQuantity(value);
      setInputValue(value.toString());
    }
  }, [value]);

  const validateValue = (value) => {
    const numValue =
      value === "" || value === null ? min : parseInt(value) || min;
    return Math.max(min, Math.min(max, numValue));
  };

  const handleDecrease = () => {
    if (disabled) return;

    const currentValue = value !== undefined ? value : quantity;
    const validValue = validateValue(currentValue);

    if (validValue > min) {
      const newValue = validValue - 1;
      setQuantity(newValue);
      setInputValue(newValue.toString());
      onChange && onChange(newValue);
    }
  };

  const handleIncrease = () => {
    if (disabled) return;

    const currentValue = value !== undefined ? value : quantity;
    const validValue = validateValue(currentValue);

    if (validValue < max) {
      const newValue = validValue + 1;
      setQuantity(newValue);
      setInputValue(newValue.toString());
      onChange && onChange(newValue);
    }
  };

  const handleInputChange = (e) => {
    if (disabled) return;

    const val = e.target.value;
    setInputValue(val);

    if (val !== "") {
      const numValue = parseInt(val.replace(/[^\d]/g, ""));
      if (!isNaN(numValue)) {
        const validValue = validateValue(val);
        setQuantity(validValue);
        onChange && onChange(validValue);
      }
    }
  };

  const handleBlur = () => {
    if (disabled) return;

    const validValue = validateValue(inputValue);
    setQuantity(validValue);
    setInputValue(validValue.toString());
    onChange && onChange(validValue);
  };

  // Luôn sử dụng value từ props nếu được cung cấp
  const currentValue = value !== undefined ? value : quantity;

  const isButtonDisabled = (isDecrease) => {
    if (disabled) return true;
    return isDecrease ? currentValue <= min : currentValue >= max;
  };

  return (
    <div
      className={`!flex !items-center !text-gray-700 ${disabled ? "opacity-60" : ""}`}
      style={{
        width: width,
        height: height,
      }}
    >
      <button
        onClick={handleDecrease}
        disabled={isButtonDisabled(true)}
        className={`!bg-secondary-medium !border-secondary-deep flex h-full items-center justify-center !rounded-l-lg !border !border-r-0 !px-4 !py-2 !font-bold !outline-none select-none hover:opacity-90 ${
          isButtonDisabled(true)
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
        style={{
          width: width / 4,
        }}
      >
        -
      </button>
      <input
        type="text"
        className={`!border-secondary-deep h-full !border !text-center outline-none ${disabled ? "bg-gray-100" : ""}`}
        value={value !== undefined ? value : inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        style={{ width: (2 * width) / 4 }}
      />
      <button
        onClick={handleIncrease}
        disabled={isButtonDisabled(false)}
        className={`!bg-secondary-medium !border-secondary-deep !flex h-full !items-center !justify-center !rounded-r-lg !border !border-l-0 !px-4 !py-2 !font-bold !outline-none select-none hover:opacity-90 ${
          isButtonDisabled(false)
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
        style={{
          width: width / 4,
        }}
      >
        +
      </button>
    </div>
  );
};

QuantitySelector.propTypes = {
  initialValue: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  value: PropTypes.number,
  disabled: PropTypes.bool,
};

export default QuantitySelector;
