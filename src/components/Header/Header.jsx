import React from 'react';
import { FaSearch } from "react-icons/fa";
import { GiLipstick, GiMedicines, GiAmpleDress   } from "react-icons/gi";
import { BsClipboard2HeartFill } from "react-icons/bs";
import { PiHairDryerFill } from "react-icons/pi";
import { useScrollDirection } from '../../hooks/useScrollDirectionHook.jsx';
import './Header.css';

const Header = ({ toggleSidebar }) => {
    const scrollDirection = useScrollDirection();
    return (
        <div className={` ${scrollDirection === "down" ? "opacity-0" : "opacity-100"} transition-opacity duration-500 fixed top-0 left-0 right-0 z-100`} >
            <header className="flex justify-around items-center py-6 bg-white">
                <h2 className="text-4xl font-bold cursor-pointer" style={{ color: "#872341"}}>Nâu Cosmetic</h2>
                <div className={"flex gap-2 search-bar"}>
                    <input type="text-3xl" placeholder="Tìm kiếm" className="border px-5 py-2 rounded-3xl" style={{ width: "90%"}} />
                    <button className="text-white px-4 rounded-3xl" style={{ backgroundColor: "#ab3556"}}>
                        <FaSearch />
                    </button>
                </div>
                <span className="text-3xl">🛒</span>
            </header>
            <nav className="flex justify-center items-center text-start py-3 shadow-md" style={{ backgroundColor: "#FFF0F5"}}>
                <p className="category"><BsClipboard2HeartFill className={"me-2 mt-1"}/>Skin Care</p>
                <p className="category"><GiAmpleDress className={"me-2 mt-1"}/>Body Care</p>
                <p className="category"><PiHairDryerFill className={"me-2 mt-1"}/>Hair Care</p>
                <p className="category"><GiMedicines className={"me-2 mt-1"}/>Dietary Supplement</p>
                <p className="category"><GiLipstick className={"me-2 mt-1"}/>Make Up</p>

            </nav>
        </div>
    );
};

export default Header;