import React, {useState} from 'react';
import {Edit, Eye, PlusCircle, Save, Search, Trash2, X} from "lucide-react";

const Category = () => {
    const [categories, setCategory] = useState([
        { id: 1, name: 'Face', count: 10 },
        { id: 2, name: 'Body', count: 5 },
        { id: 3, name: 'Hair', count: 7 },
        { id: 4, name: 'Makeup', count: 15 },
    ]);

    // State for form and UI
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
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


    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && currentCategory) {
            // Update existing Category
            setCategory(categories.map(category =>
                category.id === currentCategory.id ? { ...newCategory, id: currentCategory.id } : category
            ));
        } else {
            // Add new Category
            const categoryId = Math.max(0, ...categories.map(p => p.id)) + 1;
            setCategory([...categories, { ...newCategory, id: categoryId }]);
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
            setCategory(categories.filter(category => category.id !== id));
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
                <div className={"flex justify-between items-center mb-6"}>
                    <button
                        onClick={() => {setFormOpen(true); setIsEditing(false);}}
                        className="flex items-center bg-white text-pink-600 px-4 py-2 rounded-md shadow hover:bg-gray-100"
                    >
                        <PlusCircle className="mr-2" size={18} />
                        Add Category
                    </button>
                    <div className={`text-right ${categories.length > 0 ? 'block' : 'hidden'}`}>
                        <span className="text-gray-600">Showing {categories.length} categories</span>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-lg shadow overflow-x-auto text-left">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead style={{ backgroundColor: '#D14D72' }}>
                        <tr>
                            <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Category Name</th>
                            <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Category Count</th>
                            <th className="px-6 py-3 font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length > 0 ? (
                            categories.map(category => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="font-medium text-gray-900">{category.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {category.count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(category)} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
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
        </div>
    );
};

export default Category;