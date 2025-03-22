import React, {useMemo, useState} from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ProductImageGallery } from "@pages/ProductDetail/components/index.js";
import {Button} from "antd";
import {ShoppingCartOutlined, ThunderboltOutlined} from "@ant-design/icons";

const CosmeticComboPage = () => {
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState(0);
    const comboProducts = [
        {
            id: 1,
            name: "Combo Dưỡng Da Mùa Đông",
            images: [
                "https://i.pinimg.com/736x/f5/b7/a8/f5b7a88329577b1ed60d797e997472d0.jpg",
                "https://i.pinimg.com/736x/3e/29/87/3e29877a3aa399ef62719d62e84ce9eb.jpg",
                "https://i.pinimg.com/736x/24/24/59/242459853102869fdc758eea4b0ff6ea.jpg"
            ],
            description: "Bộ sản phẩm dưỡng da toàn diện giúp bảo vệ da khỏi thời tiết lạnh",
            firstPrice: "1.200.000 VND",
            price: "850.000 VNĐ",
            status: "Available",
            products: [
                { id: 1, name: "Sữa rửa mặt dưỡng ẩm", subcategory: "sua rua mat", brand: "A", price: "250.000 VNĐ"},
                { id: 2, name: "Serum chống lão hóa", subcategory: "sua rua mat", brand: "A", price: "320.000 VNĐ" },
                { id: 3, name: "Kem dưỡng ẩm chuyên sâu", subcategory: "sua rua mat", brand: "A", price: "280.000 VNĐ" },
                { id: 4, name: "Mặt nạ dưỡng da ban đêm", subcategory: "sua rua mat", brand: "A", price: "150.000 VNĐ" }
            ]
        },
    ];

    const handleAddToCart = () => {
        const item = {
            id: comboProducts.id,
            // quantity: quantity,
        };

        addCartItemMutation.mutate(item);
    };

    const handleBuyNow = async () => {
        const item = {
            id: comboProducts.id,
            // quantity: quantity,
        };
    }

    const combo = comboProducts[0]; // Using the first combo for this example

    // Correctly format the images array for ProductImageGallery
    const images = useMemo(
        () =>
            (combo.images || []).map((image, index) => ({
                id: index, // Using index as id since your images are just URLs
                src: image,
            })),
        [combo.images],
    );
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
                    <h2 className="text-3xl font-bold text-gray-800">{combo.name}</h2>

                    <div className="flex items-center space-x-4">
                        <span className="text-lg text-gray-500 line-through">{combo.firstPrice}</span>
                        <span className="text-2xl font-semibold text-primary-dark">{combo.price}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                            {combo.status}
                        </span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm:</h3>
                        <p className="text-gray-700">{combo.description}</p>
                    </div>

                    <div className="mt-4 flex h-[90px] w-full flex-col gap-2 sm:flex-row sm:gap-4 md:h-auto">
                        <Button
                            type="default"
                            icon={<ShoppingCartOutlined />}
                            size="large"
                            onClick={() => handleAddToCart()}
                            className="!bg-secondary !border-secondary !text-primary-dark flex flex-1 items-center justify-center"
                        >
                            Thêm vào giỏ
                        </Button>

                        <Button
                            type="primary"
                            icon={<ThunderboltOutlined />}
                            size="large"
                            onClick={() => handleBuyNow()}
                            className="!bg-primary-dark !border-primary-dark flex flex-1 items-center justify-center !text-white"
                        >
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </div>

            {/* Product Cards Section */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm trong combo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {combo.products.map((product) => (
                        <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="p-4">
                                <h3 className="font-medium text-lg text-gray-800 mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">Thương hiệu: {product.brand}</p>
                                <p className="text-sm text-gray-500 mb-4">Danh mục: {product.subcategory}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-primary-dark font-semibold">{product.price}</span>
                                    <button className="text-sm px-3 py-1 bg-pink-100 text-primary-dark rounded hover:bg-pink-200 transition duration-200">
                                        Chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CosmeticComboPage;