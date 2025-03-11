import { FaSearch } from "react-icons/fa";
import { GiLipstick, GiMedicines, GiAmpleDress } from "react-icons/gi";
import { BsClipboard2HeartFill } from "react-icons/bs";
import { PiHairDryerFill } from "react-icons/pi";
import { useState } from "react";
import { useScrollDirection } from "../../hooks/useScrollDirectionHook.jsx";
import "./Header.css";
import { useCartStore } from "@components/Cart";
import { Link } from "react-router-dom";

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
            "Tẩy Trang",
            "Sữa Rửa Mặt",
            "Mặt Nạ",
            "Tẩy Tế Bào Chết",
            "Toner/Lotion",
            "Serum/Essence",
            "Chống Nắng",
            "Xịt khoáng",
            "Kem Dưỡng",
            "Dưỡng Mắt/Mi",
            "Dưỡng Môi",
          ],
        },
      ],
    },
    {
      name: "Body Care",
      icon: <GiAmpleDress className="me-2 mt-1" />,
      menu: [
        {
          items: [
            "Sữa Tắm",
            "Dưỡng Thể",
            "Tẩy Da Chết Body",
            "Khử Mùi/Nước Hoa",
            "Dưỡng Da Tay/Chân",
            "Chăm Sóc Vùng Kín",
          ],
        },
      ],
    },
    {
      name: "Hair Care",
      icon: <PiHairDryerFill className="me-2 mt-1" />,
      menu: [
        {
          items: ["Dầu gội/xả", "Dưỡng tóc"],
        },
      ],
    },
    {
      name: "Dietary Supplement",
      icon: <GiMedicines className="me-2 mt-1" />,
      menu: [
        {
          items: ["Băng Vệ Sinh", "Dung Dịch Vệ Sinh Phụ Nữ", "Bao Cao Su"],
        },
      ],
    },
    {
      name: "Make Up",
      icon: <GiLipstick className="me-2 mt-1" />,
      menu: [
        {
          items: [
            "Son",
            "Kem nền/Cushion",
            "Kem lót",
            "Che khuyết điểm",
            "Tạo khối/Highlight",
            "Phấn Phủ",
            "Phấn mắt",
            "Mascara",
            "Kẻ Mắt",
            "Xịt khóa nền",
            "Má hồng",
          ],
        },
      ],
    },
  ];

  const toggleCartDrawer = useCartStore((state) => state.toggleCartDrawer);

  const handleCartClick = (e) => {
    e.preventDefault();
    toggleCartDrawer();
  };

  return (
    <div
      className={`${scrollDirection === "down" ? "opacity-0" : "opacity-100"} fixed top-0 right-0 left-0 z-50 transition-opacity duration-500`}
    >
      <header className="flex items-center justify-around bg-white py-6">
        <Link to="/">
          <h2
            className="cursor-pointer text-4xl font-bold"
            style={{ color: "#5d4e3e" }}
          >
            Nâu Cosmetic
          </h2>
        </Link>
        <div className="search-bar flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="rounded-3xl border px-5 py-2"
            style={{ width: "90%" }}
          />

          <button
            className="rounded-3xl px-4 text-white"
            style={{ backgroundColor: "#8D7B68" }}
          >
            <FaSearch />
          </button>
        </div>
        <span
          onClick={(e) => {
            handleCartClick(e);
          }}
          className="cursor-pointer text-3xl select-none"
        >
          🛒
        </span>
      </header>
      <nav
        className="relative flex items-center justify-center py-3 text-start shadow-md"
        style={{ backgroundColor: "#f6eadc" }}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="category relative"
            onMouseEnter={() => setActiveCategory(index)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <p className="flex cursor-pointer items-center transition-colors duration-300 hover:text-orange-800">
              {category.icon}
              {category.name}
            </p>

            <div
              className={`dropdown-menu absolute top-6.5 z-50 mt-3 flex w-full min-w-max origin-top gap-12 bg-white p-6 shadow-lg transition-all duration-300 ease-in-out ${activeCategory === index ? "visible scale-y-100 opacity-100" : "invisible scale-y-0 opacity-0"}`}
            >
              {category.menu.map((section, idx) => (
                <div
                  key={idx}
                  className="dropdown-section min-w-64"
                  style={{ color: "#41392f" }}
                >
                  <ul>
                    {section.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="cursor-pointer py-1 transition-colors duration-200 hover:bg-amber-50 hover:text-orange-800"
                      >
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
