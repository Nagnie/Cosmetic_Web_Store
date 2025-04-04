import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import brandsApi from "@apis/brandsApi";
import BrandCard from "@components/BrandCard/BrandCard.jsx";

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
            <div className="container mx-auto py-8 mt-48 mb-20">
                <div className="mb-15">
                    <h1 className="text-3xl font-bold text-gray-800">Tất cả thương hiệu</h1>
                    <p className="text-gray-600 mt-2">Khám phá các thương hiệu mỹ phẩm hàng đầu</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-6 justify-center">
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

export default AllBrandsPage;