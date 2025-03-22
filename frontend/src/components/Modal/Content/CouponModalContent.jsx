import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Input,
  List,
  Space,
  Tag,
  Typography,
  Checkbox,
  Empty,
  Alert,
} from "antd";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import "./CouponModalContent.css";
import CustomSpin from "@components/Spin/CustomSpin";
import { useVouchers } from "@hooks/useVoucherQueries";

const { Text } = Typography;

// Color palette
const colors = {
  primary: {
    DEFAULT: "#91775E",
    light: "#C8B6A6",
    dark: "#675746",
  },
  secondary: {
    DEFAULT: "#F1DEC9",
  },
  neutral: {
    DEFAULT: "#FFFFFF",
  },
};

// Input và button styles
const inputStyles = {
  input: {
    borderColor: colors.primary.light,
    borderRadius: "4px",
  },
  searchButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderColor: colors.primary.DEFAULT,
    color: colors.neutral.DEFAULT,
  },
  clearButton: {
    backgroundColor: colors.secondary.DEFAULT,
    borderColor: colors.primary.light,
    color: colors.primary.dark,
  },
};

const tagColors = {
  price: {
    backgroundColor: colors.primary.light,
    color: colors.primary.dark,
    borderColor: colors.primary.DEFAULT,
  },
  expiry: {
    backgroundColor: colors.secondary.DEFAULT, // Màu kem - secondary.DEFAULT
    color: colors.primary.dark, // Màu nâu đậm - primary.dark
    borderColor: colors.primary.light, // Màu nâu nhạt - primary.light
  },
  discount: {
    backgroundColor: colors.primary.DEFAULT, // Màu nâu - primary.DEFAULT
    color: colors.neutral.DEFAULT, // Màu trắng - neutral.DEFAULT
    borderColor: colors.primary.dark, // Màu nâu đậm - primary.dark
  },
};

// Custom CSS để tùy chỉnh checkbox
const getCustomCheckboxStyles = (isMobile) => `
  .coupon-checkbox .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${colors.primary.DEFAULT};
    border-color: ${colors.primary.DEFAULT};
    ${isMobile ? "border-radius: 50%;" : ""}
  }
  .coupon-checkbox .ant-checkbox-inner {
    border-color: ${colors.primary.light};
    ${
      isMobile
        ? `
      border-radius: 50%; 
      width: 18px;
      height: 18px;
    `
        : ""
    }
  }
  .coupon-checkbox .ant-checkbox-checked::after {
    border-color: ${colors.primary.DEFAULT};
    ${isMobile ? "border-radius: 50%;" : ""}
  }
  .coupon-checkbox .ant-checkbox:hover .ant-checkbox-inner {
    border-color: ${colors.primary.DEFAULT};
  }
  
  ${
    isMobile
      ? `
  .mobile-checkbox-container {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
  }
  
  .coupon-item {
    position: relative;
  }
  
  .coupon-item .ant-checkbox-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  `
      : ""
  }
`;

// Component tùy chỉnh Empty cho tiếng Việt
const CustomEmptyComponent = () => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={
      <span style={{ color: colors.primary.dark }}>
        Không có mã giảm giá nào
      </span>
    }
  />
);

const CouponModalContent = ({ onApplyCoupon, selectedVoucher, onCancel }) => {
  const [voucherParams, setVoucherParams] = useState({
    limit: 5,
    page: 1,
    orderBy: "ASC",
    sortBy: "id",
  });

  const vouchersQuery = useVouchers(voucherParams);

  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  // Sử dụng selectedVoucherId để theo dõi ID của voucher được chọn
  const [selectedCouponId, setSelectedCouponId] = useState(
    selectedVoucher ? selectedVoucher.id : null,
  );

  // Format vouchers từ API để phù hợp với cấu trúc hiển thị - di chuyển từ component cha
  const formattedVouchers = useMemo(() => {
    if (!vouchersQuery.data?.data?.data) return [];

    return vouchersQuery.data.data.data.map((voucher) => {
      // Chuyển đổi ngày hết hạn sang định dạng DD/MM/YYYY
      const endDate = new Date(voucher.end_at);
      const formattedEndDate = `${endDate.getDate().toString().padStart(2, "0")}/${(endDate.getMonth() + 1).toString().padStart(2, "0")}/${endDate.getFullYear()}`;

      // Xác định giá trị và tiêu đề dựa trên unit (fixed hoặc percentage)
      let price, title, ribbonText;
      if (voucher.unit === "fixed") {
        price = `${new Intl.NumberFormat("vi-VN").format(voucher.value)}đ`;
        title = "Giảm giá cố định";
        ribbonText = `${Math.floor(voucher.value / 1000)}K`;
      } else {
        price = `Tối đa ${new Intl.NumberFormat("vi-VN").format(voucher.max_value)}đ`;
        title = `Giảm ${voucher.value}%`;
        ribbonText = `${voucher.value}%`;
      }

      return {
        id: voucher.id,
        title: title,
        price: price,
        description: `Áp dụng cho đơn hàng từ ${new Intl.NumberFormat("vi-VN").format(voucher.minimum_order_value)}đ`,
        code: voucher.code,
        expiry: formattedEndDate,
        ribbonText: ribbonText,
        // Lưu giữ dữ liệu gốc để sử dụng khi cần
        originalData: voucher,
      };
    });
  }, [vouchersQuery.data]);

  // Cập nhật danh sách vouchers khi dữ liệu thay đổi
  useEffect(() => {
    if (formattedVouchers && formattedVouchers.length > 0) {
      setFilteredVouchers(formattedVouchers);
    }
  }, [formattedVouchers]);

  // Cập nhật selectedCouponId khi selectedVoucher thay đổi từ bên ngoài
  useEffect(() => {
    setSelectedCouponId(selectedVoucher ? selectedVoucher.id : null);
  }, [selectedVoucher]);

  const isMobile = windowWidth < 576;

  // Thêm custom CSS để styling checkbox
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = getCustomCheckboxStyles(isMobile);
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [isMobile]);

  // Responsive page size based on window width
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);

        // Điều chỉnh kích thước trang dựa trên kích thước màn hình
        if (window.innerWidth < 576) {
          setVoucherParams((prev) => ({
            ...prev,
            limit: 3, // Kích thước nhỏ hơn cho mobile
          }));
        } else {
          setVoucherParams((prev) => ({
            ...prev,
            limit: 5, // Kích thước lớn hơn cho desktop
          }));
        }
      };

      window.addEventListener("resize", handleResize);
      handleResize(); // Set initial size

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handlePageChange = (page, pageSize) => {
    setVoucherParams((prev) => ({
      ...prev,
      page,
      limit: pageSize,
    }));
  };

  // Search functionality
  const handleSearch = () => {
    if (searchText.trim() === "") {
      setFilteredVouchers(formattedVouchers || []);
      return;
    }

    const filtered = (formattedVouchers || []).filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(searchText.toLowerCase()) ||
        coupon.title.toLowerCase().includes(searchText.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchText.toLowerCase()),
    );

    setFilteredVouchers(filtered);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilteredVouchers(formattedVouchers || []);
  };

  // Xử lý việc chọn mã giảm giá
  const handleCouponSelect = (couponId) => {
    // Nếu đang chọn mã giảm giá đã được chọn, bỏ chọn nó
    if (selectedCouponId === couponId) {
      setSelectedCouponId(null);
      // Thông báo cho component cha rằng không có mã nào được chọn
      if (onApplyCoupon) onApplyCoupon(null);

      // Đóng modal nếu có callback onCancel
      if (onCancel) onCancel();
    } else {
      // Ngược lại, chọn mã giảm giá mới
      setSelectedCouponId(couponId);
      // Tìm dữ liệu của mã giảm giá được chọn
      const selectedCouponData = formattedVouchers.find(
        (v) => v.id === couponId,
      );
      // Thông báo cho component cha về mã giảm giá được chọn
      if (onApplyCoupon) onApplyCoupon(selectedCouponData);

      // Đóng modal nếu có callback onCancel
      if (onCancel) onCancel();
    }
  };

  // Render checkbox phù hợp với desktop hoặc mobile
  const renderCheckbox = (coupon) => {
    if (isMobile) {
      return (
        <div className="mobile-checkbox-container">
          <Checkbox
            className="coupon-checkbox"
            checked={selectedCouponId === coupon.id}
            onChange={(e) => {
              // Ngăn chặn sự kiện lan truyền để tránh kích hoạt onClick của ListItem
              e.stopPropagation();
              handleCouponSelect(coupon.id);
            }}
          />
        </div>
      );
    } else {
      return (
        <Checkbox
          className="coupon-checkbox"
          checked={selectedCouponId === coupon.id}
          onChange={(e) => {
            // Ngăn chặn sự kiện lan truyền để tránh kích hoạt onClick của ListItem
            e.stopPropagation();
            handleCouponSelect(coupon.id);
          }}
          style={{
            marginRight: "12px",
          }}
        />
      );
    }
  };

  // Render trạng thái loading
  if (vouchersQuery.isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <CustomSpin size="large" />
      </div>
    );
  }

  // Render trạng thái lỗi
  if (vouchersQuery.error) {
    return (
      <div className="p-4">
        <Alert
          message="Lỗi khi tải mã giảm giá"
          description={vouchersQuery.error.message || "Vui lòng thử lại sau"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="coupon-modal-container">
      {/* Responsive search bar */}
      <div className="search-container" style={{ marginBottom: 16 }}>
        {windowWidth > 576 ? (
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Tìm kiếm mã giảm giá"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{
                width: "calc(100% - 90px)",
                ...inputStyles.input,
              }}
            />
            <Button
              icon={<CloseOutlined />}
              onClick={handleClearSearch}
              style={inputStyles.clearButton}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={inputStyles.searchButton}
            >
              Tìm kiếm
            </Button>
          </Space.Compact>
        ) : (
          <div>
            <Input
              placeholder="Tìm kiếm mã giảm giá"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{
                width: "100%",
                marginBottom: 8,
                ...inputStyles.input,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                icon={<CloseOutlined />}
                onClick={handleClearSearch}
                style={{
                  width: "48%",
                  ...inputStyles.clearButton,
                }}
              >
                Xóa
              </Button>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                style={{
                  width: "48%",
                  ...inputStyles.searchButton,
                }}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách responsive có checkbox */}
      <List
        itemLayout="horizontal"
        dataSource={filteredVouchers}
        locale={{
          emptyText: <CustomEmptyComponent />,
        }}
        pagination={{
          current: voucherParams.page,
          pageSize: voucherParams.limit,
          total: vouchersQuery.data?.data?.total_items || 0,
          onChange: handlePageChange,
          showSizeChanger: false,
          responsive: true,
          size: "small",
        }}
        renderItem={(coupon) => (
          <List.Item
            className={`coupon-item cursor-pointer hover:bg-gray-50 ${
              selectedCouponId === coupon.id ? "selected-coupon" : ""
            }`}
            style={{
              padding: windowWidth < 576 ? "16px 8px 8px 8px" : "16px",
              transition: "all 0.3s ease",
              backgroundColor:
                selectedCouponId === coupon.id ? "#f6f0e8" : "inherit",
              border:
                selectedCouponId === coupon.id
                  ? `1px solid ${colors.primary.DEFAULT}`
                  : "1px solid transparent",
              borderRadius: "4px",
              marginBottom: "4px",
              cursor: "pointer",
            }}
            onClick={() => handleCouponSelect(coupon.id)}
          >
            {renderCheckbox(coupon)}
            <List.Item.Meta
              title={
                <div
                  className="coupon-title flex gap-2"
                  style={{
                    flexDirection: windowWidth < 576 ? "column" : "row",
                    marginLeft: windowWidth < 576 ? "0" : "0",
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: windowWidth < 576 ? "14px" : "16px",
                      color:
                        selectedCouponId === coupon.id
                          ? colors.primary.dark
                          : "inherit",
                    }}
                  >
                    {coupon.code}
                  </Text>
                  <Tag
                    color="green"
                    className="flex h-6 w-fit items-center justify-center rounded"
                    style={{
                      margin: windowWidth < 576 ? "4px 0" : "",
                      backgroundColor: colors.primary.DEFAULT,
                      color: colors.neutral.DEFAULT,
                      borderColor: colors.primary.dark,
                      boxShadow: "0 2px 4px rgba(103, 87, 70, 0.2)",
                      fontWeight: "500",
                      lineHeight: "23px",
                    }}
                  >
                    {coupon.price}
                  </Tag>
                  {coupon.category && (
                    <Tag color="purple">{coupon.category}</Tag>
                  )}
                </div>
              }
              description={
                <div style={{ fontSize: windowWidth < 576 ? "12px" : "14px" }}>
                  <Text>{coupon.description}</Text>
                  <br />
                  <Text type="secondary">{coupon.title}</Text>
                </div>
              }
            />
            <Tag
              color="blue"
              style={{
                fontSize: windowWidth < 576 ? "11px" : "14px",
                ...tagColors.expiry,
              }}
            >
              HSD: {coupon.expiry}
            </Tag>
          </List.Item>
        )}
      />
    </div>
  );
};

CouponModalContent.propTypes = {
  onApplyCoupon: PropTypes.func,
  selectedVoucher: PropTypes.object,
  onCancel: PropTypes.func,
  vouchers: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  paginationInfo: PropTypes.object,
};

export default CouponModalContent;
