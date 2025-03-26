import React, { useState, useEffect } from 'react';
import { Product, Category, Brand, Order, Combo, Discount } from '../../components/Admin';
import './Admin.css';
import {useNavigate} from "react-router-dom";
import ChangePasswordModal from "@pages/Admin/ChangePassword.jsx";

const CosmeticAdminPage = () => {
    const [activeTab, setActiveTab] = useState('Product');
    const navigate = useNavigate();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

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
                case 'Combo':
                    return <Combo />;
                    case 'Discount':
                        return <Discount />;
            default:
                return <Product  />;
        }
    };
    // #D14D72, #ffe9ef
    return (
        <div className="min-w-screen min-h-screen mx-auto">
            {/* Header */}
            <header className="p-4 mb-5 shadow-md flex" style={{ backgroundColor: "#D14D72" }}>
                <div className="container mx-auto flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">Cosmetic Store Admin</h2>
                    <div>
                        <button className={"text-pink-800 px-4 py-1 shadow rounded-3xl"}
                                style={{ backgroundColor: "#ffe9ef"}}
                                onClick={() => setShowChangePasswordModal(true)}
                        >
                            Đổi mật khẩu
                        </button>
                        <button
                            className={"ms-4 text-pink-800 px-4 py-1 shadow rounded-3xl"}
                            onClick={handleLogout} style={{ backgroundColor: "#ffe9ef"}}
                        >
                            Đăng xuất
                        </button>
                    </div>

                </div>
            </header>

            {/* Tabs */}
            <div className="flex border-b">
                {['Product', 'Category', 'Brand', 'Order', 'Discount', 'Combo'].map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-2 w-1/3 text-center text-lg font-medium 
                        ${activeTab === tab ? 'bg-pink-100 text-pink-700' : 'bg-white text-gray-500'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {/* Content */}
            <div className="p-4 rounded-lg mt-4">
                {renderComponent()}
            </div>
            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
            />
        </div>
    );
};

export default CosmeticAdminPage;