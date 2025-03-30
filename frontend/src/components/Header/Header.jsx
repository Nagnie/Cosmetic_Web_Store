import {FaBars, FaSearch, FaTimes} from "react-icons/fa";
import { GiLipstick, GiMedicines, GiAmpleDress } from "react-icons/gi";
import { BsClipboard2HeartFill } from "react-icons/bs";
import { PiCowboyHatFill } from "react-icons/pi";
import { PiHairDryerFill } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useScrollDirection } from "@hooks/useScrollDirectionHook.jsx";
import { useCartStore } from "@components/Cart";
import { useSearchStore } from "./ZustandSearchStore";
import { Link } from "react-router-dom";
import categoriesApi from "@apis/categoriesApi.js";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

const Header = () => {
  const scrollDirection = useScrollDirection();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sử dụng Zustand store thay vì useState
  const searchText = useSearchStore((state) => state.searchText);
  const setSearchText = useSearchStore((state) => state.setSearchText);

  // Map of category icons
  const categoryIcons = {
    "Chăm sóc da": <BsClipboard2HeartFill className="me-2 mt-1" />,
    "Chăm sóc tóc": <PiHairDryerFill className="me-2 mt-1" />,
    "Chăm sóc cơ thể": <GiAmpleDress className="me-2 mt-1" />,
    "Thực phẩm chức năng": <GiMedicines className="me-2 mt-1" />,
    "Đồ trang điểm": <GiLipstick className="me-2 mt-1" />,
    "Mỹ phẩm nam": <PiCowboyHatFill className="me-2 mt-1" />,
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

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
      <div
          className={`${scrollDirection === "down" && !sidebarOpen? "opacity-0" : "opacity-100"} shadow-md fixed top-0 right-0 left-0 z-50 transition-opacity duration-500`}
      >
        {/* Sidebar overlay - visible only when sidebar is open */}
        {sidebarOpen && (
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={closeSidebar}
            />
        )}

        {/* Sidebar component */}
        <div
            className={`fixed top-0 left-0 h-full z-50 bg-white shadow-xl transition-all duration-300 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ width: "340px" }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl px-2 font-bold text-primary">Danh mục</h2>
            <button
                onClick={closeSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close sidebar"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="overflow-y-auto h-full text-left" style={{ maxHeight: "calc(100vh - 60px)" }}>
            <Sidebar
                className="border-0"
                backgroundColor="white"
                width="340px"
                collapsed={false}
            >
              <Menu>
                {!loading &&
                    formattedCategories.map((category) => (
                        <SubMenu
                            key={category.cat_id}
                            label={category.cat_name}
                            icon={category.icon}
                            className="font-semibold"
                        >
                          {/* Link to show all products in this category */}
                          <MenuItem
                              component={<Link to={`/all_products?category=${encodeURIComponent(category.cat_name)}`} />}
                              className="ps-7 font-medium"
                          >
                            Tất cả
                          </MenuItem>

                          {/* Show all subcategories */}
                          {category.menu[0].items.map((item) => (
                              <MenuItem
                                  key={item.id_subcat}
                                  component={
                                    <Link
                                        to={`/all_products?category=${encodeURIComponent(category.cat_name)}&subcategory=${encodeURIComponent(item.scat_name)}`}
                                    />
                                  }
                                  className="ps-7 font-medium"
                              >
                                {item.scat_name}
                              </MenuItem>
                          ))}
                        </SubMenu>
                    ))
                }

                {loading && (
                    <div className="flex justify-center items-center h-32">
                      <p>Đang tải danh mục...</p>
                    </div>
                )}
              </Menu>
            </Sidebar>
          </div>
        </div>

        <header className="grid lg:grid-cols-7 md:grid-cols-6 grid-cols-5 items-center justify-around bg-white py-6 md:py-8">
          <div className={"lg:col-span-3 md:col-span-3 col-span-2 flex items-center justify-evenly"}>
            <button
                id="menu-button"
                className="focus:outline-none"
                onClick={toggleSidebar}
                aria-label="Menu"
            >
              <FaBars size={20}/>
            </button>
            <Link className={"flex"} to="/">
              <img
                  src="/logo_nonebg.png"
                  alt="Nâu Cosmetic Logo"
                  className="lg:me-5 md:me-3 h-15 md:h-12 lg:h-15"
              />
              <h2
                  className="cursor-pointer lg:text-5xl font-bold md:inline md:text-4xl hidden "
                  style={{ color: "#5d4e3e" }}
              >
                Nâu Cosmetic
              </h2>
            </Link>
          </div>
          <div className="search-bar relative flex gap-2 md:col-span-2 lg:col-span-3 col-span-2">
            <input
                value={searchText}
                type="text"
                placeholder="Tìm kiếm sản phẩm, danh mục hay thương hiệu mong muốn..."
                className="rounded-3xl border px-4 md:px-5 py-2 focus:outline-none focus:ring-primary focus:ring-2" // Added focus styles
                style={{
                  width: "95%",
                  paddingRight: searchText ? "40px" : "12px", // Thêm padding bên phải khi có text
                }}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <Link
                to={`/all_products${searchText ? `?search=${searchText}` : ""}`}
                className="flex items-center justify-center rounded-3xl px-4 text-white focus:outline-none focus:ring-primary-light focus:ring-2"
                style={{ backgroundColor: "#8D7B68" }}
            >
              <FaSearch />
            </Link>
          </div>
          <span
              onClick={(e) => {
                handleCartClick(e);
              }}
              className="cursor-pointer text-3xl select-none"
          >
          🛒
            {cartItemsCount > 0 && (
                <div className="absolute -top-0.5 left-6 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-center align-top text-[12px] text-white">
                  {cartItemsCount}
                </div>
            )}
        </span>
        </header>
      </div>
  );
};

export default Header;