import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productsApi from '@apis/productsApi';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [originalClassification, setOriginalClassification] = useState([]);

    // Form fields state
    const [formData, setFormData] = useState({
        pro_name: '',
        price: '',
        id_subcat: '',
        id_bra: '',
        status: 'Available',
        images: ['', '', ''],
        classification: ['', '', ''],
        description: '',
    });

    // Fetch product data
    // Trong useEffect khi fetch dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch product details
                const productResponse = await productsApi.getProductDetail(id);
                if (productResponse.status === 200) {
                    const productData = productResponse.data[0];
                    setProduct(productData);

                    console.log("productData: ", productData);

                    // Lưu dữ liệu gốc của classification
                    if (Array.isArray(productData.classification)) {
                        setOriginalClassification(productData.classification);
                    }

                    // Tạo dữ liệu hiển thị cho form
                    const displayClassification = Array.isArray(productData.classification)
                        ? productData.classification.map(item => {
                            // Nếu là object có thuộc tính name, lấy ra name
                            if (typeof item === 'object' && item.name) {
                                return item.name;
                            }
                            return item;
                        })
                        : ['', '', ''];

                    // Update form data
                    setFormData({
                        pro_name: productData.pro_name || '',
                        price: productData.price || '',
                        id_subcat: productData.id_subcat || '',
                        id_bra: productData.id_bra || '',
                        status: productData.status || 'Available',
                        images: Array.isArray(productData.images) ? productData.images : ['', '', ''],
                        classification: displayClassification,
                        description: productData.description || '',
                    });

                    console.log("formData: ", formData);
                } else {
                    throw new Error(productResponse.message || 'Failed to fetch product details');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value
        }));

    };

    // Handle array fields (img_url and classification)
    const handleArrayChange = (field, index, value) => {
        setFormData(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return {
                ...prev,
                [field]: newArray
            };
        });
    };

    // Add or remove array items
    const handleArrayAction = (field, action) => {
        setFormData(prev => {
            let newArray = [...prev[field]];

            if (action === 'add') {
                newArray.push('');
            } else if (action === 'remove' && newArray.length > 1) {
                newArray.pop();
            }

            return {
                ...prev,
                [field]: newArray
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo dữ liệu để gửi lên API
        const apiFormData = {
            ...formData,
            id_subcat: Number(formData.id_subcat),
            id_bra: Number(formData.id_bra),
        };

        try {
            setSubmitting(true);
            setError(null);

            console.log("apiFormData: ", apiFormData);

            const response = await productsApi.updateProduct(id, apiFormData);

            console.log("response: ", response);

            if (response.status === 200) {
                setSuccessMessage('Product updated successfully');
                setTimeout(() => {
                    navigate(`/admin/product/${id}`);
                }, 2000);
            } else {
                throw new Error(response.message || 'Failed to update product');
            }
        } catch (err) {
            setError(err.message);
            window.scrollTo(0, 0);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (!product && !loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                    Product not found
                </div>
                <Link to="/products" className="mt-4 inline-block text-blue-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center mb-6 text-sm">
                <Link to="/admin" className="text-gray-500 hover:text-gray-700">
                    Products
                </Link>
                <span className="mx-2 text-gray-500">/</span>
                <Link to={`/admin/product/${id}`} className="text-gray-500 hover:text-gray-700">
                    {product.pro_name}
                </Link>
                <span className="mx-2 text-gray-500">/</span>
                <span className="text-gray-900 font-medium">Edit</span>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mprodub-6">
                    Error: {error}
                </div>
            )}

            {/* Success message */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                    {successMessage}
                </div>
            )}

            <div className="bg-white text-left rounded-lg shadow-md overflow-hidden px-5">
                <div className="p-6">
                    <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="pro_name"
                                    value={formData.pro_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price (VND) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                >
                                    <option value="Available">Available</option>
                                    <option value="Ordering">Ordering</option>
                                </select>
                            </div>

                            {/* Subcategory ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subcategory ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="id_subcat"
                                    value={formData.id_subcat}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>

                            {/* Brand ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="id_bra"
                                    value={formData.id_bra}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>

                            {/* Image URLs */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URLs
                                </label>
                                {formData.images.map((url, index) => (
                                    <div key={`img-${index}`} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => handleArrayChange('images', index, e.target.value)}
                                            placeholder={`Image URL ${index + 1}`}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                        />
                                    </div>
                                ))}
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleArrayAction('images', 'add')}
                                        className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
                                    >
                                        + Add Image URL
                                    </button>
                                    {formData.images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleArrayAction('images', 'remove')}
                                            className="px-2 py-1 bg-red-500 text-white rounded-md text-sm"
                                        >
                                            - Remove Last
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Classification Options (sizes, variants, etc.)
                                </label>
                                {formData.classification.map((option, index) => (
                                    <div key={`cls-${index}`} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleArrayChange('classification', index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                        />
                                    </div>
                                ))}
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleArrayAction('classification', 'add')}
                                        className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
                                    >
                                        + Add Option
                                    </button>
                                    {formData.classification.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleArrayAction('classification', 'remove')}
                                            className="px-2 py-1 bg-red-500 text-white rounded-md text-sm"
                                        >
                                            - Remove Last
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                ></textarea>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="mt-8 flex items-center justify-end space-x-3">
                            <Link
                                to={`/products/${id}`}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 ${
                                    submitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductEdit;