import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ toggleSidebar }) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-100">
            <header className="flex justify-between items-center px-10 py-4 shadow-md bg-white">
                <div onClick={toggleSidebar} className="cursor-pointer text-xl">☰</div>
                <h2 className="text-xl font-bold text-red-950">Nâu Cosmetic</h2>
                <div className={"flex gap-2"} style={{ width: "30%" }}>
                    <input type="text" placeholder="Search" className="border px-4 rounded-2xl" style={{ width: "80%"}} />
                    <button className="text-white p-1 rounded-2xl">Search</button>
                </div>
                <span className="text-xl">🛒</span>
            </header>
        </div>
    );
};

export default Header;