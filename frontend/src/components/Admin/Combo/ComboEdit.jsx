import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import comboApi from "@apis/comboApi.js";

const ComboEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        origin_price: '',
        description: '',
        status: 'available',
        productIds: [],
        imageLinks: []
    });

    // Status options
    const statusOptions = ['available', 'order'];

    // For handling product IDs
    const [newProductId, setNewProductId] = useState('');

    // For handling image links
    const [newImageLink, setNewImageLink] = useState('');

    // Fetch combo data
    useEffect(() => {
        const fetchComboData = async () => {
            try {
                setFetchLoading(true);
                const response = await comboApi.getComboDetail(id);

                console.log(response);

                if (response.status === 200) {
                    const comboData = response.data.data[0]; // Accessing first item in data array
                    console.log("comboData", comboData);
                    setFormData({
                        name: comboData.name || '',
                        price: comboData.price || '',
                        origin_price: comboData.origin_price || '',
                        description: comboData.description || '',
                        status: comboData.status || 'available',
                        productIds: comboData.products ?
                            comboData.products.map(product => product.id_pro) :
                            [],
                        imageLinks: comboData.images || []
                    });
                } else {
                    throw new Error(response.data.message || 'Failed to fetch combo details');
                }

            } catch (err) {
                if (!err.name || err.name !== 'AbortError') {
                    setError(err.message);
                    console.error('Error fetching combo details:', err);
                }
            } finally {
                setFetchLoading(false);
            }
        };

        fetchComboData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' || name === 'origin_price' ?
                parseFloat(value) || '' :
                value
        });
    };

    const addProductId = () => {
        if (newProductId && !isNaN(parseInt(newProductId))) {
            const productId = parseInt(newProductId);
            if (!formData.productIds.includes(productId)) {
                setFormData({
                    ...formData,
                    productIds: [...formData.productIds, productId]
                });
                setNewProductId('');
            }
        }
    };

    const removeProductId = (index) => {
        const updatedProductIds = [...formData.productIds];
        updatedProductIds.splice(index, 1);
        setFormData({
            ...formData,
            productIds: updatedProductIds
        });
    };

    const addImageLink = () => {
        if (newImageLink.trim()) {
            setFormData({
                ...formData,
                imageLinks: [...formData.imageLinks, newImageLink.trim()]
            });
            setNewImageLink('');
        }
    };

    const removeImageLink = (index) => {
        const updatedImageLinks = [...formData.imageLinks];
        updatedImageLinks.splice(index, 1);
        setFormData({
            ...formData,
            imageLinks: updatedImageLinks
        });
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 3000);
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            showMessage('Name is required', 'error');
            return false;
        }
        if (!formData.price || formData.price <= 0) {
            showMessage('Valid price is required', 'error');
            return false;
        }
        if (!formData.origin_price || formData.origin_price <= 0) {
            showMessage('Valid original price is required', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const response = await comboApi.updateCombo(id, formData);

            if (response.status === 200) {
                showMessage('Combo updated successfully!', 'success');
                setTimeout(() => {
                    navigate(`/admin/combo/info/${id}`);
                }, 2000);
            } else {
                throw new Error(response.data.message || 'Failed to update combo');
            }
        } catch (err) {
            setError(err.message);
            showMessage(`Error: ${err.message}`, 'error');
            console.error('Error updating combo:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/admin/combo/info/${id}`);
    };

    if (fetchLoading) {
        return (
            <div className="container mx-auto px-5 py-10">
                <div className="flex justify-center items-center h-70">
                    <MoonLoader color="#ffa6ae" />
                </div>
            </div>
        );
    }

    if (error && !formData.name) {
        return (
            <div className="container mx-auto px-5 py-10">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
                <button
                    onClick={() => navigate('/combo')}
                    className="flex items-center text-pink-600 font-medium mb-6"
                >
                    <ArrowLeft size={20} className="mr-1" /> Back to Combo List
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-5 py-10">
            <button
                onClick={handleCancel}
                className="flex items-center text-pink-600 font-medium mb-6"
            >
                <ArrowLeft size={20} className="mr-1" /> Back to Combo Details
            </button>

            {message.text && (
                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Combo</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 text-left md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4">
                                <label className="block text-black  font-bold mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Enter combo name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-black  font-bold mb-2">
                                        Price (đ) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="Enter price"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-black  font-bold mb-2">
                                        Original Price (đ) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="origin_price"
                                        value={formData.origin_price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="Enter original price"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-black  font-bold mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Enter description"
                                    rows="3"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black  font-bold mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4">
                                <label className="block text-black  font-bold mb-2">
                                    Product IDs
                                </label>
                                <div className="flex mb-2">
                                    <input
                                        type="number"
                                        value={newProductId}
                                        onChange={(e) => setNewProductId(e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="Enter product ID"
                                        min="1"
                                    />
                                    <button
                                        type="button"
                                        onClick={addProductId}
                                        className="px-3 py-2 bg-pink-600 text-white rounded-r-lg hover:bg-pink-700"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg min-h-24 max-h-44 overflow-y-auto">
                                    {formData.productIds.length > 0 ? (
                                        <ul>
                                            {formData.productIds.map((id, index) => (
                                                <li key={index} className="flex justify-between items-center mb-1 p-2 bg-white rounded-md">
                                                    <span>Product ID: {id}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProductId(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-center">No products added</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-black  font-bold mb-2">
                                    Image Links
                                </label>
                                <div className="flex mb-2">
                                    <input
                                        type="text"
                                        value={newImageLink}
                                        onChange={(e) => setNewImageLink(e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="Enter image link"
                                    />
                                    <button
                                        type="button"
                                        onClick={addImageLink}
                                        className="px-3 py-2 bg-pink-600 text-white rounded-r-lg hover:bg-pink-700"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg min-h-24 max-h-44 overflow-y-auto">
                                    {formData.imageLinks.length > 0 ? (
                                        <ul>
                                            {formData.imageLinks.map((link, index) => (
                                                <li key={index} className="flex justify-between items-center mb-1 p-2 bg-white rounded-md">
                                                    <span className="truncate flex-1 mr-2">{link}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImageLink(index)}
                                                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-center">No image links added</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <MoonLoader size={16} color="#ffffff" />
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComboEdit;