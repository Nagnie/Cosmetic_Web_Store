import { ConfigProvider, InputNumber, Slider, Space, Select } from "antd";
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
  card: {
    bg: "#fff3e7",
  },
};

const FilterPanel = ({
  minMaxPrice = [0, 1000000],
  filters,
  onFilterChange,
  categories,
  isLoading,
  error,
  brands,
  brandsLoading,
  brandsError,
}) => {
  const [range, setRange] = useState(minMaxPrice);
  const [inputMin, setInputMin] = useState(minMaxPrice[0]);
  const [inputMax, setInputMax] = useState(minMaxPrice[1]);
  const [subcategories, setSubcategories] = useState([]);

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

  // Cập nhật danh sách danh mục con khi danh mục chính thay đổi
  useEffect(() => {
    if (filters.category) {
      const selectedCategory = categories?.find(
        (category) => category.cat_name === filters.category,
      );
      setSubcategories(selectedCategory?.sub_category || []);
    } else {
      setSubcategories([]);
    }
  }, [filters.category, categories]);

  // Xử lý sự kiện thay đổi cho các Select của Ant Design
  const handleSelectChange = (value, name) => {
    onFilterChange({
      target: { name, value },
    });

    // Reset subcategory when main category changes
    if (name === "category") {
      onFilterChange({
        target: { name: "subcate", value: "" },
      });
    }
  };

  // console.log(">>> subcategories", subcategories);

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
          Select: {
            colorPrimary: theme.primary.DEFAULT,
            colorPrimaryHover: theme.primary.dark,
            controlItemBgActive: theme.secondary.light,
            optionSelectedBg: theme.secondary.DEFAULT,
          },
        },
      }}
    >
      <div
        className="h-fit rounded-lg p-4"
        style={{ backgroundColor: theme.card.bg }}
      >
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
          <Select
            placeholder={isLoading ? "Đang tải danh mục..." : "Chọn danh mục"}
            style={{ width: "100%" }}
            value={filters.category || undefined}
            onChange={(value) => handleSelectChange(value, "category")}
            disabled={isLoading || !!error}
            status={error ? "error" : ""}
            loading={isLoading}
            options={[
              { value: "", label: "Tất cả" },
              ...(categories?.map((category) => ({
                value: category.cat_name,
                label: category.cat_name,
              })) || []),
            ]}
            notFoundContent={error ? "Không thể tải danh mục" : undefined}
          />
        </div>

        {/* Thêm danh mục con */}
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            Danh mục con
          </label>
          <Select
            placeholder={
              !filters.category
                ? "Vui lòng chọn danh mục trước"
                : "Chọn danh mục con"
            }
            style={{ width: "100%" }}
            value={filters.subcate || undefined}
            onChange={(value) => handleSelectChange(value, "subcate")}
            disabled={subcategories.length === 0}
            options={[
              { value: "", label: "Tất cả" },
              ...(subcategories?.map((subcategory) => ({
                value: subcategory.scat_name,
                label: subcategory.scat_name,
              })) || []),
            ]}
            notFoundContent={
              subcategories.length === 0 && filters.category
                ? "Không có danh mục con"
                : undefined
            }
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            Thương hiệu
          </label>
          <Select
            placeholder={
              brandsLoading ? "Đang tải thương hiệu..." : "Chọn thương hiệu"
            }
            style={{ width: "100%" }}
            value={filters.brand || undefined}
            onChange={(value) => handleSelectChange(value, "brand")}
            disabled={brandsLoading || !!brandsError}
            status={brandsError ? "error" : ""}
            loading={brandsLoading}
            options={[
              { value: "", label: "Tất cả" },
              ...(brands?.map((brand) => ({
                value: brand.name,
                label: brand.name,
              })) || []),
            ]}
            notFoundContent={
              brandsError ? "Không thể tải thương hiệu" : undefined
            }
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            Sắp xếp theo
          </label>
          <Select
            style={{ width: "100%" }}
            value={filters.sortBy}
            onChange={(value) => handleSelectChange(value, "sortBy")}
            options={[
              { value: "newest", label: "Mới nhất" },
              { value: "priceLow", label: "Giá thấp đến cao" },
              { value: "priceHigh", label: "Giá cao đến thấp" },
            ]}
          />
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
  brands: PropTypes.array,
  brandsLoading: PropTypes.bool,
  brandsError: PropTypes.object,
};

export default FilterPanel;
