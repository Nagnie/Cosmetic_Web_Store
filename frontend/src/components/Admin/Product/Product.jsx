import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search, X, Save, Eye } from 'lucide-react';
import { Circles } from "react-loader-spinner";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
    const [viewOpen, setViewOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        pro_name: '',
        cat_name: '',
        scat_name: '',
        bra_name: '',
        price: '',
        images: '',
        description: '',
        classification: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch data from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/product?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Something went wrong while fetching the data.');
            }
            // console.log(response);
            const result = await response.json();
            // console.log(result);
            if (response.status === 200) {
                setProducts(result.data);
                // If your API returns pagination info differently, adjust this
                setTotalPages(result.total_pages);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    // Categories for dropdown
    const categories = ["Skincare", "Makeup", "Haircare", "Bath & Body", "Fragrance"];

    // Brands for dropdown
    const brands = ["Neutrogena", "Dove", "Maybelline", "Chanel", "Gucci", "Versace", "Clinique", "Estée Lauder"];

    // Show action message
    const showActionMessage = (text, type) => {
        setActionMessage({ text, type });
        // Clear message after 3 seconds
        setTimeout(() => {
            setActionMessage({ text: '', type: '' });
        }, 3000);
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.pro_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: name === 'price' ? parseFloat(value) || '' : value
        });
    };

    // Add new product
    const addProduct = async (productData) => {
        try {
            setActionLoading(true);
            const response = await fetch(`http://localhost:3001/api/product/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            showActionMessage(result.message || 'Product added successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(err.message || 'Failed to add product', 'error');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Update product
    const updateProduct = async (id, productData) => {
        try {
            setActionLoading(true);
            const response = await fetch(`http://localhost:3001/api/product/update/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            showActionMessage(result.message || 'Product updated successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(err.message || 'Failed to update product', 'error');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Delete product
    const deleteProduct = async (id) => {
        try {
            setActionLoading(true);
            const response = await fetch(`http://localhost:3001/api/product/delete/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            showActionMessage(result.message || 'Product deleted successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(err.message || 'Failed to delete product', 'error');
            return false;
        } finally {
            setActionLoading(false);
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            pro_name: newProduct.pro_name,
            cat_name: newProduct.cat_name,
            scat_name: newProduct.scat_name,
            price: newProduct.price,
            bra_name: newProduct.bra_name,
            images: typeof newProduct.images === 'string' ?
                newProduct.images.split(',').map(img => img.trim()) :
                newProduct.images,
            description: newProduct.description,
            classification: typeof newProduct.classification === 'string' ?
                newProduct.classification.split(',').map(cls => cls.trim()) :
                newProduct.classification,
        };

        let success = false;

        if (isEditing && currentProduct) {
            // Update existing product
            success = await updateProduct(currentProduct.id_pro, productData);
        } else {
            // Add new product
            success = await addProduct(productData);
        }

        if (success) {
            // Fetch products again to reflect changes
            fetchProducts();
            // Reset form
            resetForm();
        }
    };

    // Edit Product
    const handleEdit = (product) => {
        setCurrentProduct(product);
        setNewProduct({
            pro_name: product.pro_name,
            cat_name: product.cat_name,
            scat_name: product.scat_name,
            bra_name: product.bra_name,
            price: product.price,
            images: Array.isArray(product.images) ? product.images.join(', ') : product.images,
            description: product.description || '',
            classification: Array.isArray(product.classification) ?
                product.classification.join(', ') : product.classification || '',
        });
        setIsEditing(true);
        setFormOpen(true);
    }

    // Delete product
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const success = await deleteProduct(id);
            if (success) {
                fetchProducts();
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setNewProduct({
            pro_name: '',
            cat_name: '',
            scat_name: '',
            bra_name: '',
            price: '',
            images: '',
            description: '',
            classification: '',
        });
        setCurrentProduct(null);
        setIsEditing(false);
        setFormOpen(false);
        setViewOpen(false);
    };

    // View product details
    const handleView = (product) => {
        setCurrentProduct(product);
        setViewOpen(true);
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
            {/* Main Content */}
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
                            placeholder="Search products..."
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
                        Add Product
                    </button>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="flex justify-center items-center h-80">
                        <Circles
                            height="70"
                            width="70"
                            color="#c42e57"
                            ariaLabel="circles-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Products Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg shadow overflow-x-auto text-left">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead style={{ backgroundColor: '#D14D72' }}>
                            <tr>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Subcategory</th>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Brand</th>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <tr key={product.id_pro} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="font-medium text-gray-900">{product.pro_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                                                {product.cat_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {product.scat_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                                                {product.bra_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${Number(product.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleView(product)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id_pro)}
                                                    className="text-red-600 hover:text-red-900"
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
                                        No products found. Try a different search term or add a new product.
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

            {/* Add/Edit Product Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-left">
                                    <div>
                                        <label className="block font-medium text-gray-700 mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            name="pro_name"
                                            value={newProduct.pro_name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium text-gray-700 mb-1">Price ($)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={newProduct.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            name="cat_name"
                                            value={newProduct.cat_name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-medium text-gray-700 mb-1">Brand</label>
                                        <select
                                            name="bra_name"
                                            value={newProduct.bra_name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                        >
                                            <option value="">Select a brand</option>
                                            {brands.map(brand => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-medium text-gray-700 mb-1">Subcategory</label>
                                        <input
                                            type="text"
                                            name="scat_name"
                                            value={newProduct.scat_name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium text-gray-700 mb-1">Classification</label>
                                        <input
                                            type="text"
                                            name="classification"
                                            value={newProduct.classification}
                                            onChange={handleInputChange}
                                            placeholder="Separate with commas"
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4 text-left">
                                    <label className="block font-medium text-gray-700 mb-1">Images</label>
                                    <textarea
                                        name="images"
                                        value={newProduct.images}
                                        onChange={handleInputChange}
                                        placeholder="Enter image URLs separated by commas"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Separate multiple image URLs with commas</p>
                                </div>

                                <div className="mb-4 text-left">
                                    <label className="block font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={newProduct.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 border rounded hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white rounded hover:opacity-90 flex items-center"
                                        style={{ background: '#D14D72' }}
                                        disabled={actionLoading}
                                    >
                                        <Save className="mr-2" size={16} />
                                        {isEditing ? 'Update Product' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Product Details Modal */}
            {viewOpen && currentProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
                                <button onClick={() => setViewOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex justify-center">
                                    {currentProduct.images && currentProduct.images.length > 0 ? (
                                        <img
                                            src={Array.isArray(currentProduct.images) ? currentProduct.images[0] : currentProduct.images}
                                            alt={currentProduct.pro_name}
                                            className="rounded-lg object-cover h-64 w-64"
                                        />
                                    ) : (
                                        <div className="rounded-lg bg-gray-200 h-64 w-64 flex items-center justify-center text-gray-500">
                                            No image available
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{currentProduct.pro_name}</h3>
                                    <p className="inline-block px-2 py-1 mb-2 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                                        {currentProduct.cat_name}
                                    </p>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="font-medium">${Number(currentProduct.price).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-gray-600">Subcategory:</span>
                                            <span className="font-medium">{currentProduct.scat_name}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-gray-600">Brand:</span>
                                            <span className="font-medium">{currentProduct.bra_name}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-gray-600">Product ID:</span>
                                            <span className="font-medium">#{currentProduct.id_pro}</span>
                                        </div>
                                    </div>

                                    {currentProduct.description && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
                                            <p className="text-gray-600 text-sm">
                                                {currentProduct.description}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6 flex justify-end space-x-2">
                                        <button
                                            onClick={() => {setViewOpen(false); handleEdit(currentProduct);}}
                                            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 flex items-center"
                                        >
                                            <Edit className="mr-2" size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setViewOpen(false)}
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;