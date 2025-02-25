import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search, X, Save, Eye } from 'lucide-react';
import { Product, Category, Brand } from '../../components/Admin';
import './Admin.css';

const CosmeticAdminPage = () => {
    const [activeTab, setActiveTab] = useState('Product');
    const renderComponent = () => {
        switch (activeTab) {
            case 'Product':
                return <Product />;
            case 'Category':
                return <Category />;
            case 'Brand':
                return <Brand />;
            default:
                return <Product  />;
        }
    };

    return (
        <div className="min-w-screen min-h-screen mx-auto">
            {/* Header */}
            <header className="p-4 mb-5 shadow-md" style={{ background: 'linear-gradient(105deg, #D14D72, #ffe9ef)' }}>
                <div className="container mx-auto flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">Cosmetic Store Admin</h2>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex border-b">
                {['Product', 'Category', 'Brand'].map(tab => (
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