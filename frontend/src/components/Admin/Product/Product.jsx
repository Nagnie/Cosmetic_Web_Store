import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Circles } from "react-loader-spinner";
import productsApi from "@apis/productsApi.js";
import brandsApi from "@apis/brandsApi.js";
import subcategoriesApi from "@apis/subcategoriesApi.js";
import ProductDetail from "./ProductDetail";
import ProductModal from "./ProductModal.jsx"

const Product = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
    const [viewOpen, setViewOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    // Thêm state để lưu ID của sản phẩm đang xem
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsApi.getProductAdmin({page, limit});

            // console.log("Response", response);

            if (response.status === 200) {
                setProducts(response.data.data);
                // If your API returns pagination info differently, adjust this
                setTotalPages(response.data.total_pages);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch subcategories
    const fetchSubcategories = async () => {
        try {
            const response = await subcategoriesApi.getSubcategories();

            console.log(response);

            if (response.status === 200) {
                setSubcategories(response.data.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error("Error fetching subcategories:", err);
        }
    };

    // Fetch brands
    const fetchBrands = async () => {
        try {
            const response = await brandsApi.getBrands();
            if (response.status === 200) {
                setBrands(response.data.data.data);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            console.error("Error fetching brands:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchSubcategories();
        fetchBrands();
    }, [page]);

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

    // Add new product
    const addProduct = async (productData) => {
        try {
            setActionLoading(true);
            const response = await productsApi.createProduct(productData);

            if(response.status === 200) {
                throw new Error(response.data.message);
            }

            showActionMessage(response.message || 'Product added successfully', 'success');
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
            const response = await productsApi.updateProduct(id, productData);

            showActionMessage(response.data.message || 'Product updated successfully', 'success');
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
            const response = await productsApi.deleteProduct(id);

            showActionMessage(response.data.message || 'Product deleted successfully', 'success');
            return true;
        } catch (err) {
            showActionMessage(err.message || 'Failed to delete product', 'error');
            return false;
        } finally {
            setActionLoading(false);
        }
    }

    // Open modal for adding new product
    const handleAdd = () => {
        setCurrentProduct(null);
        setIsEditing(false);
        setModalOpen(true);
    };

    // Open modal for editing product
    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
        setModalOpen(true);
    };

    // Handle form submission from modal
    const handleSubmit = async (formData) => {
        let success = false;

        if (isEditing && currentProduct) {
            success = await updateProduct(currentProduct.id_pro, formData);
        } else {
            success = await addProduct(formData);
        }

        if (success) {
            fetchProducts();
            closeModal();
        }
    };


    // Delete product
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const success = await deleteProduct(id);
            if (success) {
                fetchProducts();
            }
        }
    };

    // View product details
    const handleView = (product) => {
        setSelectedProductId(product.id_pro);
        setViewOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalOpen(false);
        setCurrentProduct(null);
        setIsEditing(false);
    };

    // Close view modal
    const closeViewModal = () => {
        setViewOpen(false);
        setSelectedProductId(null);
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
                        onClick={handleAdd}
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

                {!loading && !error && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-10 space-x-2">
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

            {/* Add/Edit Product Form Modal */}
            <ProductModal
                isOpen={modalOpen}
                onClose={closeModal}
                product={currentProduct}
                isEditing={isEditing}
                onSubmit={handleSubmit}
                subcategories={subcategories}
                brands={brands}
                isLoading={actionLoading}
            />

            {/* View Product Details Modal */}
            {viewOpen && selectedProductId && (
                <ProductDetail
                    isOpen={viewOpen}
                    onClose={closeViewModal}
                    productId={selectedProductId}
                />
            )}
        </div>
    );
};

export default Product;