import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productsApi from '@apis/productsApi';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"
import { PulseLoader } from "react-spinners";
import {Edit, Trash2} from "lucide-react";

const ProductInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            console.log("product detail: ");
            console.log(id);
            const response = await productsApi.getProductDetail(id);

            console.log("Response:  ", response);

            if (response.status === 200) {
                setProduct(response.data[0]);
            } else {
                throw new Error(response.message || 'Failed to fetch product details');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    const handleEdit = () => {
        navigate(`/admin/product/${id}/update`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await productsApi.deleteProduct(id);

                if (response.status === 200) {
                    alert("Delete successfully!");
                    navigate('/admin');
                } else {
                    throw new Error(response.message || 'Failed to delete product');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className={"container pt-30 mt-20 mx-auto"}>
                <PulseLoader
                    color={"#D14D72"}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
                <Link to="/products" className="mt-4 inline-block text-blue-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                    Product not found
                </div>
                <Link to="/admin" className="mt-4 inline-block text-blue-600 hover:underline">
                    Quay ve
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
                <span className="text-gray-900 font-medium">{product.pro_name}</span>
            </div>

            {/* Product Detail Header */}
            <div className="flex justify-between items-center my-6">
                <h2 className="text-3xl font-bold text-left">{product.pro_name}</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-teal-600 flex items-center text-white rounded-md hover:bg-teal-700"
                    >
                        <Edit size={18} className={"me-2"} />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Product Detail Content */}
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden p-2">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
                    {!product.images.length === 0 ? (
                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                            No Image Available
                        </div>
                    ) : (
                        <div className="md:col-span-2">
                            <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                                {product.images &&
                                    product.images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={img}
                                                alt={`${product.pro_name} - ${index + 1}`}
                                                className="w-full object-cover rounded cursor-pointer"
                                            />
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                            <div className={"mt-5"}><strong>Tổng cộng:</strong> {product.images.length} hình ảnh</div>
                        </div>
                    )}

                    {/* Product Info */}
                    <div className="md:col-span-3 text-left px-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-gray-800">Product ID</p>
                                <p className="font-medium">{product.id_pro}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-800">Price</p>
                                <p className="font-semibold text-xl text-pink-600">{Number(product.price).toLocaleString()} VND</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-800">Category</p>
                                <p className="font-medium">
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                                        {product.cat_name}
                                    </span>
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-800">Subcategory</p>
                                <p className="font-medium">
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {product.scat_name}
                                    </span>
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-800">Brand</p>
                                <p className="font-medium">
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
                                        {product.bra_name}
                                    </span>
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-800">Status</p>
                                <p className="font-medium">
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                        {product.pro_status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold text-lg">Description</h3>
                            <div className="mt-2 text-gray-700">
                                {product.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                ) : (
                                    <p className="italic text-gray-500">No description available</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold text-lg">Phân loại</h3>
                            <div className="mt-2">
                                {product.classification && product.classification.length > 0 ? (
                                    <div className="flex">
                                        {product.classification.map(({ id_class, name }) => (
                                            <div key={id_class} className="py-2 me-4">
                                                <span className="bg-red-100 rounded-xl py-2 px-5">{name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="italic text-gray-500">No specifications available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;