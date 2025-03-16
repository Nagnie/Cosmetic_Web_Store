import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import brandsApi from "@apis/brandsApi";

const AllBrandsPage = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllBrands = async () => {
            try {
                setIsLoading(true);
                // Lấy tất cả brands với limit=100 để đảm bảo lấy hầu hết brands trong một lần
                const response = await brandsApi.getBrands({ limit: 100, page: 1 });
                setBrands(response.data.data.data || []);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching brands:", err);
                setError("Không thể tải dữ liệu thương hiệu. Vui lòng thử lại sau.");
                setIsLoading(false);
            }
        };

        fetchAllBrands();
    }, []);

    if (error) {
        return <div className="text-center py-10">{error}</div>;
    }

    return (
        <div className="font-sans">
            <div className="container mx-auto px-4 py-8 mt-50 mb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Tất cả thương hiệu</h1>
                    <p className="text-gray-600 mt-2">Khám phá các thương hiệu mỹ phẩm hàng đầu</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {brands.map((brand) => (
                            <BrandCard
                                key={brand.id}
                                brand={brand}
                                onClick={() => navigate(`/brands/${brand.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const BrandCard = ({ brand, onClick }) => {
    // Tạo màu nền nhất quán cho từng thương hiệu
    const getBackgroundColor = (name) => {
        const colors = [
            "bg-amber-100", "bg-rose-100", "bg-emerald-100",
            "bg-sky-100", "bg-indigo-100", "bg-purple-100",
            "bg-pink-100", "bg-orange-100", "bg-lime-100"
        ];

        const textColors = {
            "bg-amber-100": "text-amber-800",
            "bg-rose-100": "text-rose-800",
            "bg-emerald-100": "text-emerald-800",
            "bg-sky-100": "text-sky-800",
            "bg-indigo-100": "text-indigo-800",
            "bg-purple-100": "text-purple-800",
            "bg-pink-100": "text-pink-800",
            "bg-orange-100": "text-orange-800",
            "bg-lime-100": "text-lime-800"
        };

        // Sử dụng tên thương hiệu để chọn màu nhất quán
        const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const bgColor = colors[charSum % colors.length];

        return {
            background: bgColor,
            text: textColors[bgColor]
        };
    };

    const colors = getBackgroundColor(brand.name);

    return (
        <div
            className={`${colors.background} rounded-lg p-6 transition-transform hover:scale-105 cursor-pointer shadow-md flex flex-col justify-between h-40`}
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <h3 className={`${colors.text} text-lg font-semibold`}>
                    {brand.name}
                </h3>
                <span className="bg-white bg-opacity-70 rounded-full px-2 py-1 text-xs font-medium text-gray-700">
          {brand.numProducts}
        </span>
            </div>

            <div className="mt-4">
                <p className={`${colors.text} text-sm opacity-80`}>
                    {brand.numProducts} sản phẩm
                </p>
                <p className={`${colors.text} text-xs mt-1 font-medium`}>
                    Xem chi tiết →
                </p>
            </div>
        </div>
    );
};

export default AllBrandsPage;