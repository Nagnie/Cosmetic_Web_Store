import { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react';

export default function PaymentSuccess() {
    const [countdown, setCountdown] = useState(10);
    const [loading, setLoading] = useState(false);

    // Retrieve persistData from localStorage
    const fullData = localStorage.getItem("fullData");

    useEffect(() => {
        // Set up countdown for auto-redirect
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    // Redirect when countdown reaches 0
                    window.location.href = '/';
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Function to handle invoice generation and redirection
    const handleViewInvoice = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/order/invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: fullData,
            });

            const data = await response.json();

            if (response.ok) {
                // Store invoice data in localStorage for the invoice page
                localStorage.setItem("invoiceData", JSON.stringify(data.data));
                window.location.href = '/invoice';
            } else {
                console.error("Error generating invoice:", data.message);
                alert("Không thể tạo hóa đơn. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("API call failed:", error);
            alert("Đã xảy ra lỗi khi tạo hóa đơn. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-45 mb-20 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full rounded-lg shadow-2xl p-10 text-center">
                <div className="mb-6">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán thành công!</h1>
                <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.
                </p>

                <p className="text-sm text-gray-500 mb-6">
                    Chọn xem đơn hàng để nhận và tải hóa đơn của bạn.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleViewInvoice}
                        disabled={loading}
                        className="inline-flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-500"
                    >
                        <ExternalLink size={18} className="mr-2" />
                        {loading ? 'Đang tải...' : 'Xem đơn hàng của tôi'}
                    </button>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center bg-white text-gray-600 py-2 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-1" />
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}