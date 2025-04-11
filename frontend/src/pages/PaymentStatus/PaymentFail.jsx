import { useState, useEffect } from 'react';
import { XCircle, Home, RefreshCw } from 'lucide-react';

export default function PaymentFail() {
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const error = params.get('orderCode') || 'Không xác định';
                console.log(error);

                // Gọi API để hủy thanh toán
                const res = await fetch(`http://localhost:3001/api/payment/cancel/${error}`, {
                    method: 'GET',
                });

                console.log(res);

                if (!res.ok) throw new Error("Có lỗi khi hủy thanh toán");

                console.log('Đã hủy thanh toán thành công');
            } catch (err) {
                console.error('Lỗi khi hủy thanh toán:', err);
            }
        };

        // Gọi API ngay khi component được render
        fetchData();

        // Thiết lập đếm ngược để chuyển hướng
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    window.location.href = '/'; // Tự động chuyển hướng khi đếm ngược kết thúc
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="mt-45 mb-20 flex flex-col items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-10 text-center">
                <div className="mb-6">
                    <XCircle className="mx-auto h-16 w-16 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán không thành công</h1>
                <p className="text-gray-600 mb-6">
                    Rất tiếc, giao dịch của bạn không thể hoàn tất vào lúc này.
                </p>

                <p className="text-sm text-gray-500 mb-6">
                    Có thể có vấn đề với phương thức thanh toán hoặc kết nối mạng của bạn.
                    Vui lòng thử lại hoặc sử dụng phương thức thanh toán khác.
                </p>

                <div className="flex flex-col gap-3">
                    <a
                        href="/checkout"
                        className="inline-flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                        <RefreshCw size={18} className="mr-2" />
                        Thử thanh toán lại
                    </a>

                    <a
                        href="/"
                        className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <Home size={18} className="mr-2" />
                        Trở về trang chủ ({countdown}s)
                    </a>
                </div>
            </div>
        </div>
    );
}