import { useRef } from "react";
import { useLocation } from "react-router-dom";

const OrderSuccessPage = () => {
  const location = useLocation();

  const invoiceUrl = location.state?.invoice_url;
  const qrCodeUrl = location.state?.qr_code_url;

  const printRef = useRef();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div
        className="w-full max-w-3xl rounded-xl border-1 bg-white p-8 shadow-2xl"
        ref={printRef}
      >
        <h2 className="text-center text-2xl font-bold text-green-600">
          Đặt hàng thành công!
        </h2>
        <p className="mt-2 text-center text-gray-700">
          Nhân viên sẽ liên hệ để xác nhận lại đơn hàng trong vòng 1 ngày.
        </p>

        {invoiceUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Hóa đơn</h3>
            <img src={invoiceUrl} alt="Hóa đơn" className="mt-2 w-full" />
          </div>
        )}

        {qrCodeUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Quét mã để tải hóa đơn</h3>
            <img src={qrCodeUrl} alt="QR Code" className="mt-2 w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessPage;
