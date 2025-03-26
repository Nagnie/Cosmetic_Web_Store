import React, { useState, useEffect } from 'react';
import {Eye, Search, Trash2, X, Check, Edit2, ChevronLeft, ChevronRight, Save} from "lucide-react";
import ordersApi from '@apis/ordersApi'; // Adjust the import path as needed
import { RotateLoader } from "react-spinners";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
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
        checked: false,
        products: []
    });

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [editStatus, setEditStatus] = useState('');

    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

    // Status options for the dropdown
    const statusOptions = [
        { value: 'not_ordered', label: 'Chưa order' },
        { value: 'ordered', label: 'Đã order' },
        { value: 'delivering', label: 'Đang giao' },
        { value: 'delivered', label: 'Đã giao' }
    ];

    // Show action message
    const showActionMessage = (text, type) => {
        setActionMessage({ text, type });
        // Clear message after 3 seconds
        setTimeout(() => {
            setActionMessage({ text: '', type: '' });
        }, 3000);
    };


    // Fetch orders from API
    const fetchOrders = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await ordersApi.getOrders({ page, limit });
            const result = response.data;

            // Transform API data to match component state structure
            const transformedOrders = result.data.orders.map(order => ({
                id: order.id,
                name: order.customer,
                phone: order.phone,
                address: order.address,
                price: formatPrice(order.sumPrice),
                rawPrice: order.sumPrice,
                status: order.status,
                statusDisplay: translateStatus(order.status),
                email: order.email,
                note: order.note,
                checked: order.checked || false, // Add checked property with default false
                products: [] // Products will be fetched separately when viewing details
            }));

            setOrders(transformedOrders);
            setPagination({
                currentPage: Number(result.data.page),
                totalPages: result.data.total_pages,
                totalItems: result.data.total_items
            });
        } catch (err) {
            setError(err.message || 'Lỗi khi tải danh sách đơn hàng');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch order details from API
    const fetchOrderDetail = async (id) => {
        setLoadingDetail(true);
        try {
            const controller = new AbortController();
            const response = await ordersApi.getOrderDetail(id, { signal: controller.signal });
            const result = response.data;

            // Transform product data
            const products = result.data.allProducts.map(product => ({
                id: product.id,
                name: product.pro_name,
                image: product.pro_image || "/api/placeholder/100/100",
                price: formatPrice(product.price),
                rawPrice: product.price,
                quantity: product.quantity,
                className: product.class_name
            }));

            return products;
        } catch (err) {
            console.error('Error fetching order detail:', err);
            throw new Error('Không thể tải thông tin chi tiết đơn hàng');
        } finally {
            setLoadingDetail(false);
        }
    };

    // Format price to Vietnamese currency format
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Translate API status to Vietnamese display text
    const translateStatus = (status) => {
        const statusMap = {
            'not_ordered': 'Chưa order',
            'ordered': 'Đã order',
            'delivering': 'Đang giao',
            'delivered': 'Đã giao',
        };
        return statusMap[status] || status;
    };

    // Get CSS class for status badge
    const getStatusClass = (status) => {
        switch(status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'delivering':
                return 'bg-blue-100 text-blue-800';
            case 'ordered':
                return 'bg-yellow-100 text-yellow-800';
            case 'not_ordered':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-red-100 text-red-800';
        }
    };

    // Filter orders based on search term
    const filterOrders = orders.filter(order =>
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = async (order) => {
        setOrder(order);
        setViewOpen(true);

        try {
            const products = await fetchOrderDetail(order.id);
            setOrderDetail({
                ...order,
                products
            });
        } catch (err) {
            // Show error message
            alert(err.message);
        }
    };

    const handleCloseView = () => {
        setViewOpen(false);
        setOrderDetail(null);
    };

    const handleEdit = (order) => {
        setOrder(order);
        setEditStatus(order.status);
        setEditOpen(true);
    };

    const handleCloseEdit = () => {
        setEditOpen(false);
    };

    const handleSaveEdit = async () => {
        try {
            setActionLoading(true);
            await ordersApi.updateOrder(order.id, {
                status: editStatus
            });

            // Update the order in the local state
            const updatedOrders = orders.map(o =>
                o.id === order.id
                    ? {
                        ...o,
                        status: editStatus,
                        statusDisplay: translateStatus(editStatus)
                    }
                    : o
            );

            setOrders(updatedOrders);
            setEditOpen(false);
            showActionMessage('Orders update successfully', 'success');
        } catch (err) {
            console.error('Error updating order:', err);
            alert('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleChecked = async (id, currentChecked) => {
        try {
            await ordersApi.updateOrder(id, {
                checked: !currentChecked
            });

            // Update the order in the local state
            const updatedOrders = orders.map(o =>
                o.id === id ? { ...o, checked: !currentChecked } : o
            );

            setOrders(updatedOrders);
        } catch (err) {
            console.error('Error updating order checked status:', err);
            alert('Không thể cập nhật trạng thái kiểm tra. Vui lòng thử lại sau.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa đơn hàng này không?')) {
            try {
                await ordersApi.deleteOrder(id);
                setOrders(orders.filter(order => order.id !== id));
                showActionMessage('Order delete successfully', 'success');
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
                {/* Action Message */}
                {actionMessage.text && (
                    <div className={`mb-4 p-3 rounded ${actionMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {actionMessage.text}
                    </div>
                )}

                {/* Search and Filter */}
                <div className="relative">
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng theo tên, email, sđt..."
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
                {loading &&
                    <div className={"mt-60"}>
                        <RotateLoader color="#ffa6ae" />
                    </div>
                }
                {error && <div className="text-center py-8 text-red-600">Lỗi: {error}</div>}

                {/* Orders Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden text-left">
                        <div className="overflow-x-auto">
                            <table className="w-full whitespace-nowrap">
                                <thead style={{ backgroundColor: '#D14D72' }}>
                                <tr className="text-white">
                                    <th className="px-6 py-3 font-medium"></th>
                                    <th className="px-6 py-3 font-medium">ID</th>
                                    <th className="px-6 py-3 font-medium">Khách hàng</th>
                                    <th className="px-6 py-3 font-medium">Email</th>
                                    <th className="px-6 py-3 font-medium">SĐT</th>
                                    <th className="px-6 py-3 font-medium">Địa chỉ</th>
                                    <th className="px-6 py-3 font-medium">Tổng tiền</th>
                                    <th className="px-6 py-3 font-medium">Trạng thái</th>
                                    <th className="px-6 py-3 font-medium"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {filterOrders.length > 0 ? (
                                    filterOrders.map(order => (
                                        <tr key={order.id} className={`hover:bg-gray-50 ${order.checked ? 'bg-rose-50 hover:bg-rose-100' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="relative inline-block">
                                                    <input
                                                        type="checkbox"
                                                        checked={order.checked}
                                                        onChange={() => handleToggleChecked(order.id, order.checked)}
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
                                                    {translateStatus(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleView(order)}
                                                    className="text-blue-600 hover:text-blue-900 mx-1"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(order)}
                                                    className="text-orange-600 hover:text-orange-900 mx-1"
                                                    title="Sửa trạng thái"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="text-red-600 hover:text-red-900 mx-1"
                                                    title="Xóa đơn hàng"
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
                    <div className="flex justify-center items-center my-10 space-x-2">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => fetchOrders(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className={`p-2 rounded me-5 ${
                                    pagination.currentPage === 1
                                        ? 'bg-gray-200  cursor-not-allowed'
                                        : 'bg-pink-700 text-white hover:bg-pink-800'
                                } border`}
                            >
                                <ChevronLeft />
                            </button>
                            {Array.from({ length: pagination.totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => fetchOrders(i + 1)}
                                    className={`px-3 py-2 rounded-md ${
                                        pagination.currentPage === i + 1
                                            ? 'bg-pink-800 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    } border`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => fetchOrders(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className={`p-2 rounded-md ms-5 ${
                                    pagination.currentPage === pagination.totalPages
                                        ? 'bg-gray-200  cursor-not-allowed'
                                        : 'bg-pink-700 text-white hover:bg-pink-800'
                                } border`}
                            >
                                <ChevronRight />
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
                                {loadingDetail ? (
                                    <div className={"my-20"}>
                                        <RotateLoader color={"#c42e57"} />
                                    </div>
                                ) : (
                                    <>
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
                                                    <p className="font-medium">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(order.status)}`}>
                                                            {translateStatus(order.status)}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Đã kiểm tra:</p>
                                                    <p className="font-medium">{order.checked ? 'Đã kiểm tra' : 'Chưa kiểm tra'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Ghi chú:</p>
                                                    <p className="font-medium">{order.note || "Không có ghi chú"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products List */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
                                            {orderDetail && orderDetail.products && orderDetail.products.length > 0 ? (
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
                                                        {orderDetail.products.map((product, index) => (
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
                                                                        <div>
                                                                            <div>{product.name}</div>
                                                                            <div className="text-sm text-gray-500">Phân loại: {product.className}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">{product.price} đ</td>
                                                                <td className="px-4 py-3 text-right">{product.quantity}</td>
                                                                <td className="px-4 py-3 text-right">
                                                                    {formatPrice(product.rawPrice * product.quantity)} đ
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
                                    </>
                                )}
                            </div>

                            <div className="border-t p-4 flex justify-end">
                                <button
                                    onClick={handleCloseView}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Status Modal */}
                {editOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="flex justify-between items-center border-b p-4">
                                <h2 className="text-xl font-bold">Chỉnh sửa đơn hàng #{order.id}</h2>
                                <button onClick={handleCloseEdit} className="text-gray-500 hover:text-gray-700">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <label htmlFor="orderStatus" className="block text-left font-medium text-black mb-2">
                                        Trạng thái đơn hàng
                                    </label>
                                    <select
                                        id="orderStatus"
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="border-t p-4 flex justify-end space-x-3">
                                <button
                                    onClick={handleCloseEdit}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSaveEdit} disabled={actionLoading}
                                    className="px-4 py-2 text-white rounded flex items-center"
                                    style={{ background: '#D14D72' }}
                                >
                                    {actionLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="inline mr-2" size={16} />
                                            Update
                                        </>
                                    )}
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