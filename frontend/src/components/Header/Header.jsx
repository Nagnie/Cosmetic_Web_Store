import { FaSearch } from "react-icons/fa";
import { GiLipstick, GiMedicines, GiAmpleDress } from "react-icons/gi";
import { BsClipboard2HeartFill } from "react-icons/bs";
import { PiHairDryerFill } from "react-icons/pi";
import { useState } from 'react';
import { useScrollDirection } from '../../hooks/useScrollDirectionHook.jsx';
import './Header.css';

const Header = () => {
    const scrollDirection = useScrollDirection();
    const [activeCategory, setActiveCategory] = useState(null);

    const categories = [
        {
            name: "Skin Care",
            icon: <BsClipboard2HeartFill className="me-2 mt-1" />,
            menu: [
                {
                    items: [
                        "Tẩy Trang", "Sữa Rửa Mặt", "Mặt Nạ", "Tẩy Tế Bào Chết",
                        "Toner/Lotion", "Serum/Essence", "Chống Nắng", "Xịt khoáng",
                        "Kem Dưỡng", "Dưỡng Mắt/Mi", "Dưỡng Môi"
                    ]
                }
            ]
        },
        {
            name: "Body Care",
            icon: <GiAmpleDress className="me-2 mt-1" />,
            menu: [
                {
                    items: [
                        "Sữa Tắm", "Dưỡng Thể", "Tẩy Da Chết Body",
                        "Khử Mùi/Nước Hoa", "Dưỡng Da Tay/Chân", "Chăm Sóc Vùng Kín"
                    ]
                }
            ]
        },
        {
            name: "Hair Care",
            icon: <PiHairDryerFill className="me-2 mt-1" />,
            menu: [
                {
                    items: ["Dầu gội/xả", "Dưỡng tóc"]
                }
            ]
        },
        {
            name: "Dietary Supplement",
            icon: <GiMedicines className="me-2 mt-1" />,
            menu: [
                {
                    items: ["Băng Vệ Sinh", "Dung Dịch Vệ Sinh Phụ Nữ", "Bao Cao Su"]
                }
            ]
        },
        {
            name: "Make Up",
            icon: <GiLipstick className="me-2 mt-1" />,
            menu: [
                {
                    items: ["Son", "Kem nền/Cushion", "Kem lót", "Che khuyết điểm", "Tạo khối/Highlight",
                        "Phấn Phủ", "Phấn mắt", "Mascara", "Kẻ Mắt", "Xịt khóa nền", "Má hồng", ]
                }
            ]
        }
    ];

    return (
        <div className={`${scrollDirection === "down" ? "opacity-0" : "opacity-100"} transition-opacity duration-500 fixed top-0 left-0 right-0 z-50`}>
            <header className="flex justify-around items-center py-6 bg-white">
                <h2 className="text-4xl font-bold cursor-pointer" style={{ color: "#872341" }}>Nâu Cosmetic</h2>
                <div className="flex gap-2 search-bar">
                    <input type="text" placeholder="Tìm kiếm" className="border px-5 py-2 rounded-3xl" style={{ width: "90%" }} />
                    <button className="text-white px-4 rounded-3xl" style={{ backgroundColor: "#ab3556" }}>
                        <FaSearch />
                    </button>
                </div>
                <span className="text-3xl">🛒</span>
            </header>
            <nav className="flex justify-center items-center text-start py-3 shadow-md relative" style={{ backgroundColor: "#FFF0F5" }}>
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="category relative"
                        onMouseEnter={() => setActiveCategory(index)}
                        onMouseLeave={() => setActiveCategory(null)}
                    >
                        <p className="flex items-center cursor-pointer transition-colors duration-300 hover:text-pink-600">
                            {category.icon}
                            {category.name}
                        </p>

                        <div className={`absolute top-6.5 mt-3 bg-white shadow-lg p-6 z-50 w-full min-w-max flex gap-12 dropdown-menu
                                      transition-all duration-300 ease-in-out origin-top
                                      ${activeCategory === index ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'}`}>
                            {category.menu.map((section, idx) => (
                                <div key={idx} className="min-w-64 dropdown-section" style={{ color: "#a83354" }}>
                                    <ul>
                                        {section.items.map((item, itemIdx) => (
                                            <li key={itemIdx} className="py-1 hover:text-pink-700 cursor-pointer transition-colors duration-200 hover:bg-red-50">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default Header;