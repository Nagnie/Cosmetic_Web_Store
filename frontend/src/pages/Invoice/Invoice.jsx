import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image } from "antd";

const Invoice = () => {
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if invoice data exists in localStorage from previous API call
    const invoiceData = localStorage.getItem("invoiceData");

    if (invoiceData) {
      // If we already have invoice data from the previous page, use it
      const parsedData = JSON.parse(invoiceData);
      setInvoiceUrl(parsedData.invoice_url.url);
      setQrCodeUrl(parsedData.qr_code_url.url);
      setIsLoading(false);
    } else {
      // If no data in localStorage, we might need to fetch it again
      const fetchInvoice = async () => {
        try {
          const persistData = localStorage.getItem("persistData");

          if (!persistData) {
            console.error("No order data found");
            setIsLoading(false);
            return;
          }

          const res = await fetch("/api/order/invoice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ persistData: JSON.parse(persistData) }),
          });

          if (res.ok) {
            const data = await res.json();
            setInvoiceUrl(data.data.invoice_url.url);
            setQrCodeUrl(data.data.qr_code_url.url);

            // Store for future reference
            localStorage.setItem("invoiceData", JSON.stringify(data.data));
          } else {
            console.error("Error fetching invoice");
          }
        } catch (err) {
          console.error("API call error:", err);
        } finally {
          setIsLoading(false);
        }
      };

      localStorage.removeItem("fullData");
      localStorage.removeItem("invoiceData");
      fetchInvoice();
    }
  }, []);

  return (
      <div className="mt-45 mb-20 flex min-h-screen items-center justify-center p-6 pt-10">
        <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-8 shadow-2xl">
          <h2 className="text-center text-3xl font-bold text-gray-800">
            Đặt hàng thành công!
          </h2>
          <p className="mt-2 text-center text-gray-700">
            Nhân viên sẽ liên hệ để xác nhận lại đơn hàng trong vòng 1 ngày.
          </p>

          {isLoading ? (
              <div className="mt-8 text-center">
                <p>Đang tải hóa đơn...</p>
              </div>
          ) : (
              <>
                {invoiceUrl ? (
                    <div className="mt-4">
                      <Image src={invoiceUrl} alt="Hóa đơn" className="mt-2 w-full" />
                    </div>
                ) : (
                    <div className="mt-8 text-center">
                      <p className="text-red-500">Không thể tải hóa đơn</p>
                    </div>
                )}

                {qrCodeUrl && (
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-semibold">Quét mã để tải hóa đơn</h3>
                      <div className="flex w-full items-center justify-center">
                        <Image
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="mt-2 h-48 w-48"
                        />
                      </div>
                    </div>
                )}
              </>
          )}

          <div className="my-6 text-center">
            <Link to="/" className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700 inline-block">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
  );
};

export default Invoice;