import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import comboApi from "@apis/comboApi.js";
import ComboProductCard from "@components/ComboProductCard/ComboProductCard.jsx";
import BrandCard from "@components/BrandCard/BrandCard.jsx";

const AllCombos = () => {
    const navigate = useNavigate();
    const [combo, setCombo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCombo = async () => {
            try {
                setIsLoading(true);
                // Lấy tất cả brands với limit=100 để đảm bảo lấy hầu hết brands trong một lần
                const response = await comboApi.getCombos({ limit: 100, page: 1 });

                console.log(response);

                setCombo(response.data.data || []);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching brands:", err);
                setError("Không thể tải dữ liệu thương hiệu. Vui lòng thử lại sau.");
                setIsLoading(false);
            }
        };

        fetchCombo();
    }, []);

    if (error) {
        return <div className="text-center py-10">{error}</div>;
    }

    return (
        <div className="font-sans">
            <div className="container mx-auto px-4 py-8 mt-48 mb-20">
                <div className="mb-15">
                    <h1 className="text-3xl font-bold text-gray-800">Tất cả combo</h1>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-6">
                        {combo.map((combo) => (
                            <ComboProductCard
                                key={combo.id_combo}
                                combo={combo}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllCombos;