import React from 'react';
import {useNavigate, useNavigation, useParams, Link} from 'react-router-dom';
import {FaShoppingBag} from "react-icons/fa";
import {BsCartPlus} from "react-icons/bs";

const CosmeticComboCard = () => {
    const navigate = useNavigate();
    const comboProducts = [
        {
            id: 1,
            name: "Combo Dưỡng Da Mùa Đông",
            image: "https://i.pinimg.com/736x/f5/b7/a8/f5b7a88329577b1ed60d797e997472d0.jpg",
            description: "Bộ sản phẩm dưỡng da toàn diện giúp bảo vệ da khỏi thời tiết lạnh",
            firstPrice: "1.200.000 VND",
            price: "850.000 VNĐ",
            products: [
                { id: 101, name: "Sữa rửa mặt dưỡng ẩm", price: "250.000 VNĐ", link: "/products/101" },
                { id: 102, name: "Serum chống lão hóa", price: "320.000 VNĐ", link: "/products/102" },
                { id: 103, name: "Kem dưỡng ẩm chuyên sâu", price: "280.000 VNĐ", link: "/products/103" },
                { id: 104, name: "Mặt nạ dưỡng da ban đêm", price: "150.000 VNĐ", link: "/products/104" }
            ]
        },
        {
            id: 2,
            name: "Combo Trang Điểm Cơ Bản",
            image: "https://i.pinimg.com/736x/13/ad/b8/13adb8ed15c330b0ea233cba81a7d28a.jpg",
            description: "Bộ sản phẩm trang điểm đầy đủ cho người mới bắt đầu",
            firstPrice: "1.000.000 VND",
            price: "750.000 VNĐ",
            products: [
                { id: 201, name: "Kem lót trang điểm", price: "180.000 VNĐ", link: "/products/201" },
                { id: 202, name: "Phấn nền che khuyết điểm", price: "220.000 VNĐ", link: "/products/202" },
                { id: 203, name: "Phấn mắt tự nhiên", price: "180.000 VNĐ", link: "/products/203" },
                { id: 204, name: "Son lì dưỡng môi", price: "170.000 VNĐ", link: "/products/204" }
            ]
        },
        {
            id: 3,
            name: "Combo Chăm Sóc Tóc",
            image: "https://i.pinimg.com/736x/76/71/93/7671935a210b258ba9ebfb930691bf9f.jpg",
            description: "Bộ sản phẩm chăm sóc tóc toàn diện giúp tóc khỏe đẹp",
            firstPrice: "900.000 VND",
            price: "650.000 VNĐ",
            products: [
                { id: 301, name: "Dầu gội phục hồi tóc", price: "180.000 VNĐ", link: "/products/301" },
                { id: 302, name: "Dầu xả dưỡng ẩm", price: "170.000 VNĐ", link: "/products/302" },
                { id: 303, name: "Serum dưỡng tóc", price: "200.000 VNĐ", link: "/products/303" },
                { id: 304, name: "Kem ủ tóc", price: "250.000 VNĐ", link: "/products/304" }
            ]
        }
    ];

    const navigateToProduct = () =>{
        return navigate(`product/${comboProducts.products.name}`);
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 pt-8">
                <h2 className="text-3xl font-bold text-center text-black mb-10">Combo Sản Phẩm</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {comboProducts.map((combo) => (
                        <div key={combo.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="relative">
                                <img src={combo.image} alt={combo.name} className="w-full h-80 object-cover" />
                                <div className="absolute top-0 right-0 bg-primary line-through text-sm text-white px-4 py-2 m-3 rounded-full">
                                    {combo.firstPrice}
                                </div>
                                <div className="absolute top-12 right-0 bg-primary-deepest text-white px-4 py-2 m-3 rounded-full">
                                    {combo.price}
                                </div>
                            </div>

                            <div className="p-6">
                                <Link to={`/combo/${combo.name}`} className="text-2xl font-bold text-primary-dark mb-2">{combo.name}</Link>
                                <p className="text-gray-600 mb-4">{combo.description}</p>

                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-primary-deepest mb-3">Sản phẩm trong combo:</h3>
                                    <ul className="space-y-2">
                                        {combo.products.map((product) => (
                                            <li key={product.id} className="flex justify-between">
                                                <Link
                                                    to={`/products/${product.name}`}
                                                    className="text-primary-dark hover:text-orange-800 hover:underline">
                                                    {product.name}
                                                </Link>
                                                <span className="text-gray-600">{product.price}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-6 text-center flex justify-center">
                                        <button className="bg-primary flex hover:bg-primary-medium text-white font-bold py-2 px-6 rounded-full transition duration-300 mx-2">
                                            <FaShoppingBag size={18} />
                                            <span className={"mx-2"}>Mua ngay</span>
                                        </button>
                                        <button className="bg-primary-light hover:bg-primary-light text-white font-bold py-2 px-6 rounded-full transition duration-300">
                                            <BsCartPlus size={22} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CosmeticComboCard;