import { Image } from "antd";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const OrderSuccessPage = () => {
  const location = useLocation();

  const invoiceUrl = location.state?.invoice_url;
  const qrCodeUrl = location.state?.qr_code_url;

  const printRef = useRef();

  return (
    <div className="mt-45 mb-20 flex min-h-screen items-center justify-center p-6 pt-10">
      <div
        className="w-full max-w-3xl rounded-xl border-1 bg-white p-8 shadow-2xl"
        ref={printRef}
      >
        <h2 className="text-center text-3xl font-bold text-primary-dark">
          Đặt hàng thành công!
        </h2>
        <p className="mt-2 text-center text-gray-700">
          Nhân viên sẽ liên hệ để xác nhận lại đơn hàng trong vòng 1 ngày.
        </p>

        {invoiceUrl && (
          <div className="mt-4">
            <Image src={invoiceUrl} alt="Hóa đơn" className="mt-2 w-full" />
          </div>
        )}

        {qrCodeUrl && (
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">Quét mã để tải hóa đơn</h3>
            <div className="flex w-full items-center justify-center">
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                className="mt-2 aspect-square"
              />
            </div>
          </div>
        )}

        <div className="my-6 text-center">
          {/* Về trang chủ */}

          <Link to="/" className="rounded-lg bg-primary-medium px-5 my-3 py-3 text-white">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
