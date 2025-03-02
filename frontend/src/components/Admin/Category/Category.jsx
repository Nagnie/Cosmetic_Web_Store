import React, {useState} from 'react';
import {Edit, Eye, PlusCircle, Save, Search, Trash2, X} from "lucide-react";

const Category = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Skin Care', subCategoryCount: 5 },
        { id: 2, name: 'Hair Care', subCategoryCount: 2 },
        { id: 3, name: 'Body Care', subCategoryCount: 3 },
        { id: 4, name: 'Makeup', subCategoryCount: 4 },
        { id: 5, name: 'Dietary Supplements', subCategoryCount: 2 },
    ]);

    const [subCategories, setSubCategories] = useState([
        { id: 1, name: 'Sữa rửa mặt', mainCategory: 'Skin Care', productCount: 10 },
        { id: 2, name: 'Tẩy trang', mainCategory: 'Skin Care', productCount: 8 },
        { id: 3, name: 'Dầu gội/xả', mainCategory: 'Hair Care', productCount: 7 },
        { id: 4, name: 'Sữa tắm', mainCategory: 'Body Care', productCount: 5 },
    ]);

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [formOpenSub, setFormOpenSub] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: '',
        count: 0,
    });
    const [isEditing, setIsEditing] = useState(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({
            ...newCategory,
            [name]: value,
        });
    };

    // Filter Categorys based on search term
    const filteredCategory = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Handle form submission for adding or updating Category
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && currentCategory) {
            // Update existing Category
            setCategories(categories.map(category =>
                category.id === currentCategory.id ? { ...newCategory, id: currentCategory.id } : category
            ));
        } else {
            // Add new Category
            const categoryId = Math.max(0, ...categories.map(p => p.id)) + 1;
            setCategories([...categories, { ...newCategory, id: categoryId }]);
        }

        // Reset form
        resetForm();
    };

    // Handle form submission for adding or updating Subcategory
    const handleSubmitSub = (e) => {
        e.preventDefault();
        if (isEditing && currentCategory) {
            // Update existing Subcategory
            setSubCategories(subCategories.map(subCategory =>
                subCategory.id === currentCategory.id ? {...newCategory, id: currentCategory.id} : subCategory
            ));
        } else {
            // Add new Subcategory
            const subCategoryId = Math.max(0, ...subCategories.map(p => p.id)) + 1;
            setSubCategories([...subCategories, { ...newCategory, id: subCategoryId }]);
        }
        // Reset form
        resetForm();
    };

    // View category details
    const handleView = (category) => {
        setCurrentCategory(category);
        setViewOpen(true);
    };

    // Edit Category
    const handleEdit = (category) => {
        setCurrentCategory(category);
        setNewCategory(category);
        setIsEditing(true);
        setFormOpen(true);
    };

    // Delete Category
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(category => category.id !== id));
        }
    };

    // Reset form
    const resetForm = () => {
        setNewCategory({
            name: '',
            count: 0,
        });
        setCurrentCategory(null);
        setIsEditing(false);
        setFormOpen(false);
        setViewOpen(false);
    };

    return (
        <div>
            <main className={"container mx-auto px-5"}>
                {/* Search and Filter */}
                <div className="relative">
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>
                <div className={"grid grid-cols-1 sm:grid-cols-5 gap-5 mb-6"}>
                    <div className={"sm:col-span-2"}>
                        <button
                            onClick={() => {setFormOpen(true); setIsEditing(false);}}
                            className="flex items-center bg-white text-pink-600 px-4 py-2 rounded-md shadow hover:bg-gray-100"
                        >
                            <PlusCircle className="mr-2" size={18} />
                            Add Category
                        </button>
                    </div>
                    <div className={"sm:col-span-3"}>
                        <button
                            onClick={() => {setFormOpenSub(true); setIsEditing(false);}}
                            className="flex items-center bg-white text-pink-600 px-4 py-2 rounded-md shadow hover:bg-gray-100"
                        >
                            <PlusCircle className="mr-2" size={18} />
                            Add Subcategory
                        </button>
                    </div>
                    {/*<div className={`text-right ${categories.length > 0 ? 'block' : 'hidden'}`}>*/}
                    {/*    <span className="text-gray-600">Showing {categories.length} categories</span>*/}
                    {/*</div>*/}
                </div>

                <div className={"grid grid-cols-1 sm:grid-cols-5 gap-5"}>
                    {/* Categories Table */}
                    <div className="rounded-lg shadow overflow-x-auto text-left mb-8 sm:col-span-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr style={{ backgroundColor: '#D14D72' }} className={"text-white"}>
                                <th className="px-6 py-3 font-medium">Category Name</th>
                                <th className="px-6 py-3 font-medium">Subcategory Count</th>
                                <th className={"px-6 py-3 font-medium"}>Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map(category => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{category.subCategoryCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                            <button onClick={() => handleView(category)} className="text-green-600 hover:text-green-900">
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Subcategories Table */}
                    <div className="rounded-lg shadow overflow-x-auto text-left sm:col-span-3">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr style={{ backgroundColor: '#D14D72' }} className={"text-white"}>
                                <th className="px-6 py-3 font-medium">Subcategory Name</th>
                                <th className="px-6 py-3 font-medium">Main Category</th>
                                <th className="px-6 py-3 font-medium">Product Count</th>
                                <th className={"px-6 py-3 font-medium"}>Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {subCategories.map(subCategory => (
                                <tr key={subCategory.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{subCategory.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                                            {subCategory.mainCategory}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{subCategory.productCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Edit size={18} />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add/Edit Category Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto px-2">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-5 text-left">
                                    <div>
                                        <label className="block font-medium text-gray-700 mb-3">Category Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newCategory.name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 border rounded hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white rounded hover:opacity-90"
                                        style={{ background: '#D14D72' }}
                                    >
                                        <Save className="inline mr-2" size={16} />
                                        {isEditing ? 'Update Category' : 'Add Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Category Details Modal */}
            {viewOpen && (
                <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto px-2">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Category Details</h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="text-left">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-3">Category Name</label>
                                    <input
                                        type="text"
                                        value={currentCategory.name}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        readOnly
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block font-medium text-gray-700 mb-3">Subcategory</label>
                                    <select
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        value={currentCategory.subCategoryCount}
                                        readOnly
                                        >
                                        {subCategories.map(subCategory => (
                                            <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;