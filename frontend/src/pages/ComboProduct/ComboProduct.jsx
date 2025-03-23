import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ProductImageGallery } from "@pages/ProductDetail/components/index.js";
import { Button, Spin, message } from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import comboApi from "@apis/comboApi.js";

const CosmeticComboPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeImage, setActiveImage] = useState(0);

    // Query to fetch combo details using the id from URL params
    const { data: comboData, isLoading, isError, error } = useQuery({
        queryKey: ['comboDetail', id],
        queryFn: ({ signal }) => comboApi.getComboDetail(id, { signal })
            .then(response => response.data.data),
        enabled: !!id,
        staleTime: 60 * 60 * 1000, // 1 hour
    });

    // Format price with dots as thousand separators and add VNĐ
    const formatPrice = (price) => {
        if (!price) return "";
        return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
    };

    const handleAddToCart = () => {
        if (!comboData) return;

        const item = {
            id: comboData.id_combo,
            type: 'combo',
            quantity: 1,
        };

        // Add cart logic here
        message.success("Đã thêm vào giỏ hàng");
    };

    const handleBuyNow = async () => {
        if (!comboData) return;

        const item = {
            id: comboData.id_combo,
            type: 'combo',
            quantity: 1,
        };

        // Add to cart first
        // Then navigate to checkout
        navigate('/checkout');
    };

    // Prepare images for gallery component
    const images = useMemo(() => {
        if (!comboData || !comboData.images || !comboData.images.length) {
            return [{ id: 0, src: "https://placehold.co/400x400/png?text=No+Image" }];
        }

        return comboData.images.map((image, index) => ({
            id: index,
            src: image,
        }));
    }, [comboData?.images]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" tip="Đang tải..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h2 className="text-2xl text-red-500 mb-4">Có lỗi xảy ra khi tải thông tin combo</h2>
                <p className="text-gray-600 mb-4">{error?.message || "Vui lòng thử lại sau"}</p>
                <Button type="primary" onClick={() => navigate(-1)}>Quay lại</Button>
            </div>
        );
    }

    if (!comboData) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h2 className="text-2xl text-gray-700 mb-4">Không tìm thấy combo</h2>
                <Button type="primary" onClick={() => navigate('/combos')}>Xem danh sách combo</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto mt-50 px-4 py-8">
            {/* Main Content - 2 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
                {/* Left Column - Image Gallery */}
                <div className="space-y-4">
                    <ProductImageGallery images={images} />
                </div>

                {/* Right Column - Product Info */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800">{comboData.name}</h2>

                    <div className="flex items-center space-x-4">
                        {comboData.origin_price && (
                            <span className="text-lg text-gray-500 line-through">
                                {formatPrice(comboData.origin_price)}
                            </span>
                        )}
                        <span className="text-2xl font-semibold text-primary-dark">
                            {formatPrice(comboData.price)}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-sm font-medium ${
                            comboData.status === 'available'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {comboData.status === 'available' ? 'Còn hàng' : 'Hết hàng'}
                        </span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm:</h3>
                        <p className="text-gray-700">{comboData.description}</p>
                    </div>

                    <div className="mt-4 flex h-[90px] w-full flex-col gap-2 sm:flex-row sm:gap-4 md:h-auto">
                        <Button
                            type="default"
                            icon={<ShoppingCartOutlined />}
                            size="large"
                            onClick={handleAddToCart}
                            disabled={comboData.status !== 'available'}
                            className="!bg-secondary !border-secondary !text-primary-dark flex flex-1 items-center justify-center"
                        >
                            Thêm vào giỏ
                        </Button>

                        <Button
                            type="primary"
                            icon={<ThunderboltOutlined />}
                            size="large"
                            onClick={handleBuyNow}
                            disabled={comboData.status !== 'available'}
                            className="!bg-primary-dark !border-primary-dark flex flex-1 items-center justify-center !text-white"
                        >
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </div>

            {/* Product Cards Section */}
            {comboData.products && comboData.products.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm trong combo</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {comboData.products.map((product) => (
                            <div key={product.id_pro} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                {product.pro_images && product.pro_images.length > 0 && (
                                    <img
                                        src={product.pro_images[0]}
                                        alt={product.pro_name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://placehold.co/400x300/png?text=No+Image";
                                        }}
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="font-medium text-lg text-gray-800 mb-2 line-clamp-2">{product.pro_name}</h3>
                                    {product.pro_classification && (
                                        <p className="text-sm text-gray-500 mb-2">
                                            Phân loại: {product.pro_classification.map(c => c.class_name).join(', ')}
                                        </p>
                                    )}
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-primary-dark font-semibold">
                                            {formatPrice(product.pro_price)}
                                        </span>
                                        <Link
                                            to={`/products/${product.id_pro}`}
                                            className="text-sm px-3 py-1 bg-pink-100 text-primary-dark rounded hover:bg-pink-200 transition duration-200"
                                        >
                                            Chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CosmeticComboPage;