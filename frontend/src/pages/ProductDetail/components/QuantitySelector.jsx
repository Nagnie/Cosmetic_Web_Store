import { useState } from "react";
import PropTypes from "prop-types";

const QuantitySelector = ({
  initialValue = 1,
  min = 1,
  max = 99,
  onChange,
  width = 180,
  height = 40,
  value,
}) => {
  const [quantity, setQuantity] = useState(initialValue);
  const [inputValue, setInputValue] = useState(() => initialValue.toString());

  const validateValue = (value) => {
    const numValue =
      value === "" || value === null ? min : parseInt(value) || min;
    return Math.max(min, Math.min(max, numValue));
  };

  const handleDecrease = () => {
    const currentValid = validateValue(inputValue);

    if (currentValid > min) {
      const newValue = currentValid - 1;
      setQuantity(newValue);
      setInputValue(newValue.toString());
      onChange && onChange(newValue);
    }
  };

  const handleIncrease = () => {
    const currentValid = validateValue(inputValue);

    if (currentValid < max) {
      const newValue = currentValid + 1;
      setQuantity(newValue);
      setInputValue(newValue.toString());
      onChange && onChange(newValue);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value !== "") {
      const numValue = parseInt(value.replace(/[^\d]/g, ""));
      if (!isNaN(numValue)) {
        const validValue = validateValue(value);
        setQuantity(validValue);
        onChange && onChange(validValue);
      }
    }
  };

  const handleBlur = () => {
    const validValue = validateValue(inputValue);
    setQuantity(validValue);
    setInputValue(validValue.toString());
    onChange && onChange(validValue);
  };

  return (
    <div
      className={`!flex !items-center !text-gray-700`}
      style={{
        width: width,
        height: height,
      }}
    >
      <button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className={`!bg-secondary-medium !border-secondary-deep flex h-full items-center justify-center !rounded-l-lg !border !border-r-0 !px-4 !py-2 !font-bold !outline-none select-none hover:opacity-90 ${
          quantity <= min ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        style={{
          width: width / 4,
        }}
      >
        -
      </button>
      <input
        type="text"
        className={`!border-secondary-deep h-full !border !text-center outline-none`}
        value={value || inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        style={{ width: (2 * width) / 4 }}
      />
      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={`!bg-secondary-medium !border-secondary-deep !flex h-full !items-center !justify-center !rounded-r-lg !border !border-l-0 !px-4 !py-2 !font-bold !outline-none select-none hover:opacity-90 ${
          quantity >= max ? "cursor-not-allowed opacity-50" : "cursor-pointer"
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
};

export default QuantitySelector;
