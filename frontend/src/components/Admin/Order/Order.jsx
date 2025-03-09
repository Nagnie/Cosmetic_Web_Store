import React, {useState} from 'react';
import {Edit, Eye, PlusCircle, Save, Search, Trash2, X} from "lucide-react";

const Order = () => {
    const [orders, setOrders] = useState([
        {
            id: 1,
            name: 'Nguyễn Văn A',
            phone: '0123456789',
            address: '123 Lê Lợi',
            price: '1.200.000',
            status: 'Đã giao',
            products: [
                {
                    name: 'Medicube PDR',
                    image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021429010ko.jpg?l=ko',
                    price: '600.000',
                    quantity: 2
                },
                {
                    name: 'UNOVE Deep Damage Treament Ex',
                    image: 'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0017/A00000017142381ko.jpg?l=ko',
                    price: '800.000',
                    quantity: 1
                }
            ]
        },
        {
            id: 2,
            name: 'Nguyễn Văn B',
            phone: '0123456789',
            address: '123 Lê Lợ',
            price: '1.200.000',
            status: 'Đang giao',
            products: [
                {
                    name: 'Ma:nyo Pure Cleansing Oil 200ml',
                    image: 'https://image',
                    price: '650.000',
                    quantity: 1
                },
                {
                    name: 'Flow lifting wrapping cream KOY 50ml',
                    image: 'https://image',
                    price: '1.200.000',
                    quantity: 1
                }]
        },
        {
            id: 3,
            name: 'Nguyễn Văn C',
            phone: '0123456789',
            address: '123 Lê Lợi',
            price: '1.200.000',
            status: 'Đã order',
            products: [
                {
                    name: "d'Alba Waterfull Tone-up Sun Cream SPF 50+ 50ml",
                    image: 'https://image',
                    price: '900.000',
                    quantity: 1
                },
                {
                    name: 'Dear Dahlia Blooming Edition Petal Drop Liquid Blush 4g',
                    image: 'https://image',
                    price: '500.000',
                    quantity: 1
                }]
        },
        {
            id: 4,
            name: 'Nguyễn Văn D',
            phone: '0123456789',
            address: '123 Lê Lợi',
            price: '1.200.000',
            status: 'Chưa order',
            products: [
                {
                    name: 'Mamonde Rose + PHA Liquid Mask 80ml',
                    image: 'https://image',
                    price: '750.000',
                    quantity: 1
                },
                {
                    name: 'MEDIHEAL N.M.F Intensive Hydrating Toner Pad 90ml',
                    image: 'https://image',
                    price: '550.000',
                    quantity: 1
                }]
        },
    ]);

    const [order, setOrder] = useState({
        id: '',
        name: '',
        phone: '',
        address: '',
        price: '',
        status: '',
        products: []
    });

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    const filterOrders = orders.filter(order =>
        order.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (order) => {
        setViewOpen(true);
        setOrder(order);
    }

    const handleCloseView = () => {
        setViewOpen(false);
    }

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa đơn hàng này không?')) {
            setOrders(orders.filter(order => order.id !== id));
        }
    }

    return (
        <div>
            <main className="container mx-auto px-5">
                {/* Search and Filter */}
                <div className="relative">
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search orders..."
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

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden text-left">
                    <div className="overflow-x-auto ">
                        <table className="w-full whitespace-nowrap">
                            <thead style={{ backgroundColor: '#D14D72' }}>
                            <tr className="text-white">
                                <th></th>
                                <th className="px-6 py-3 font-medium">MÃ ĐƠN</th>
                                <th className="px-6 py-3 font-medium">KHÁCH HÀNG</th>
                                <th className="px-6 py-3 font-medium">SĐT</th>
                                <th className="px-6 py-3 font-medium">ĐỊA CHỈ</th>
                                <th className="px-6 py-3 font-medium">TỔNG TIỀN</th>
                                <th className="px-6 py-3 font-medium">TRẠNG THÁI</th>
                                <th className="px-6 py-3 font-medium">THAO TÁC</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {filterOrders.map(order => (
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
                                    <td className="px-6 py-4">{order.phone}</td>
                                    <td className="px-6 py-4">{order.address}</td>
                                    <td className="px-6 py-4">{order.price} đ</td>
                                    <td className="px-6 py-4">
                                            <span className={`px-3 pt-1 pb-2 rounded-full text-xs font-semibold ${
                                                order.status === 'Đã giao'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'Đang giao'
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : order.status === 'Đã order' 
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800' 
                                            }`}>
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
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

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
                                    </div>
                                </div>

                                {/* Products List */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
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
                                                        {parseFloat(product.price.replace(/\./g, '')) * product.quantity} đ
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