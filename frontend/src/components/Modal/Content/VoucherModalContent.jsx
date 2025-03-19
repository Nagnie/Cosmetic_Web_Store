import PropTypes from "prop-types";
import { CopyOutlined } from "@ant-design/icons";
import { message, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const VoucherModalContent = ({ item, onCancel }) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth < 640;

  const copyVoucherCode = () => {
    const code = item.code ?? "FASHION30";
    navigator.clipboard.writeText(code);
    message.success({
      content: `Đã sao chép mã ${code}`,
    });
  };

  return (
    <div className="bg-background-DEFAULT">
      {/* Phần header với gradient màu */}
      <div
        className={`from-primary-dark to-secondary-medium text-neutral-DEFAULT relative mb-4 bg-gradient-to-r p-6 ${isMobile ? "px-4 py-5" : ""}`}
      >
        <div className="bg-secondary-DEFAULT text-primary-deepest absolute top-0 right-0 rotate-12 transform px-4 py-1 font-bold shadow-md">
          {item.ribbonText ?? "30%"}
        </div>
        <h2 className={`${isMobile ? "text-2xl" : "text-3xl"} mb-2 font-bold`}>
          {item.title ?? "Giảm 30%"}
        </h2>
        <h3 className={`${isMobile ? "text-lg" : "text-xl"} font-semibold`}>
          {item.price ?? "Tối đa 199.000đ"}
        </h3>
      </div>

      {/* Phần thông tin chi tiết */}
      <div className={`space-y-4 ${isMobile ? "px-4" : "px-6"}`}>
        <div>
          <h4 className="text-primary-light font-medium">Điều kiện áp dụng</h4>
          <p
            className={`${isMobile ? "text-base" : "text-lg"} text-primary-deepest`}
          >
            {item.description ?? "Đơn hàng từ 300.000đ"}
          </p>
        </div>

        <div>
          <h4 className="text-primary-light font-medium">Thời gian hiệu lực</h4>
          <p
            className={`${isMobile ? "text-base" : "text-lg"} text-primary-deepest`}
          >
            Hạn sử dụng: {item.expiry || "10/04/2025"}
          </p>
        </div>

        {/* Phần mã voucher và nút copy */}
        <div className="border-secondary-medium mt-6 border-t pt-4">
          <h4 className="text-primary-light mb-2 font-medium">
            Mã voucher của bạn
          </h4>
          <div
            className={`flex ${isMobile ? "flex-col" : "flex-row"} items-stretch`}
          >
            <div
              className={`${isMobile ? "mb-0 rounded-t-md" : "rounded-l-md"} bg-background-light border-secondary-medium text-primary-deepest flex-1 border border-dashed p-3 text-center font-mono text-lg font-bold`}
            >
              {item.code ?? "FASHION30"}
            </div>
            <button
              onClick={copyVoucherCode}
              className={`${isMobile ? "w-full rounded-b-md" : "rounded-r-md"} bg-primary-DEFAULT hover:bg-primary-dark text-neutral-DEFAULT flex items-center justify-center px-3 py-2 transition-colors`}
            >
              <CopyOutlined className="text-xl" />
              <span className="ml-2">Sao chép</span>
            </button>
          </div>
        </div>

        {/* Phần hướng dẫn sử dụng */}
        <div className="bg-secondary-DEFAULT bg-opacity-30 mt-4 rounded-md p-4">
          <h4 className="text-primary-deepest font-medium">
            Hướng dẫn sử dụng
          </h4>
          <ol className="text-primary-dark ml-5 list-decimal">
            <li>Sao chép mã voucher</li>
            <li>Áp dụng tại màn hình thanh toán</li>
            <li>Mã chỉ áp dụng một lần cho mỗi khách hàng</li>
          </ol>
        </div>

        {/* Phần điều khoản bổ sung */}
        <div className="mt-2">
          <Text italic className="text-neutral-gray text-xs">
            *Voucher có thể không áp dụng cùng với các khuyến mãi khác. Vui lòng
            xem thêm điều khoản chi tiết.
          </Text>
        </div>
      </div>

      {/* Nút sử dụng ngay */}
      <div className={`mt-6 ${isMobile ? "px-4 pb-4" : "px-6 pb-6"}`}>
        <button
          onClick={onCancel}
          className="bg-primary-dark hover:bg-primary-deepest text-neutral-DEFAULT w-full rounded-md py-3 font-semibold transition-colors"
        >
          Sử dụng ngay
        </button>
      </div>
    </div>
  );
};

VoucherModalContent.propTypes = {
  item: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default VoucherModalContent;
