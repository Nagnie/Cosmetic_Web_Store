import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search, X, Save, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Circles } from "react-loader-spinner";
import productsApi from "@apis/productsApi.js";
import brandsApi from "@apis/brandsApi.js";
import subcategoriesApi from "@apis/subcategoriesApi.js";
import ProductDetail from "./ProductDetail";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
    const [viewOpen, setViewOpen] = useState(false);

    // Thêm state để lưu ID của sản phẩm đang xem
    const [selectedProductId, setSelectedProductId] = useState(null);

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
        id_subcat: '',
        id_bra: '',
        price: '',
        img_url: '', // Đổi tên từ images thành img_url
        description: '',
        classification: '',
        status: 'Available'
    });
    const [isEditing, setIsEditing] = useState(false);

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
                setBrands(response.data.data);
            } else {
                throw new Error(response.message);
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            pro_name: newProduct.pro_name,
            id_subcat: parseInt(newProduct.id_subcat),
            id_bra: parseInt(newProduct.id_bra),
            price: parseFloat(newProduct.price),
            status: newProduct.status || 'Available',
            img_url: typeof newProduct.img_url === 'string' ?
                newProduct.img_url.split(',').map(img => img.trim()) :
                newProduct.img_url,
            description: newProduct.description,
            classification: typeof newProduct.classification === 'string' ?
                newProduct.classification.split(',').map(cls => cls.trim()) :
                newProduct.classification,
        };

        let success = false;

        if (isEditing && currentProduct) {
            success = await updateProduct(currentProduct.id_pro, productData);
        } else {
            success = await addProduct(productData);
        }

        if (success) {
            fetchProducts();
            resetForm();
        }
    };

    // Edit Product
    const handleEdit = (product) => {
        // Lấy id_subcat và id_bra từ product
        const subcategory = subcategories.find(subcat => subcat.scat_name === product.scat_name);
        const brand = brands.find(brand => brand.bra_name === product.bra_name);

        setCurrentProduct(product);
        setNewProduct({
            pro_name: product.pro_name,
            id_subcat: subcategory ? subcategory.id_subcat : '',
            id_bra: brand ? brand.id_bra : '',
            price: product.price,
            img_url: Array.isArray(product.images) ? product.images.join(', ') : product.images,
            description: product.description || '',
            classification: Array.isArray(product.classification) ?
                product.classification.join(', ') : product.classification || '',
            status: product.status || 'Available'
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
            id_subcat: '',
            id_bra: '',
            price: '',
            img_url: '',
            description: '',
            classification: '',
            status: 'Available'
        });
        setCurrentProduct(null);
        setIsEditing(false);
        setFormOpen(false);
        setViewOpen(false);
    };

    // View product details
    const handleView = (product) => {
        setViewOpen(true);
        setSelectedProductId(product.id_pro);
    };


    // Thêm hàm handleCloseView
    const handleCloseView = () => {
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
            {/*{formOpen && (*/}
            {/*    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">*/}
            {/*        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">*/}
            {/*            <div className="p-6">*/}
            {/*                <div className="flex justify-between items-center mb-4">*/}
            {/*                    <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>*/}
            {/*                    <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">*/}
            {/*                        <X size={24} />*/}
            {/*                    </button>*/}
            {/*                </div>*/}

            {/*                <form onSubmit={handleSubmit}>*/}
            {/*                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-left">*/}
            {/*                        <div>*/}
            {/*                            <label className="block font-medium text-gray-700 mb-1">Product Name</label>*/}
            {/*                            <input*/}
            {/*                                type="text"*/}
            {/*                                name="pro_name"*/}
            {/*                                value={newProduct.pro_name}*/}
            {/*                                onChange={handleInputChange}*/}
            {/*                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"*/}
            {/*                                required*/}
            {/*                            />*/}
            {/*                        </div>*/}

            {/*                        <div>*/}
            {/*                            <label className="block font-medium text-gray-700 mb-1">Price ($)</label>*/}
            {/*                            <input*/}
            {/*                                type="number"*/}
            {/*                                name="price"*/}
            {/*                                value={newProduct.price}*/}
            {/*                                onChange={handleInputChange}*/}
            {/*                                min="0"*/}
            {/*                                step="0.01"*/}
            {/*                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"*/}
            {/*                                required*/}
            {/*                            />*/}
            {/*                        </div>*/}

            {/*                        <div>*/}
            {/*                            <label className="block font-medium text-gray-700 mb-1">Subcategory</label>*/}
            {/*                            <select*/}
            {/*                                name="id_subcat"*/}
            {/*                                value={newProduct.id_subcat}*/}
            {/*                                onChange={handleInputChange}*/}
            {/*                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"*/}
            {/*                                required*/}
            {/*                            >*/}
            {/*                                <option value="">Select a subcategory</option>*/}
            {/*                                {subcategories.map(subcat => (*/}
            {/*                                    <option key={subcat.id_subcat} value={subcat.id_subcat}>*/}
            {/*                                        {subcat.scat_name} ({subcat.cat_name})*/}
            {/*                                    </option>*/}
            {/*                                ))}*/}
            {/*                            </select>*/}
            {/*                        </div>*/}

            {/*                        <div>*/}
            {/*                            <label className="block font-medium text-gray-700 mb-1">Brand</label>*/}
            {/*                            <select*/}
            {/*                                name="id_bra"*/}
            {/*                                value={newProduct.id_bra}*/}
            {/*                                onChange={handleInputChange}*/}
            {/*                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"*/}
            {/*                                required*/}
            {/*                            >*/}
            {/*                                <option value="">Select a brand</option>*/}
            {/*                                {brands.map(brand => (*/}
            {/*                                    <option key={brand.id_bra} value={brand.id_bra}>*/}
            {/*                                        {brand.bra_name}*/}
            {/*                                    </option>*/}
            {/*                                ))}*/}
            {/*                            </select>*/}
            {/*                        </div>*/}

            {/*                        <div>*/}
            {/*                            <label className="block font-medium text-gray-700 mb-1">Classification</label>*/}
            {/*                            <input*/}
            {/*                                type="text"*/}
            {/*                                name="classification"*/}
            {/*                                value={newProduct.classification}*/}
            {/*                                onChange={handleInputChange}*/}
            {/*                                placeholder="Separate with commas"*/}
            {/*                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"*/}
            {/*                            />*/}
            {/*                        </div>*/}
            {/*                    </div>*/}

            {/*                    <div className="mb-4 text-left">*/}
            {/*                        <label className="block font-medium text-gray-700 mb-1">Images</label>*/}
            {/*                        <textarea*/}
            {/*                            name="img_url"*/}
            {/*                            value={newProduct.img_url}*/}
            {/*                            onChange={handleInputChange}*/}
            {/*                            placeholder="Enter image URLs separated by commas"*/}
            {/*                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"*/}
            {/*                        />*/}
            {/*                        <p className="text-sm text-gray-500 mt-1">Separate multiple image URLs with commas</p>*/}
            {/*                    </div>*/}

            {/*                    <div className="mb-4 text-left">*/}
            {/*                        <label className="block font-medium text-gray-700 mb-1">Description</label>*/}
            {/*                        <textarea*/}
            {/*                            name="description"*/}
            {/*                            value={newProduct.description}*/}
            {/*                            onChange={handleInputChange}*/}
            {/*                            rows="4"*/}
            {/*                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"*/}
            {/*                        ></textarea>*/}
            {/*                    </div>*/}

            {/*                    <div className="flex justify-end space-x-2">*/}
            {/*                        <button*/}
            {/*                            type="button"*/}
            {/*                            onClick={resetForm}*/}
            {/*                            className="px-4 py-2 border rounded hover:bg-gray-100"*/}
            {/*                        >*/}
            {/*                            Cancel*/}
            {/*                        </button>*/}
            {/*                        <button*/}
            {/*                            type="submit"*/}
            {/*                            className="px-4 py-2 text-white rounded hover:opacity-90 flex items-center"*/}
            {/*                            style={{ background: '#D14D72' }}*/}
            {/*                            disabled={actionLoading}*/}
            {/*                        >*/}
            {/*                            <Save className="mr-2" size={16} />*/}
            {/*                            {isEditing ? 'Update Product' : 'Add Product'}*/}
            {/*                        </button>*/}
            {/*                    </div>*/}
            {/*                </form>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* View Product Details Modal */}
            {/*{selectedProductId && (*/}
            {/*    <ProductDetail*/}
            {/*        productId={selectedProductId}*/}
            {/*        onClose={handleCloseView}*/}
            {/*        onEdit={(product) => {*/}
            {/*            handleCloseView();*/}
            {/*            handleEdit(product);*/}
            {/*        }}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
};

export default Product;