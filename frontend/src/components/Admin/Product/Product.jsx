import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search, X, Save, Eye } from 'lucide-react';

const Product = () => {
    // State for cosmetic products
    const [products, setProducts] = useState([
        { id: 1, name: "Rose Facial Cream", category: "Skincare", brand: "Mediheal", price: 24.99, status: 45, image: "/api/placeholder/80/80" },
        { id: 2, name: "Velvet Matte Lipstick", category: "Makeup", brand: "Laneige", price: 18.50, status: 32, image: "/api/placeholder/80/80" },
        { id: 3, name: "Hyaluronic Acid Serum", category: "Skincare", brand: "Innisfree", price: 35.99, status: 18, image: "/api/placeholder/80/80" },
        { id: 4, name: "Mineral Foundation", category: "Makeup", brand: "Etude House", price: 29.99, status: 27, image: "/api/placeholder/80/80" },
        { id: 5, name: "Lavender Bath Salts", category: "Bath & Body", brand: "Sulwhasoo", price: 12.99, status: 56, image: "/api/placeholder/80/80" },
    ]);

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: '',
        description: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // Categories for dropdown
    const categories = ["Skincare", "Makeup", "Hair Care", "Bath & Body", "Fragrance"];

    // Brands for dropdown
    const brands = ["Mediheal", "Laneige", "Innisfree", "Etude House", "Sulwhasoo"];

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) || '' : value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && currentProduct) {
            // Update existing product
            setProducts(products.map(product =>
                product.id === currentProduct.id ? { ...newProduct, id: currentProduct.id } : product
            ));
        } else {
            // Add new product
            const productId = Math.max(0, ...products.map(p => p.id)) + 1;
            setProducts([...products, { ...newProduct, id: productId }]);
        }

        // Reset form
        resetForm();
    };

    // View product details
    const handleView = (product) => {
        setCurrentProduct(product);
        setViewOpen(true);
    };

    // Edit product
    const handleEdit = (product) => {
        setCurrentProduct(product);
        setNewProduct(product);
        setIsEditing(true);
        setFormOpen(true);
    };

    // Delete product
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(product => product.id !== id));
        }
    };

    // Reset form
    const resetForm = () => {
        setNewProduct({
            name: '',
            category: '',
            price: '',
            stock: '',
            image: '/api/placeholder/200/200',
            description: ''
        });
        setCurrentProduct(null);
        setIsEditing(false);
        setFormOpen(false);
        setViewOpen(false);
    };

    return (
        <div>
            {/* Main Content */}
            <main className="container mx-auto px-5">
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
                <div className={"flex justify-between items-center mb-6"}>
                    <button
                        onClick={() => {setFormOpen(true); setIsEditing(false);}}
                        className="flex items-center bg-white text-pink-600 px-4 py-2 rounded-md shadow hover:bg-gray-100"
                    >
                        <PlusCircle className="mr-2" size={18} />
                        Add Product
                    </button>
                    <div className={`text-right ${filteredProducts.length > 0 ? 'block' : 'hidden'}`}>
                        <span className="text-gray-600">Showing {filteredProducts.length} products</span>
                    </div>
                </div>


                {/* Products Table */}
                <div className="bg-white rounded-lg shadow overflow-x-auto text-left">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead style={{ backgroundColor: '#D14D72' }}>
                        <tr>
                            <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Brand</th>
                            <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                                            {product.brand}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.status}
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
                                                onClick={() => handleDelete(product.id)}
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
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No products found. Try a different search term or add a new product.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Add/Edit Product Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
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
                                            name="name"
                                            value={newProduct.name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium text-gray-700 mb-1">Price (VNĐ)</label>
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
                                            name="category"
                                            value={newProduct.category}
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
                                            name="brand"
                                            value={newProduct.brand}
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
                                </div>

                                <div className="mb-4 text-left">
                                    <label className={"block font-medium text-gray-700 mb-1"}>Images</label>
                                    <textarea
                                        type={"text"}
                                        name={"image"}
                                        value={newProduct.image}
                                        onChange={handleInputChange}
                                        className={"w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"}
                                        required
                                    />
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
                                        className="px-4 py-2 text-white rounded hover:opacity-90"
                                        style={{ background: '#D14D72' }}
                                    >
                                        <Save className="inline mr-2" size={16} />
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
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex justify-center">
                                    <img
                                        src={currentProduct.image}
                                        alt={currentProduct.name}
                                        className="rounded-lg object-cover h-64 w-64"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{currentProduct.name}</h3>
                                    <p className="inline-block px-2 py-1 mb-2 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                                        {currentProduct.category}
                                    </p>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="font-medium">${currentProduct.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-gray-600">Stock:</span>
                                            <span className="font-medium">{currentProduct.stock} units</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-gray-600">Product ID:</span>
                                            <span className="font-medium">#{currentProduct.id}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
                                        <p className="text-gray-600 text-sm">
                                            {currentProduct.description || "No description available."}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-2">
                                        <button
                                            onClick={() => {setViewOpen(false); handleEdit(currentProduct);}}
                                            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                                        >
                                            <Edit className="inline mr-2" size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={resetForm}
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