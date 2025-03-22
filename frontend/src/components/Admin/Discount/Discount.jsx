import React, { useState, useEffect } from 'react';
import {ChevronLeft, ChevronRight, Edit, PlusCircle, Save, Search, Trash2, X} from "lucide-react";
import { RingLoader } from 'react-spinners';
import discountsApi from "@apis/discountsApi.js";

const Discount = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 8;

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [currentDiscount, setCurrentDiscount] = useState(null);
    const [newDiscount, setNewDiscount] = useState({
        code: '',
        value: '',
        isAvailable: true,
        unit: 'fixed',
        start_at: '',
        end_at: '',
        max_value: '',
        minimum_order_value: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch data from API
    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const response = await discountsApi.getDiscounts({ page, limit });

            if (response.data.statusCode === 200) {
                setDiscounts(response.data.data.data);
                setTotalPages(response.data.data.total_pages);
            } else {
                throw new Error(response.data.message || 'Failed to fetch discounts');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching discounts:', err);
        } finally {
            setLoading(false);
        }
    };

    // Show action message
    const showActionMessage = (text, type) => {
        setActionMessage({ text, type });
        // Clear message after 3 seconds
        setTimeout(() => {
            setActionMessage({ text: '', type: '' });
        }, 3000);
    };

    // Load data on component mount and when page changes
    useEffect(() => {
        fetchDiscounts();
    }, [page]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewDiscount({
            ...newDiscount,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        });
        console.log("newDiscount", newDiscount);
    };

    // Format date for display
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN');
        } catch (error) {
            return dateString;
        }
    };

    // Format date for input
    const formatDateForInput = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            return '';
        }
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Filter Discounts based on search term
    const filteredDiscounts = discounts.filter(discount =>
        discount.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add new discount
    const addDiscount = async (discountData) => {
        try {
            setActionLoading(true);
            const response = await discountsApi.createDiscount(discountData);

            if (response.data.statusCode !== 200 && response.data.statusCode !== 201) {
                throw new Error(response.data.message || 'Failed to add discount');
            }

            showActionMessage('Discount added successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error adding discount:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Update discount
    const updateDiscount = async (id, discountData) => {
        try {
            setActionLoading(true);

            // Remove unit field for update as per requirements
            const { unit, ...updateData } = discountData;

            const response = await discountsApi.updateDiscount(id, updateData);

            if (response.data.statusCode !== 200) {
                throw new Error(response.data.message || 'Failed to update discount');
            }

            showActionMessage('Discount updated successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error updating discount:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Delete discount
    const deleteDiscount = async (id) => {
        try {
            setActionLoading(true);
            const response = await discountsApi.deleteDiscount(id);

            if (response.data.statusCode !== 200) {
                throw new Error(response.data.message || 'Failed to delete discount');
            }

            showActionMessage('Discount deleted successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error deleting discount:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        let success = false;

        if (isEditing && currentDiscount) {
            // Update existing discount
            success = await updateDiscount(currentDiscount.id, newDiscount);
        } else {
            // Add new discount
            success = await addDiscount(newDiscount);
        }

        if (success) {
            // Refresh the discount list
            fetchDiscounts();
            // Reset form
            resetForm();
        }
    };

    // Edit Discount
    const handleEdit = async (discount) => {
        setCurrentDiscount(discount);
        setNewDiscount({
            code: discount.code,
            value: discount.value,
            isAvailable: discount.isAvailable,
            unit: discount.unit,
            start_at: formatDateForInput(discount.start_at),
            end_at: formatDateForInput(discount.end_at),
            max_value: discount.max_value,
            minimum_order_value: discount.minimum_order_value
        });
        setIsEditing(true);
        setFormOpen(true);
    };

    // Delete Discount
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this discount?')) {
            const success = await deleteDiscount(id);
            if (success) {
                fetchDiscounts();
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setNewDiscount({
            code: '',
            value: '',
            isAvailable: true,
            unit: 'fixed',
            start_at: '',
            end_at: '',
            max_value: '',
            minimum_order_value: ''
        });
        setCurrentDiscount(null);
        setIsEditing(false);
        setFormOpen(false);
    };

    // Handle pagination
    const handlePrevPage = () => {
        setPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setPage(prev => Math.min(totalPages, prev + 1));
    };

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
                            placeholder="Search discounts..."
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
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => {setFormOpen(true); setIsEditing(false);}}
                        className="flex items-center bg-white text-pink-600 px-4 py-2 rounded-md shadow hover:bg-gray-100"
                        disabled={actionLoading}
                    >
                        <PlusCircle className="mr-2" size={18} />
                        Add Discount
                    </button>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="flex justify-center items-center h-70">
                        <RingLoader color="#ffa6ae" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Discounts Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow overflow-x-auto text-left">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead style={{ backgroundColor: '#D14D72' }}>
                            <tr>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">ID</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Code</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Value</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Type</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Status</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Start Date</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">End Date</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDiscounts.length > 0 ? (
                                filteredDiscounts.map(discount => (
                                    <tr key={discount.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="font-medium text-gray-900">{discount.id}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="font-medium text-gray-900">{discount.code}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {discount.unit === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {discount.unit === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${discount.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {discount.isAvailable ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(discount.start_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(discount.end_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(discount)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    disabled={actionLoading}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(discount.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={actionLoading}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                        No discounts found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex justify-center items-center my-10 space-x-2">
                        {/* First Page */}
                        <button
                            onClick={() => handlePrevPage()}
                            disabled={page === 1 || actionLoading}
                            className={`p-2 me-5 rounded ${page === 1 || actionLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-pink-700 text-white hover:bg-pink-800'}`}
                        >
                            <ChevronLeft />
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                            .map((p, index, arr) => (
                                <React.Fragment key={p}>
                                    {index > 0 && p !== arr[index - 1] + 1 && <span>...</span>}
                                    <button
                                        onClick={() => setPage(p)}
                                        className={`px-3 py-2 rounded ${p === page ? 'bg-pink-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                    >
                                        {p}
                                    </button>
                                </React.Fragment>
                            ))
                        }

                        {/* Last Page */}
                        <button
                            onClick={() => handleNextPage()}
                            disabled={page === totalPages || actionLoading}
                            className={`p-2 ms-5 rounded ${page === totalPages || actionLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-pink-700 text-white hover:bg-pink-800'}`}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </main>

            {/* Add/Edit Discount Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto px-2">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Discount' : 'Add New Discount'}</h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600" disabled={actionLoading}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-5 text-left">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-2">Discount Code</label>
                                            <input
                                                type="text"
                                                name="code"
                                                value={newDiscount.code}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                required
                                                disabled={actionLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-2">Value</label>
                                            <input
                                                type="number"
                                                name="value"
                                                value={newDiscount.value}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                required
                                                disabled={actionLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-2">Unit Type</label>
                                            <select
                                                name="unit"
                                                value={newDiscount.unit}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                disabled={isEditing || actionLoading}
                                            >
                                                <option value="fixed">Fixed Amount</option>
                                                <option value="percentage">Percentage</option>
                                            </select>
                                            {isEditing && (
                                                <p className="text-xs text-gray-500 mt-1">Unit type cannot be changed when updating</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-2">Status</label>
                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    name="isAvailable"
                                                    checked={newDiscount.isAvailable}
                                                    onChange={handleInputChange}
                                                    className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                                    disabled={actionLoading}
                                                />
                                                <label className="ml-2 block text-sm text-gray-900">
                                                    Active
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                name="start_at"
                                                value={newDiscount.start_at}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                required
                                                disabled={actionLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-2">End Date</label>
                                            <input
                                                type="date"
                                                name="end_at"
                                                value={newDiscount.end_at}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                required
                                                disabled={actionLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-2">Maximum Discount Value</label>
                                            <input
                                                type="number"
                                                name="max_value"
                                                value={newDiscount.max_value}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                required
                                                disabled={actionLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-2">Minimum Order Value</label>
                                            <input
                                                type="number"
                                                name="minimum_order_value"
                                                value={newDiscount.minimum_order_value}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                required
                                                disabled={actionLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 border rounded hover:bg-gray-100"
                                        disabled={actionLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white rounded hover:opacity-90 flex items-center"
                                        style={{ background: '#D14D72' }}
                                        disabled={actionLoading}
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
                                                {isEditing ? 'Update Discount' : 'Add Discount'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Discount;