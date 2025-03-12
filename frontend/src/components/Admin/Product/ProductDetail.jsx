import React, { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';
import { Circles } from "react-loader-spinner";
import productsApi from "@apis/productsApi.js";

const ProductDetail = ({ productId, onClose, onEdit }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const response = await productsApi.getProductDetail(productId);

                if (response.status === 200) {
                    setProduct(response.data.data);
                } else {
                    throw new Error(response.message || 'Failed to fetch product details');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 flex items-center justify-center">
                    <Circles color="#D14D72" height={60} width={60} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Error</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-red-500">{error}</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex justify-center">
                            {product.img_url && product.img_url.length > 0 ? (
                                <img
                                    src={Array.isArray(product.img_url) ? product.img_url[0] : product.img_url}
                                    alt={product.pro_name}
                                    className="rounded-lg object-cover h-64 w-64"
                                />
                            ) : (
                                <div className="rounded-lg bg-gray-200 h-64 w-64 flex items-center justify-center text-gray-500">
                                    No image available
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">{product.pro_name}</h3>
                            <p className="inline-block px-2 py-1 mb-2 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                                {product.cat_name}
                            </p>

                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Price:</span>
                                    <span className="font-medium">${Number(product.price).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Subcategory:</span>
                                    <span className="font-medium">{product.scat_name}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Brand:</span>
                                    <span className="font-medium">{product.bra_name}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Product ID:</span>
                                    <span className="font-medium">#{product.id_pro}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${product.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>

                            {product.description && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
                                    <p className="text-gray-600 text-sm">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {product.classification && product.classification.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Classification:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(product.classification) ?
                                            product.classification.map((cls, index) => (
                                                <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                                                    {cls}
                                                </span>
                                            )) :
                                            <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                                                {product.classification}
                                            </span>
                                        }
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={() => onEdit(product)}
                                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 flex items-center"
                                >
                                    <Edit className="mr-2" size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={onClose}
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
    );
};

export default ProductDetail;