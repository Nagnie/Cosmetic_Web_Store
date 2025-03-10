import React, {useState} from 'react';
import CategoryTable from "@components/Admin/Category/CategoryTable.jsx";
import SubCategoryTable from "@components/Admin/Category/SubCategoryTable.jsx";

const Category = () => {
    return (
        <div className="container mx-auto px-5">
            <div className={"grid grid-cols-1 sm:grid-cols-5 gap-10"}>
                <div className="mb-8 sm:col-span-2">
                    <CategoryTable />
                </div>
                <div className="mb-8 sm:col-span-3">
                    <SubCategoryTable />
                </div>
            </div>
        </div>
    )
};

export default Category;