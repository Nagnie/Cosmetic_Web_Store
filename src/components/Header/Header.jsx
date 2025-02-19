import React from 'react';
import { FaSearch } from "react-icons/fa";
import { useScrollDirection } from '../../hooks/useScrollDirectionHook.jsx';
import './Header.css'; // Bạn sẽ cần file CSS này

const Header = ({ toggleSidebar }) => {
    const scrollDirection = useScrollDirection();
    return (
        <div className={` ${scrollDirection === "down" ? "opacity-0" : "opacity-100"} transition-opacity duration-500 fixed top-0 left-0 right-0 z-100`} >
            <header className="flex justify-between items-center px-30 py-6 bg-white">
                <h2 className="text-4xl font-bold cursor-pointer" style={{ color: "#872341"}}>Nâu Cosmetic</h2>
                <div className={"flex gap-2"} style={{ width: "40%" }}>
                    <input type="text-3xl" placeholder="Tìm kiếm" className="border px-5 py-3 rounded-3xl" style={{ width: "90%"}} />
                    <button className="text-white px-4 rounded-3xl" style={{ backgroundColor: "#ab3556"}}>
                        <FaSearch />
                    </button>
                </div>
                <span className="text-3xl">🛒</span>
            </header>
            <div className="flex justify-between items-center px-30 py-2 shadow-md" style={{ backgroundColor: "#FFF0F5"}}>
                <button onClick={toggleSidebar} className="px-0" style={{ padding: "0px", color: "#872341"}}>
                    <span className={"me-2"}>☰</span> Danh mục sản phẩm
                </button>
                <nav className="flex gap-4">
                    <a href="#" className="text-lg" style={{ color: "#872341"}}>Home</a>
                    <a href="#" className="text-lg" style={{ color: "#872341"}}>Shop</a>
                    <a href="#" className="text-lg" style={{ color: "#872341"}}>About</a>
                    <a href="#" className="text-lg" style={{ color: "#872341"}}>Contact</a>
                </nav>
            </div>
        </div>
    );
};

export default Header;