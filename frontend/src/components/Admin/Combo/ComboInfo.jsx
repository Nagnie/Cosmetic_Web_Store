import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {ArrowLeft, Edit, Trash2} from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"
import comboApi from "@apis/comboApi.js";

const ComboInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [combo, setCombo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComboDetail = async () => {
            try {
                setLoading(true);
                const response = await comboApi.getComboDetail(id);

                if (response.status === 200) {
                    setCombo(response.data.data[0]);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch combo details');
                }

            } catch (err) {
                if (!err.name || err.name !== 'AbortError') {
                    setError(err.message);
                    console.error('Error fetching combo details:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchComboDetail();
    }, [id]);

    const handleEdit = () => {
        navigate(`/admin/combo/edit/${id}`);
    };

    const handleBack = () => {
        navigate('/admin');
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this combo?')) {
            try {
                const response = await comboApi.deleteCombo(id);

                if (response.status === 200) {
                    alert("Delete successfully!");
                    navigate('/admin');
                } else {
                    throw new Error(response.message || 'Failed to delete combo');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-5 py-10">
                <div className="flex justify-center items-center h-70">
                    <MoonLoader color="#ffa6ae" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-5 py-10">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
                <button
                    onClick={handleBack}
                    className="flex items-center text-pink-600 font-medium mb-6"
                >
                    <ArrowLeft size={20} className="mr-1" /> Back to Combo List
                </button>
            </div>
        );
    }

    if (!combo) {
        return (
            <div className="container mx-auto px-5 py-10">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <p>Combo not found.</p>
                </div>
                <button
                    onClick={handleBack}
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
                onClick={handleBack}
                className="flex items-center text-pink-600 font-medium mb-6"
            >
                <ArrowLeft size={20} className="mr-1" /> Back to Combo List
            </button>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center m-6">
                    <h2 className="text-3xl font-bold text-gray-800">{combo.name}</h2>
                    <div className={"flex space-x-2"}>
                        <button
                            onClick={handleEdit}
                            className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                        >
                            <Edit size={18}/>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className={"col-span-2"}>
                        <div className="mb-6">
                            <h2 className="font-semibold text-xl text-gray-700 mb-2">Basic Information</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-black font-bold">ID</p>
                                        <p className="font-medium">{combo.id_combo}</p>
                                    </div>
                                    <div>
                                        <p className="text-black font-bold">Status</p>
                                        <span className="px-3 py-1 inline-flex leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                                            {combo.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-black font-bold">Original Price</p>
                                        <p className="font-medium">{Number(combo.origin_price).toLocaleString()} đ</p>
                                    </div>
                                    <div>
                                        <p className="text-black font-bold">Price</p>
                                        <p className="font-medium">{Number(combo.price).toLocaleString()} đ</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="font-semibold text-xl text-gray-700 mb-2">Description</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">{combo.description}</p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h2 className="font-semibold text-xl text-gray-700 mb-2">Combo Images</h2>
                            {combo.images && combo.images.length > 0 ? (
                                <div className="md:col-span-2">
                                    <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                                        {combo.images.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    src={img}
                                                    alt={`${combo.name} - ${index + 1}`}
                                                    className="w-full object-cover rounded cursor-pointer"
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <div className="mt-5">
                                        <strong>Total:</strong> {combo.images.length} images
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                    No Image Available
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="mb-6">
                            <h2 className="font-semibold text-xl text-gray-700 mb-2">Products in Combo</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {combo.products && combo.products.length > 0 ? (
                                    <ul className="space-y-4">
                                        {combo.products.map((product, index) => (
                                            <li key={index} className="border-b pb-4 last:border-b-0">
                                                <div className="flex items-center space-x-4">
                                                    <div>
                                                        <p className="font-bold text-gray-800">{product.pro_name}</p>
                                                        <p className="text-gray-600">Price: {Number(product.pro_price).toLocaleString()} đ</p>
                                                    </div>
                                                </div>
                                                {product.pro_images && product.pro_images.length > 0 && (
                                                    <div className="mt-4">
                                                        <Swiper
                                                            navigation={true}
                                                            modules={[Navigation]}
                                                            className="mySwiper"
                                                        >
                                                            {product.pro_images.map((img, imgIndex) => (
                                                                <SwiperSlide key={imgIndex}>
                                                                    <img
                                                                        src={img}
                                                                        alt={`${product.pro_name} - ${imgIndex + 1}`}
                                                                        className="w-full object-cover rounded cursor-pointer"
                                                                    />
                                                                </SwiperSlide>
                                                            ))}
                                                        </Swiper>
                                                        <div className="mt-2 text-sm text-gray-600">
                                                            <strong>Total:</strong> {product.pro_images.length} images
                                                        </div>
                                                    </div>
                                                )}

                                                {product.pro_classification && product.pro_classification.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="font-semibold text-gray-700">Classifications:</p>
                                                        <div className="flex space-x-2">
                                                            {product.pro_classification.map((classification) => (
                                                                <span
                                                                    key={classification.id_class}
                                                                    className="px-2 py-1 bg-gray-200 rounded text-sm"
                                                                >
                                                                    {classification.class_name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-black">No products in this combo</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComboInfo;