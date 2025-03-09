import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search, X, Save, Eye } from 'lucide-react';
import { Product, Category, Brand, Order } from '../../components/Admin';
import './Admin.css';
import {useNavigate} from "react-router-dom";

const CosmeticAdminPage = () => {
    const [activeTab, setActiveTab] = useState('Product');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isAdmin"); // Xóa trạng thái đăng nhập
        navigate("/admin/login"); // Chuyển hướng về trang đăng nhập
    };
    const renderComponent = () => {
        switch (activeTab) {
            case 'Product':
                return <Product />;
            case 'Category':
                return <Category />;
            case 'Brand':
                return <Brand />;
            case 'Order':
                return <Order />;
            default:
                return <Product  />;
        }
    };

    return (
        <div className="min-w-screen min-h-screen mx-auto">
            {/* Header */}
            <header className="p-4 mb-5 shadow-md flex" style={{ background: 'linear-gradient(105deg, #D14D72, #ffe9ef)' }}>
                <div className="container mx-auto flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">Cosmetic Store Admin</h2>
                    <button className={"mx-5 text-white px-4 py-1 shadow rounded-3xl"}
                            onClick={handleLogout} style={{ backgroundColor: "#c42e57"}}>Đăng xuất</button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex border-b">
                {['Product', 'Category', 'Brand', 'Order'].map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-2 w-1/3 text-center text-lg font-medium 
                        ${activeTab === tab ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {/* Content */}
            <div className="p-4 bg-white rounded-lg mt-4">
                {renderComponent()}
            </div>
        </div>
    );
};

export default CosmeticAdminPage;