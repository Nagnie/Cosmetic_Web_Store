import React, { useState, useEffect } from 'react';
import {Save, X, Plus, Minus} from 'lucide-react';

const ProductModal = ({
                          isOpen,
                          onClose,
                          product,
                          isEditing,
                          onSubmit,
                          isLoading
                      }) => {
    const [formData, setFormData] = useState({
        pro_name: '',
        id_subcat: '',
        id_bra: '',
        price: '',
        origin_price: '',
        images: [''],
        classification: [''],
        desc: '',
        status: 'Có sẵn'
    });

    // Initialize form data when editing
    useEffect(() => {
        if (isEditing && product) {
            setFormData({
                pro_name: product.pro_name || '',
                id_subcat: product.id_subcat || '',
                id_bra: product.id_bra || '',
                price: product.price || '',
                origin_price: product.origin_price || '',
                images: Array.isArray(product.img_url) && product.img_url.length > 0
                    ? product.img_url
                    : [''],
                classification: Array.isArray(product.classification) && product.classification.length > 0
                    ? product.classification
                    : [''],
                desc: product.desc || '',
                status: product.status || 'Có sẵn'
            });
        } else {
            // Reset form when adding new product
            setFormData({
                pro_name: '',
                id_subcat: '',
                id_bra: '',
                price: '',
                origin_price: '',
                images: [''],
                classification: [''],
                desc: '',
                status: 'Có sẵn'
            });
        }
    }, [isEditing, product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' ? parseFloat(value) || '' : value
        });
    };

    // Handle array fields (images and classification)
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const submissionData = {
            pro_name: formData.pro_name,
            id_subcat: parseInt(formData.id_subcat),
            id_bra: parseInt(formData.id_bra),
            price: parseFloat(formData.price),
            origin_price: parseFloat(formData.origin_price),
            status: formData.status,
            img_url: formData.images.filter(img => img.trim() !== ''), // Remove empty images
            classification: formData.classification.filter(cls => cls.trim() !== ''), // Remove empty classifications
            desc: formData.desc,
        };

        onSubmit(submissionData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Product Name */}
                        <div className="col-span-2">
                            <label className="block text-black mb-1">
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="pro_name"
                                value={formData.pro_name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-pink-500 focus:ring-2"
                            />
                        </div>

                        {/* Subcategory */}
                        <div>
                            <label className="block text-black mb-1">
                                Subcategory
                            </label>
                            <input
                                type="number"
                                name="id_subcat"
                                value={formData.id_subcat}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-pink-500 focus:ring-2"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-black mb-1">
                                Brand
                            </label>
                            <input
                                type="number"
                                name="id_bra"
                                value={formData.id_bra}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-pink-500 focus:ring-2"
                            />
                        </div>

                        {/* Origin Price */}
                        <div>
                            <label className="block text-black mb-1">
                                Origin Price
                            </label>
                            <input
                                type="number"
                                name="origin_price"
                                value={formData.origin_price}
                                onChange={handleChange}
                                required
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-pink-500 focus:ring-2"
                            />
                        </div>
                        {/* Price */}
                        <div>
                            <label className="block text-black mb-1">
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-pink-500 focus:ring-2"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-black mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-pink-500 focus:ring-2"
                            >
                                <option value="Có sẵn">Có sẵn</option>
                                <option value="Đặt hàng">Đặt hàng</option>
                            </select>
                        </div>

                        {/* Image URLs */}
                        <div className="col-span-2">
                            <label className="block text-black mb-1">
                                Image URLs
                            </label>
                            {formData.images.map((url, index) => (
                                <div key={`img-${index}`} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => handleArrayChange('images', index, e.target.value)}
                                        placeholder={`Image URL ${index + 1}`}
                                        className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-pink-500 focus:ring-2"
                                    />
                                </div>
                            ))}
                            <div className="flex space-x-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => handleArrayAction('images', 'add')}
                                    className="p-2 flex bg-teal-600 text-white rounded-full"
                                >
                                    <Plus size={22} />
                                </button>
                                {formData.images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleArrayAction('images', 'remove')}
                                        className="p-2 flex bg-rose-600 text-white rounded-full"
                                    >
                                        <Minus size={22} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Classification */}
                        <div className="col-span-2">
                            <label className="block text-black mb-1">
                                Classification Options (sizes, variants, etc.)
                            </label>
                            {formData.classification.map((option, index) => (
                                <div key={`cls-${index}`} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleArrayChange('classification', index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-pink-500 focus:ring-2"
                                    />
                                </div>
                            ))}
                            <div className="flex space-x-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => handleArrayAction('classification', 'add')}
                                    className="p-2 flex bg-teal-600 text-white rounded-full"
                                >
                                    <Plus size={22} />
                                </button>
                                {formData.classification.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleArrayAction('classification', 'remove')}
                                        className="p-2 flex bg-rose-600 text-white rounded-full"
                                    >
                                        <Minus size={22} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-black mb-1">
                                Description
                            </label>
                            <textarea
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-pink-500 focus:ring-2"
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-700 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit" style={{ background: '#D14D72' }}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-md flex items-center text-white hover:bg-pink-700 ${
                                isLoading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
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
                                    { isEditing ? 'Update Product' : 'Add Product' }
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;