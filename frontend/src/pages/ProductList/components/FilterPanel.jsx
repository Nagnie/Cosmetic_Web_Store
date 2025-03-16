import { ConfigProvider, InputNumber, Slider, Space } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useDebounce, useDebounceCallback } from "@hooks/useDebounce"; // Import custom hook

import "./slider-custom.css";

const theme = {
  primary: {
    DEFAULT: "#91775E",
    light: "#C8B6A6",
    dark: "#675746",
    deepest: "#574A3A",
  },
  secondary: {
    DEFAULT: "#F1DEC9",
    light: "#A4907C",
    medium: "#C8B6A6",
    deep: "#91775E",
  },
  background: {
    DEFAULT: "#FAF5F0",
    light: "#FFFAF3",
  },
};

const FilterPanel = ({
  minMaxPrice = [0, 1000000],
  filters,
  onFilterChange,
  categories,
  isLoading,
  error,
}) => {
  const [range, setRange] = useState(minMaxPrice);
  const [inputMin, setInputMin] = useState(minMaxPrice[0]);
  const [inputMax, setInputMax] = useState(minMaxPrice[1]);

  const debouncedMin = useDebounce(inputMin, 500);
  const debouncedMax = useDebounce(inputMax, 500);

  const debouncedSliderChange = useDebounceCallback((value) => {
    onFilterChange({
      target: { name: "priceRange", value },
    });
  }, 500);

  useEffect(() => {
    if (debouncedMin !== range[0] || debouncedMax !== range[1]) {
      const newRange = [debouncedMin, debouncedMax];
      setRange(newRange);
      onFilterChange({
        target: { name: "priceRange", value: newRange },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, debouncedMax]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Slider: {
            trackBg: theme.primary.DEFAULT,
            trackHoverBg: theme.primary.dark,

            railBg: theme.secondary.DEFAULT,
            railHoverBg: theme.secondary.medium,

            handleColor: "#FFF",
            dotBorderColor: theme.primary.DEFAULT,
            dotActiveBorderColor: theme.primary.dark,

            handleShadow: `0 0 0 2px ${theme.primary.DEFAULT}`,
            handleActiveColor: theme.primary.dark,
          },
        },
      }}
    >
      <div className="h-fit rounded-lg bg-pink-50 p-4">
        <h2 className="mb-4 text-xl font-semibold">Bộ lọc</h2>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            Khoảng giá
          </label>
          <Slider
            range
            step={1000}
            min={minMaxPrice[0]}
            max={minMaxPrice[1]}
            value={range}
            defaultValue={minMaxPrice}
            onChange={(value) => {
              setRange(value);
              setInputMin(value[0]);
              setInputMax(value[1]);
            }}
            onChangeComplete={debouncedSliderChange}
          />
          <Space.Compact size="large">
            <InputNumber
              stringMode
              formatter={(value) =>
                `${value} đ`
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  .replace("$ -", "")
              }
              style={{ width: "100%" }}
              min={minMaxPrice[0]}
              max={minMaxPrice[1]}
              value={inputMin}
              onChange={(value) => {
                setInputMin(value);
              }}
              placeholder="Min"
            />
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderLeft: 0,
                borderRight: 0,
                backgroundColor: "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 8px",
              }}
            >
              <ArrowRightOutlined />
            </div>
            <InputNumber
              stringMode
              formatter={(value) =>
                `${value} đ`
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  .replace("$ -", "")
              }
              value={inputMax}
              onChange={(value) => {
                setInputMax(value);
              }}
              style={{ width: "100%" }}
              min={minMaxPrice[0]}
              max={minMaxPrice[1]}
              placeholder="Max"
            />
          </Space.Compact>
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            Danh mục
          </label>
          {isLoading ? (
            <select className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none">
              <option>Đang tải danh mục...</option>
            </select>
          ) : error ? (
            <select className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none">
              <option>Không thể tải danh mục</option>
            </select>
          ) : (
            <select
              name="category"
              value={filters.category}
              onChange={onFilterChange}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              {categories?.map((category) => (
                <option key={category.cat_id} value={category.cat_name}>
                  {category.cat_name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            Sắp xếp theo
          </label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={onFilterChange}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="priceLow">Giá thấp đến cao</option>
            <option value="priceHigh">Giá cao đến thấp</option>
          </select>
        </div>
      </div>
    </ConfigProvider>
  );
};

FilterPanel.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  categories: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  minMaxPrice: PropTypes.array,
};

export default FilterPanel;
