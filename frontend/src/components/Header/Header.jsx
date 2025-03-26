import { FaSearch, FaTimes } from "react-icons/fa";
import { GiLipstick, GiMedicines, GiAmpleDress } from "react-icons/gi";
import { BsClipboard2HeartFill } from "react-icons/bs";
import { PiHairDryerFill } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useScrollDirection } from "@hooks/useScrollDirectionHook.jsx";
import "./Header.css";
import { useCartStore } from "@components/Cart";
import { useSearchStore } from "./ZustandSearchStore";
import { Link } from "react-router-dom";
import categoriesApi from "@apis/categoriesApi.js";

const Header = () => {
  const scrollDirection = useScrollDirection();
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sử dụng Zustand store thay vì useState
  const searchText = useSearchStore((state) => state.searchText);
  const setSearchText = useSearchStore((state) => state.setSearchText);
  const clearSearchText = useSearchStore((state) => state.clearSearchText);

  // Map of category icons
  const categoryIcons = {
    "Chăm sóc da": <BsClipboard2HeartFill className="me-2 mt-1" />,
    "Chăm sóc tóc": <GiAmpleDress className="me-2 mt-1" />,
    "Chăm sóc cơ thể": <PiHairDryerFill className="me-2 mt-1" />,
    "Thực phẩm chức năng": <GiMedicines className="me-2 mt-1" />,
    "Đồ trang điểm": <GiLipstick className="me-2 mt-1" />,
  };

  // Default icon if category name doesn't match any in our map
  const defaultIcon = <BsClipboard2HeartFill className="me-2 mt-1" />;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories with their subcategories in a single API call
        const categoryResponse = await categoriesApi.getCategories({
          page: 1,
          limit: 100,
        });
        setCategories(categoryResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform categories to include icons and properly format the menu structure
  const formattedCategories = categories.map((category) => {
    return {
      cat_id: category.cat_id,
      cat_name: category.cat_name,
      icon: categoryIcons[category.cat_name] || defaultIcon,
      menu: [
        {
          items: (category.sub_category || []).map((sub) => ({
            id_subcat: sub.id_scat,
            scat_name: sub.scat_name,
            cat_id: sub.id_scat, // Using id_scat for the URL parameter
          })),
        },
      ],
    };
  });

  // const navigate = useNavigate();
  const toggleCartDrawer = useCartStore((state) => state.toggleCartDrawer);
  const cartItemsCount = useCartStore((state) => state.itemCount);

  const handleCartClick = (e) => {
    e.preventDefault();
    toggleCartDrawer();
  };

  return (
    <div
      className={`${scrollDirection === "down" ? "opacity-0" : "opacity-100"} fixed top-0 right-0 left-0 z-50 transition-opacity duration-500`}
    >
      <header className="flex items-center justify-around bg-white py-6">
        <Link className={"flex"} to="/">
          <img
            src="/logo_nonebg.png"
            alt="Nâu Cosmetic Logo"
            className="me-5 h-12"
          />
          <h2
            className="cursor-pointer text-4xl font-bold"
            style={{ color: "#5d4e3e" }}
          >
            Nâu Cosmetic
          </h2>
        </Link>
        <div className="search-bar relative flex gap-2">
          <input
            value={searchText}
            type="text"
            placeholder="Tìm kiếm sản phẩm, danh mục hay thương hiệu mong muốn..."
            className="rounded-3xl border px-5 py-2"
            style={{
              width: "90%",
              paddingRight: searchText ? "40px" : "12px", // Thêm padding bên phải khi có text
            }}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* Nút clear đã được điều chỉnh vị trí */}
          {searchText && (
            <button
              className="absolute top-1/2 right-23 -translate-y-1/2 z-10 bg-white text-gray-500 focus:ring-2 focus:ring-primary focus:outline-none"
              onClick={() => {
                clearSearchText();
              }}
            >
              <FaTimes />
            </button>
          )}

          <Link
            to={`/all_products${searchText ? `?search=${searchText}` : ""}`}
            className="flex items-center justify-center rounded-3xl px-4 text-white"
            style={{ backgroundColor: "#8D7B68" }}
          >
            <FaSearch />
          </Link>
        </div>
        <span
          onClick={(e) => {
            handleCartClick(e);
          }}
          className="relative cursor-pointer text-3xl select-none"
        >
          🛒
          {cartItemsCount > 0 && (
            <div className="absolute -top-0.5 left-6 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-center align-top text-[12px] text-white">
              {cartItemsCount}
            </div>
          )}
        </span>
      </header>
      {!loading && (
        <nav
            className="relative flex items-center justify-center py-1 text-start shadow-md"
            style={{ backgroundColor: "#f6eadc" }}
        >
          {formattedCategories.map((category, index) => (
                <div
                    key={category.cat_id}
                    className="category relative mx-4"
                    onMouseEnter={() => setActiveCategory(index)}
                    onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                      to={`/all_products?category=${category.cat_name}`}
                      className="flex cursor-pointer items-center py-2 transition-colors duration-300 hover:text-orange-800"
                  >
                    {category.icon}
                    {category.cat_name}
                  </Link>

                  <div
                      className={`dropdown-menu absolute top-6.5 z-50 mt-5 flex w-full min-w-max origin-top bg-white p-6 shadow-lg transition-all duration-300 ease-in-out ${
                          activeCategory === index ? "visible scale-y-100 opacity-100" : "invisible scale-y-0 opacity-0"
                      }`}
                  >
                    {category.menu.map((section, idx) => (
                        <div key={idx} className="dropdown-section min-w-64" style={{ color: "#41392f" }}>
                          <ul>
                            {section.items.map((item) => (
                                <li
                                    key={item.id_subcat}
                                    className="cursor-pointer py-1 transition-colors duration-200 hover:bg-amber-50 hover:text-orange-800"
                                >
                                  <Link to={`/all_products?category=${category.cat_name}&subcategory=${item.scat_name}`}>
                                    {item.scat_name}
                                  </Link>
                                </li>
                            ))}
                          </ul>
                        </div>
                    ))}
                  </div>
                </div>
            ))
          }
      </nav>
      )}
    </div>
  );
};

export default Header;
