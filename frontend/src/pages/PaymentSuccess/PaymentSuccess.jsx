import React, { useRef } from "react";

const OrderSuccessPage = () => {
    const printRef = useRef();

    const orderData = {
        name: "Ngaa",
        phone: "0944444444",
        address: "74 Phạm Hồng Thái",
        city: "Bà Rịa - Vũng Tàu",
        district: "Huyện Côn Đảo",
        items: [
            { name: "Nước hoa ColorKey", quantity: 3, price: 229000, classification: "50ml" },
            { name: "Son môi ColorKey", quantity: 2, price: 189000, classification: "" },
        ],
        total: 687000,
    };

    return (
        <div className="min-h-screen flex items-center justify-center  p-6">
            <div className="bg-white p-8 rounded-xl shadow-2xl border-1 w-full max-w-3xl" ref={printRef}>
                <h2 className="text-2xl font-bold text-center text-green-600">Đặt hàng thành công!</h2>
                <p className="text-gray-700 text-center mt-2">
                    Nhân viên sẽ liên hệ để xác nhận lại đơn hàng trong vòng 1 ngày.
                </p>

                <div className="mt-6 border-t pt-4">
                    <h3 className="text-xl font-semibold">Thông tin đơn hàng</h3>
                    <p><strong>Họ và tên:</strong> {orderData.name}</p>
                    <p><strong>Số điện thoại:</strong> {orderData.phone}</p>
                    <p><strong>Địa chỉ:</strong> {orderData.address}, {orderData.city}, {orderData.district}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Sản phẩm đã đặt</h3>
                    <ul className="mt-2">
                        {orderData.items?.map((item, index) => (
                            <li key={index} className="border-b py-2">
                                <div className="flex justify-between">
                                    <div>
                                        <span>{item.name} (x{item.quantity})</span>
                                        {item.classification && (
                                            <p className="text-sm text-gray-500">Phân loại: {item.classification}</p>
                                        )}
                                    </div>
                                    <span>{item.price.toLocaleString()}đ</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6 flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span>{orderData.total.toLocaleString()}đ</span>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                        In / Lưu PDF
                    </button>
                    <a href="/" className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition">
                        Về trang chủ
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
