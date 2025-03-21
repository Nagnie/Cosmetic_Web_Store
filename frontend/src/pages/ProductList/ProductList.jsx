import { useEffect } from "react";
import { Pagination } from "antd";
import { useAllCategories } from "@hooks/useCategoryQueries.js";
import { useAllBrands } from "@hooks/useBrandQueries.js";
import FilterPanel from "./components/FilterPanel.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import ResultSummary from "./components/ResultSummary.jsx";
import { useProductFilters } from "@hooks/useProductFilters.js";
import { useProductData } from "@hooks/useProductData.js";
import "./ProductList.css";

const ProductListingPage = () => {
  // Sử dụng custom hooks
  const {
    filters,
    currentPage,
    showFilter,
    queryParams,
    urlParams,
    handleFilterChange,
    handlePageChange,
    toggleFilter,
    MIN_MAX_PRICE,
  } = useProductFilters();

  const { products, perPage, totalItems, isLoading } = useProductData(
    queryParams,
    currentPage,
  );

  // Fetch categories và brands cho filter
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useAllCategories();
  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useAllBrands();

  // Cuộn về đầu trang khi chuyển trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="container mx-auto mt-40 mb-20 py-8">
      <h1
        className="mb-10 text-center text-3xl font-bold text-primary-deepest"
      >
        Danh Sách Sản Phẩm
      </h1>

      <ResultSummary
        isLoading={isLoading}
        totalItems={totalItems}
        searchParam={urlParams.searchParam}
      />

      {/* Nút hiện/ẩn filter cho mobile */}
      <button
        className="mb-4 w-full rounded-lg bg-pink-100 px-4 py-2 font-semibold text-pink-800 lg:hidden"
        onClick={toggleFilter}
      >
        {showFilter ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
      </button>

      <div className="flex flex-col gap-2 md:gap-4 lg:flex-row lg:gap-5 xl:gap-10">
        {/* Cột filter */}
        <div className={`lg:w-1/4 ${showFilter ? "block" : "hidden"} lg:block`}>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
            isLoading={categoriesLoading}
            error={categoriesError}
            minMaxPrice={MIN_MAX_PRICE}
            brands={brands}
            brandsLoading={brandsLoading}
            brandsError={brandsError}
          />
        </div>

        {/* Cột danh sách sản phẩm */}
        <div className="lg:w-3/4">
          <ProductGrid products={products} isLoading={isLoading} />

          {!isLoading && products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                className="custom-pagination"
                showQuickJumper
                current={currentPage}
                total={totalItems}
                pageSize={perPage}
                onChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
