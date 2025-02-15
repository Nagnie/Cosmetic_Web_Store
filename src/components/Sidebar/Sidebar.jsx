import React from 'react';

const Sidebar = ({ isOpen, closeSidebar }) => {
    return (
        <div className={` shadow  fixed top-0 left-0 w-64 z-10 h-full bg-white p-5 transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div onClick={closeSidebar} className="absolute cursor-pointer top-4 right-4 text-xl">✖</div>
            <ul className="mt-15">
                <li className="p-2 hover:font-bold cursor-pointer text-xl">Skincare</li>
                <li className="p-2 hover:font-bold cursor-pointer text-xl">Body Care</li>
                <li className="p-2 hover:font-bold cursor-pointer text-xl">Hair Care</li>
                <li className="p-2 hover:font-bold cursor-pointer text-xl">Supplements</li>
            </ul>
        </div>
    );
};

export default Sidebar;