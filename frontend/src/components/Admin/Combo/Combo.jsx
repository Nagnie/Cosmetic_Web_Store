import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {ChevronLeft, ChevronRight, Edit, PlusCircle, Search, Trash2, X} from "lucide-react";
import { MoonLoader } from 'react-spinners';
import comboApi from "@apis/comboApi.js";

const Combo = () => {
    const navigate = useNavigate();
    const [combo, setCombo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch data from API
    const fetchCombo = async () => {
        try {
            setLoading(true);
            const response = await comboApi.getCombos({ page, limit });

            if (response.status === 200) {
                setCombo(response.data.data);
                setTotalPages(response.data.total_pages);
            } else {
                throw new Error(response.data.message || 'Failed to fetch combo');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching combo:', err);
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
        fetchCombo();
    }, [page]);

    // Filter Combo based on search term
    const filteredCombo = combo.filter(Combo =>
        Combo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Delete combo
    const deleteCombo = async (id) => {
        try {
            setActionLoading(true);
            const response = await comboApi.deleteCombo(id);
            console.log(response);

            if (response.data.statusCode !== 200) {
                throw new Error(response.data.message || 'Failed to delete Combo');
            }

            showActionMessage('Combo deleted successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error deleting combo:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Delete Combo
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this combo?')) {
            const success = await deleteCombo(id);
            if (success) {
                fetchCombo();
            }
        }
    };

    // Navigate to edit page
    const handleEdit = (combo) => {
        navigate(`/admin/combo/edit/${combo.id_combo}`);
    };

    // Handle pagination
    const handlePrevPage = () => {
        setPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setPage(prev => Math.min(totalPages, prev + 1));
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'available':
                return 'bg-yellow-100 text-yellow-800';
            case 'order':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-red-100 text-red-800';
        }
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
                            placeholder="Search combo..."
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
                        onClick={() => navigate('combo/create')}
                        className="flex items-center bg-white text-pink-600 px-4 py-2 rounded-md shadow hover:bg-gray-100"
                        disabled={actionLoading}
                    >
                        <PlusCircle className="mr-2" size={18} />
                        Add Combo
                    </button>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="flex justify-center items-center h-70">
                        <MoonLoader color="#ffa6ae" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Combo Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow overflow-x-auto text-left">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead style={{ backgroundColor: '#D14D72' }}>
                            <tr>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">ID</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Name</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Price</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Origin price</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Status</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider"></th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCombo.length > 0 ? (
                                filteredCombo.map(combo => (
                                    <tr key={combo.id_combo} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="font-medium text-gray-900">{combo.id_combo}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Link
                                                    to={`combo/info/${combo.id_combo}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {combo.name}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <div className="font-medium text-gray-900">{Number(combo.price).toLocaleString()} VNĐ</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <div className="font-medium text-gray-900">{Number(combo.origin_price).toLocaleString()} VNĐ</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`px-3 py-1 inline-flex leading-5 font-semibold rounded-full ${getStatusClass(combo.status)}`}>
                                                {combo.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(combo)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    disabled={actionLoading}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(combo.id_combo)}
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
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No Combo found.
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
        </div>
    );
};

export default Combo;