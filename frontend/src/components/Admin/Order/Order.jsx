import React, { useState, useEffect } from 'react';
import { Edit, Eye, PlusCircle, Save, Search, Trash2, X } from "lucide-react";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1
    });

    const [order, setOrder] = useState({
        id: '',
        customer: '',
        phone: '',
        address: '',
        sumPrice: '',
        status: '',
        email: '',
        note: '',
        products: []
    });

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [viewOpen, setViewOpen] = useState(false);

    // Fetch orders from API
    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/api/order?limit=10&page=${page}`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const result = await response.json();

            // Transform API data to match component state structure
            const transformedOrders = result.data.orders.map(order => ({
                id: order.id,
                name: order.customer,
                phone: order.phone,
                address: order.address,
                price: formatPrice(order.sumPrice),
                status: translateStatus(order.status),
                email: order.email,
                note: order.note,
                products: [] // We'll need to fetch products separately or adjust the API
            }));

            setOrders(transformedOrders);
            setPagination({
                currentPage: page,
                totalPages: result.data.allPage
            });
        } catch (err) {
            setError(err.message);
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    // Format price to Vietnamese currency format
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Translate API status to Vietnamese display text
    const translateStatus = (status) => {
        const statusMap = {
            'not_ordered': 'Chưa đặt hàng',
            'ordered': 'Đã đặt hàng',
            'shipping': 'Đang giao',
            'delivered': 'Đã giao',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    };

    // Get CSS class for status badge
    const getStatusClass = (status) => {
        switch(status) {
            case 'Đã giao':
                return 'bg-green-100 text-green-800';
            case 'Đang giao':
                return 'bg-blue-100 text-blue-800';
            case 'Đã đặt hàng':
                return 'bg-yellow-100 text-yellow-800';
            case 'Chưa đặt hàng':
                return 'bg-orange-100 text-orange-800';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter orders based on search term
    const filterOrders = orders.filter(order =>
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (order) => {
        // In a real implementation, you might fetch order details including products here
        setViewOpen(true);
        setOrder(order);
    };

    const handleCloseView = () => {
        setViewOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa đơn hàng này không?')) {
            try {
                // Implement actual API delete call here
                // const response = await fetch(`http://localhost:3001/api/order/${id}`, {
                //     method: 'DELETE'
                // });
                // if (!response.ok) throw new Error('Failed to delete order');

                // For now, just update UI
                setOrders(orders.filter(order => order.id !== id));
            } catch (err) {
                console.error('Error deleting order:', err);
                alert('Không thể xóa đơn hàng. Vui lòng thử lại sau.');
            }
        }
    };

    // Load orders when component mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <main className="container mx-auto px-5">
                {/* Search and Filter */}
                <div className="relative">
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && <div className="text-center py-8">Đang tải dữ liệu...</div>}
                {error && <div className="text-center py-8 text-red-600">Lỗi: {error}</div>}

                {/* Orders Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden text-left">
                        <div className="overflow-x-auto">
                            <table className="w-full whitespace-nowrap">
                                <thead style={{ backgroundColor: '#D14D72' }}>
                                <tr className="text-white">
                                    <th></th>
                                    <th className="px-6 py-3 font-medium">MÃ ĐƠN</th>
                                    <th className="px-6 py-3 font-medium">KHÁCH HÀNG</th>
                                    <th className="px-6 py-3 font-medium">EMAIL</th>
                                    <th className="px-6 py-3 font-medium">SĐT</th>
                                    <th className="px-6 py-3 font-medium">ĐỊA CHỈ</th>
                                    <th className="px-6 py-3 font-medium">TỔNG TIỀN</th>
                                    <th className="px-6 py-3 font-medium">TRẠNG THÁI</th>
                                    <th className="px-6 py-3 font-medium">THAO TÁC</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {filterOrders.length > 0 ? (
                                    filterOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="relative inline-block">
                                                    <input
                                                        type="checkbox"
                                                        className="peer appearance-none h-5 w-5 rounded border border-gray-300 checked:bg-rose-400 checked:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all cursor-pointer"
                                                    />
                                                    <svg
                                                        className="absolute w-5 h-5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white top-0 left-0"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="6 12 10 16 18 8"></polyline>
                                                    </svg>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">#{order.id}</td>
                                            <td className="px-6 py-4">{order.name}</td>
                                            <td className="px-6 py-4">{order.email}</td>
                                            <td className="px-6 py-4">{order.phone}</td>
                                            <td className="px-6 py-4">{order.address}</td>
                                            <td className="px-6 py-4">{order.price} đ</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 pt-1 pb-2 rounded-full text-xs font-semibold ${getStatusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleView(order)}
                                                    className="text-blue-600 hover:text-blue-900 mx-1"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="text-red-600 hover:text-red-900 mx-1"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                                            Không tìm thấy đơn hàng nào
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => fetchOrders(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className={`px-3 py-1 rounded-md ${
                                    pagination.currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border`}
                            >
                                Trước
                            </button>
                            {Array.from({ length: pagination.totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => fetchOrders(i + 1)}
                                    className={`px-3 py-1 rounded-md ${
                                        pagination.currentPage === i + 1
                                            ? 'bg-rose-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => fetchOrders(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className={`px-3 py-1 rounded-md ${
                                    pagination.currentPage === pagination.totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border`}
                            >
                                Sau
                            </button>
                        </nav>
                    </div>
                )}

                {/* Order Detail Modal */}
                {viewOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
                            <div className="flex justify-between items-center border-b p-4">
                                <h2 className="text-xl font-bold">Chi tiết đơn hàng #{order.id}</h2>
                                <button onClick={handleCloseView} className="text-gray-500 hover:text-gray-700">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-4">
                                {/* Customer Info */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">Thông tin khách hàng</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600">Họ tên:</p>
                                            <p className="font-medium">{order.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Email:</p>
                                            <p className="font-medium">{order.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Số điện thoại:</p>
                                            <p className="font-medium">{order.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Địa chỉ:</p>
                                            <p className="font-medium">{order.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Trạng thái:</p>
                                            <p className="font-medium">{order.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Ghi chú:</p>
                                            <p className="font-medium">{order.note || "Không có ghi chú"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Products List - This would need product data from API */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
                                    {order.products && order.products.length > 0 ? (
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="w-full">
                                                <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="px-4 py-2 text-left">Sản phẩm</th>
                                                    <th className="px-4 py-2 text-right">Đơn giá</th>
                                                    <th className="px-4 py-2 text-right">Số lượng</th>
                                                    <th className="px-4 py-2 text-right">Thành tiền</th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                {order.products.map((product, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center">
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-12 h-12 object-cover rounded-md mr-3"
                                                                    onError={(e) => {
                                                                        e.target.src = "/api/placeholder/100/100";
                                                                    }}
                                                                />
                                                                <span>{product.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">{product.price} đ</td>
                                                        <td className="px-4 py-3 text-right">{product.quantity}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            {typeof product.price === 'string'
                                                                ? (parseFloat(product.price.replace(/\./g, '')) * product.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                                                : (product.price * product.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan="3" className="px-4 py-3 text-right font-bold">Tổng cộng:</td>
                                                    <td className="px-4 py-3 text-right font-bold">{order.price} đ</td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 border rounded-lg">
                                            <p className="text-gray-500">
                                                Không có thông tin sản phẩm chi tiết
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t p-4 flex justify-end">
                                <button
                                    onClick={handleCloseView}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Order;