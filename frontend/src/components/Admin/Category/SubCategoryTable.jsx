import React, { useState, useEffect } from 'react';
import { Edit, PlusCircle, Save, Search, Trash2, X } from "lucide-react";
import { MutatingDots } from 'react-loader-spinner';

const SubCategoryTable = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [currentSubcategory, setCurrentSubcategory] = useState(null);
    const [newSubcategory, setNewSubcategory] = useState({
        scat_name: '',
        cat_name: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch subcategories from API
    const fetchSubcategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/subcategory?page=${page}&limit=${limit}`);

            if (!response.ok) {
                throw new Error('Failed to fetch subcategories');
            }

            const result = await response.json();

            if (Array.isArray(result)) {
                setSubcategories(result);
                // Calculate total pages based on the result length and limit
                // This is a placeholder - you might need to adjust based on your API response
                setTotalPages(Math.ceil(result.length / limit) || 1);
            } else {
                throw new Error(result.message || 'Failed to fetch subcategories');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching Subcategories:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories for dropdown
    const fetchCategories = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/category`);

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const result = await response.json();

            if (Array.isArray(result)) {
                setCategories(result);
            } else {
                throw new Error(result.message || 'Failed to fetch categories');
            }
        } catch (err) {
            console.error('Error fetching Categories:', err);
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
        fetchSubcategories();
        fetchCategories(); // Fetch categories for the dropdown
    }, [page]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubcategory({
            ...newSubcategory,
            [name]: value,
        });
    };

    // Filter Subcategories based on search term
    const filteredSubcategories = subcategories.filter(subcategory =>
        subcategory.scat_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subcategory.cat_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Check if subcategory already exists
    const subcategoryExists = (scatName, catName) => {
        return subcategories.some(
            scat => scat.scat_name.toLowerCase() === scatName.toLowerCase() &&
                scat.cat_name.toLowerCase() === catName.toLowerCase() &&
                (!isEditing || (isEditing && (scat.scat_name !== currentSubcategory.scat_name ||
                    scat.cat_name !== currentSubcategory.cat_name)))
        );
    };

    // Add new subcategory
    const addSubcategory = async (subcategoryData) => {
        try {
            // Check if subcategory exists before making API call
            if (subcategoryExists(subcategoryData.scat_name, subcategoryData.cat_name)) {
                showActionMessage(`Subcategory "${subcategoryData.scat_name}" already exists in "${subcategoryData.cat_name}" category`, 'error');
                return false;
            }

            setActionLoading(true);
            const response = await fetch('http://localhost:3001/api/subcategory/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subcategoryData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to add subcategory');
            }

            showActionMessage('Subcategory added successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error adding subcategory:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Update subcategory
    const updateSubcategory = async (oldScatName, oldCatName, subcategoryData) => {
        try {
            // Check if updated name already exists
            if (subcategoryExists(subcategoryData.scat_name, subcategoryData.cat_name)) {
                showActionMessage(`Subcategory "${subcategoryData.scat_name}" already exists in "${subcategoryData.cat_name}" category`, 'error');
                return false;
            }

            setActionLoading(true);
            const response = await fetch(`http://localhost:3001/api/subcategory/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_scat_name: oldScatName,
                    old_cat_name: oldCatName,
                    new_scat_name: subcategoryData.scat_name,
                    new_cat_name: subcategoryData.cat_name
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update subcategory');
            }

            showActionMessage('Subcategory updated successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error updating subcategory:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Delete subcategory
    const deleteSubcategory = async (scatName, catName) => {
        try {
            setActionLoading(true);
            const response = await fetch(`http://localhost:3001/api/subcategory/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scat_name: scatName,
                    cat_name: catName
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete subcategory');
            }

            showActionMessage('Subcategory deleted successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(`Error: ${err.message}`, 'error');
            console.error('Error deleting subcategory:', err);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        let success = false;

        if (isEditing && currentSubcategory) {
            // Update existing Subcategory
            success = await updateSubcategory(
                currentSubcategory.scat_name,
                currentSubcategory.cat_name,
                newSubcategory
            );
        } else {
            // Add new subcategory
            success = await addSubcategory(newSubcategory);
        }

        if (success) {
            // Refresh the subcategory list
            fetchSubcategories();
            // Reset form
            resetForm();
        }
    };

    // Edit Subcategory
    const handleEdit = (subcategory) => {
        setCurrentSubcategory(subcategory);
        setNewSubcategory({
            scat_name: subcategory.scat_name,
            cat_name: subcategory.cat_name
        });
        setIsEditing(true);
        setFormOpen(true);
    };

    // Delete Subcategory
    const handleDelete = async (scatName, catName) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            const success = await deleteSubcategory(scatName, catName);
            if (success) {
                fetchSubcategories();
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setNewSubcategory({
            scat_name: '',
            cat_name: categories.length > 0 ? categories[0].cat_name : ''
        });
        setCurrentSubcategory(null);
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
            <main>
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
                            placeholder="Search subcategories..."
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
                        Add Subcategory
                    </button>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="flex justify-center items-center h-80">
                        <MutatingDots
                            visible={true}
                            height="80"
                            width="80"
                            color="#c42e57"
                            secondaryColor="#D14D72"
                            radius="12.5"
                            ariaLabel="mutating-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Subcategories Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow overflow-x-auto text-left">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead style={{ backgroundColor: '#D14D72' }}>
                            <tr>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Subcategory Name</th>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Product Count</th>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubcategories.length > 0 ? (
                                filteredSubcategories.map((subcategory, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="font-medium text-gray-900">{subcategory.scat_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{subcategory.cat_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {subcategory.num_pro}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(subcategory)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    disabled={actionLoading}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(subcategory.scat_name, subcategory.cat_name)}
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
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No subcategories found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1 || actionLoading}
                            className={`px-4 py-2 rounded ${page === 1 || actionLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-pink-700 text-white hover:bg-pink-800'}`}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages || actionLoading}
                            className={`px-4 py-2 rounded ${page === totalPages || actionLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-pink-700 text-white hover:bg-pink-800'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            {/* Add/Edit Subcategory Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto px-2">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Subcategory' : 'Add New Subcategory'}</h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600" disabled={actionLoading}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-5 text-left">
                                    <div className="mb-4">
                                        <label className="block font-medium text-gray-700 mb-3">Subcategory Name</label>
                                        <input
                                            type="text"
                                            name="scat_name"
                                            value={newSubcategory.scat_name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                            disabled={actionLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium text-gray-700 mb-3">Category</label>
                                        <select
                                            name="cat_name"
                                            value={newSubcategory.cat_name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                            disabled={actionLoading}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category, index) => (
                                                <option key={index} value={category.cat_name}>
                                                    {category.cat_name}
                                                </option>
                                            ))}
                                        </select>
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
                                                {isEditing ? 'Update Subcategory' : 'Add Subcategory'}
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

export default SubCategoryTable;