import React, { useState, useEffect } from 'react';
import {ChevronLeft, ChevronRight, Edit, PlusCircle, Save, Search, Trash2, X} from "lucide-react";
import { MoonLoader } from 'react-spinners';
import brandsApi from "@apis/brandsApi.js";

const Brand = () => {
    const [brands, setBrands] = useState([]);
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
    const [currentBrand, setCurrentBrand] = useState(null);
    const [newBrand, setNewBrand] = useState({
        name: '',
        image: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch data from API
    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await brandsApi.getBrands({ page, limit });

            if (response.data.statusCode === 200) {
                setBrands(response.data.data.data);
                setTotalPages(response.data.data.total_pages);
            } else {
                throw new Error(response.data.message || 'Failed to fetch brands');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching brands:', err);
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
        fetchBrands();
    }, [page]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBrand({
            ...newBrand,
            [name]: value,
        });
    };

    // Filter Brands based on search term
    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add new brand
    const addBrand = async (brandData) => {
        try {
            setActionLoading(true);
            const response = await brandsApi.createBrandD(brandData);

            if (response.data.statusCode !== 200 && response.data.statusCode !== 201) {
                throw new Error(response.data.message || 'Failed to add brand');
            }

            showActionMessage('Brand added successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error adding brand:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Update brand
    const updateBrand = async (id, brandData) => {
        try {
            setActionLoading(true);

            console.log("branddata", brandData);
            const response = await brandsApi.updateBrandDDetail(id, brandData );

            console.log("Response", response);

            if (response.data.statusCode !== 200) {
                throw new Error(response.data.message || 'Failed to update brand');
            }

            showActionMessage('Brand updated successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error updating brand:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Delete brand
    const deleteBrand = async (id) => {
        try {
            setActionLoading(true);
            const response = await brandsApi.deleteBrandD(id);

            if (response.data.statusCode !== 200) {
                throw new Error(response.data.message || 'Failed to delete brand');
            }

            showActionMessage('Brand deleted successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error deleting brand:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Extract only the name field for API request
        const brandData = { name: newBrand.name, image: newBrand.image };
        let success = false;

        if (isEditing && currentBrand) {
            // Update existing Brand
            success = await updateBrand(currentBrand.id, brandData);
        } else {
            // Add new brand
            success = await addBrand(brandData);
        }

        if (success) {
            // Refresh the brand list
            fetchBrands();
            // Reset form
            resetForm();
        }
    };

    // Edit Brand
    const handleEdit = (brand) => {
        setCurrentBrand(brand);
        setNewBrand({
            name: brand.name,
            image: brand.image,
        });
        setIsEditing(true);
        setFormOpen(true);
    };

    // Delete Brand
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            const success = await deleteBrand(id);
            if (success) {
                fetchBrands();
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setNewBrand({
            name: '',
            image: '',
        });
        setCurrentBrand(null);
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
                            placeholder="Search brands..."
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
                        Add Brand
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

                {/* Brands Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow overflow-x-auto text-left">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead style={{ backgroundColor: '#D14D72' }}>
                            <tr>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">ID</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Brand Name</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Product Count</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Image</th>
                                <th className="px-6 py-3 font-medium text-white tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBrands.length > 0 ? (
                                filteredBrands.map(brand => (
                                    <tr key={brand.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="font-medium text-gray-900">{brand.id}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="font-medium text-gray-900">{brand.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {brand.numProducts}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={brand.image} alt={brand.name} className={"h-30 rounded-2xl"} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(brand)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    disabled={actionLoading}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(brand.id)}
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
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        No brands found.
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

            {/* Add/Edit Brand Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto px-2">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Brand' : 'Add New Brand'}</h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600" disabled={actionLoading}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-5 text-left">
                                    <div>
                                        <label className="block font-medium text-gray-700 mb-3">Brand Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newBrand.name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                            disabled={actionLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium text-gray-700 my-3">Image Link</label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={newBrand.image}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                            disabled={actionLoading}
                                        />
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
                                                {isEditing ? 'Update Brand' : 'Add Brand'}
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

export default Brand;