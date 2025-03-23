import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, PlusCircle, Save, Search, Trash2, X, Eye } from "lucide-react";
import { MoonLoader } from 'react-spinners';
import comboApi from "@apis/comboApi.js";
import { Link } from 'react-router-dom';
import { Modal, Button, message } from 'antd';

const Combo = () => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 8;

    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Delete modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCombo, setSelectedCombo] = useState(null);

    // Format price with dots as thousand separators and add VNĐ
    const formatPrice = (price) => {
        if (!price) return "0 VNĐ";
        return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
    };

    // Load combos from API
    const fetchCombos = async (pageNum = page) => {
        setLoading(true);
        setError(null);

        try {
            const response = await comboApi.getCombos({
                page: pageNum,
                limit
            });

            if (response && response.data) {
                setCombos(response.data.data);
                setTotalPages(response.data.total_pages);
                setTotalItems(response.data.total_items);
            }
        } catch (err) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            console.error('Error fetching combos:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete combo
    const handleDeleteCombo = async (id) => {
        setActionLoading(true);

        try {
            // Replace with your actual delete API call
            // await comboApi.deleteCombo(id);

            // For now we'll just simulate a delete:
            await new Promise(resolve => setTimeout(resolve, 800));

            // Update the state to remove the deleted combo
            setCombos(combos.filter(combo => combo.id_combo !== id));
            setTotalItems(prevTotal => prevTotal - 1);

            setActionMessage({ type: 'success', content: 'Xóa combo thành công' });
            message.success('Xóa combo thành công');
        } catch (err) {
            setActionMessage({ type: 'error', content: 'Xóa combo thất bại. Vui lòng thử lại sau.' });
            message.error('Xóa combo thất bại');
            console.error('Error deleting combo:', err);
        } finally {
            setActionLoading(false);
            setDeleteModal(false);
            setSelectedCombo(null);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim() === '') {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        // Filter combos by name (case insensitive)
        const results = combos.filter(combo =>
            combo.name.toLowerCase().includes(value.toLowerCase())
        );

        setSearchResults(results);
    };

    // Handle pagination
    const handlePrevPage = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            fetchCombos(newPage);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            const newPage = page + 1;
            setPage(newPage);
            fetchCombos(newPage);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchCombos();
    }, []);

    // Clear action message after 3 seconds
    useEffect(() => {
        if (actionMessage) {
            const timer = setTimeout(() => {
                setActionMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [actionMessage]);

    // Get combos to display based on search state
    const displayedCombos = isSearching ? searchResults : combos;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Combo</h1>
                    <Link to="/admin/combos/create" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors">
                        <PlusCircle size={18} />
                        <span>Thêm combo mới</span>
                    </Link>
                </div>

                {/* Search bar */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Tìm kiếm combo theo tên..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    {searchQuery && (
                        <button
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => {
                                setSearchQuery('');
                                setIsSearching(false);
                                setSearchResults([]);
                            }}
                        >
                            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Action message */}
                {actionMessage && (
                    <div
                        className={`mb-4 p-3 rounded-lg ${
                            actionMessage.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {actionMessage.content}
                    </div>
                )}

                {/* Loading state */}
                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <MoonLoader size={40} color="#FF5C8D" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
                        <p>{error}</p>
                        <button
                            onClick={() => fetchCombos()}
                            className="mt-2 text-white bg-primary-dark px-4 py-2 rounded hover:bg-primary transition"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Table header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-100 rounded-t-lg font-medium text-gray-700">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-2">Hình ảnh</div>
                            <div className="col-span-3">Tên combo</div>
                            <div className="col-span-2">Giá</div>
                            <div className="col-span-2">Trạng thái</div>
                            <div className="col-span-2 text-right">Thao tác</div>
                        </div>

                        {/* No data state */}
                        {displayedCombos.length === 0 && (
                            <div className="text-center p-10 text-gray-500">
                                {isSearching
                                    ? "Không tìm thấy combo nào phù hợp"
                                    : "Chưa có combo nào trong hệ thống"}
                            </div>
                        )}

                        {/* Combo list */}
                        <div className="divide-y divide-gray-200">
                            {displayedCombos.map((combo) => (
                                <div key={combo.id_combo} className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-4 p-4 hover:bg-gray-50 items-center">
                                    {/* Mobile view shows fields in a column */}
                                    <div className="block md:hidden space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium">ID:</span>
                                            <span>#{combo.id_combo}</span>
                                        </div>

                                        <div className="flex justify-center">
                                            <img
                                                src={combo.images?.[0] || "https://placehold.co/200x200/png?text=No+Image"}
                                                alt={combo.name}
                                                className="h-20 w-20 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/200x200/png?text=Error";
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <span className="font-medium">Tên:</span>
                                            <div className="text-gray-800 font-medium">{combo.name}</div>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-medium">Giá:</span>
                                            <span className="text-primary-dark font-medium">{formatPrice(combo.price)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-medium">Trạng thái:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                combo.status === 'available'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {combo.status === 'available' ? 'Còn hàng' : 'Hết hàng'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between space-x-2 mt-2">
                                            <Link
                                                to={`/admin/combos/edit/${combo.id_combo}`}
                                                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded flex items-center justify-center gap-1"
                                            >
                                                <Edit size={16} />
                                                <span>Sửa</span>
                                            </Link>

                                            <Link
                                                to={`/combo/${combo.id_combo}`}
                                                className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded flex items-center justify-center gap-1"
                                                target="_blank"
                                            >
                                                <Eye size={16} />
                                                <span>Xem</span>
                                            </Link>

                                            <button
                                                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded flex items-center justify-center gap-1"
                                                onClick={() => {
                                                    setSelectedCombo(combo);
                                                    setDeleteModal(true);
                                                }}
                                            >
                                                <Trash2 size={16} />
                                                <span>Xóa</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Desktop view shows as table row */}
                                    <div className="hidden md:block col-span-1">#{combo.id_combo}</div>

                                    <div className="hidden md:flex col-span-2 items-center">
                                        <img
                                            src={combo.images?.[0] || "https://placehold.co/200x200/png?text=No+Image"}
                                            alt={combo.name}
                                            className="h-16 w-16 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = "https://placehold.co/200x200/png?text=Error";
                                            }}
                                        />
                                    </div>

                                    <div className="hidden md:block col-span-3 font-medium">{combo.name}</div>

                                    <div className="hidden md:block col-span-2 text-primary-dark font-medium">
                                        {formatPrice(combo.price)}
                                    </div>

                                    <div className="hidden md:block col-span-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            combo.status === 'available'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {combo.status === 'available' ? 'Còn hàng' : 'Hết hàng'}
                                        </span>
                                    </div>

                                    <div className="hidden md:flex col-span-2 justify-end gap-2">
                                        <Link
                                            to={`/admin/combos/edit/${combo.id_combo}`}
                                            className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit size={18} />
                                        </Link>

                                        <Link
                                            to={`/combo/${combo.id_combo}`}
                                            className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                            title="Xem"
                                            target="_blank"
                                        >
                                            <Eye size={18} />
                                        </Link>

                                        <button
                                            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                            title="Xóa"
                                            onClick={() => {
                                                setSelectedCombo(combo);
                                                setDeleteModal(true);
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {!isSearching && totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 px-4">
                                <div className="text-sm text-gray-600">
                                    Hiển thị {((page - 1) * limit) + 1} - {Math.min(page * limit, totalItems)} trên {totalItems} kết quả
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={page === 1}
                                        className={`p-2 rounded-full ${
                                            page === 1
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <span className="text-gray-700">Trang {page} / {totalPages}</span>

                                    <button
                                        onClick={handleNextPage}
                                        disabled={page === totalPages}
                                        className={`p-2 rounded-full ${
                                            page === totalPages
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xóa"
                open={deleteModal}
                onCancel={() => setDeleteModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setDeleteModal(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        loading={actionLoading}
                        onClick={() => handleDeleteCombo(selectedCombo?.id_combo)}
                    >
                        Xóa
                    </Button>
                ]}
            >
                <p>Bạn có chắc chắn muốn xóa combo `{selectedCombo?.name}`?</p>
                <p className="text-red-500 mt-2">Hành động này không thể hoàn tác.</p>
            </Modal>
        </div>
    );
};

export default Combo;