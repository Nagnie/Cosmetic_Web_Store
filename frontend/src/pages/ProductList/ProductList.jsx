import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "@hooks/useQueryString.jsx";
import productsApi from "@apis/productsApi.js";
import { Pagination } from "antd";
import { numberToArray } from "@utils/utils.js";
import ProductCardSkeleton from "@components/ProductCard/ProductCardSkeleton.jsx";

const LIMIT = 9;

const ProductListingPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    sortBy: "newest",
  });

  const queryString = useQueryString();
  const brandName = queryString.brand;
  const categoryParam = queryString.category;
  const [currentPage, setCurrentPage] = useState(+queryString.page || 1);

  // Unified query function to handle all product fetching scenarios
  const fetchProducts = async () => {
    if (brandName) {
      return productsApi.getProductsByBrandName(brandName, {
        page: currentPage,
      });
    } else if (categoryParam) {
      return productsApi.getProductsByCategoryName(categoryParam, {
        pageParam: currentPage,
      });
    } else {
      return productsApi.getProducts({ page: currentPage });
    }
  };

  // Single query that adapts based on params
  const { data, isLoading } = useQuery({
    queryKey: ["products", brandName, categoryParam, currentPage],
    queryFn: fetchProducts,
  });

  // Unified data extraction
  const products = data?.data?.data?.products || data?.data?.data || [];
  const perPage = data?.data?.limit || +data?.data?.data?.limit || LIMIT;
  const totalItems =
    data?.data?.total_items || +data?.data?.data?.total_items || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Apply client-side filtering
  const applyFilters = (products) => {
    return products
      .filter((product) => {
        // Category filter
        if (
          filters.category !== "all" &&
          product.category !== filters.category
        ) {
          return false;
        }

        // Price range filter
        if (filters.priceRange !== "all") {
          const price = parseInt(product.price.replace(/\./g, ""));
          if (filters.priceRange === "under300" && price >= 300000) {
            return false;
          } else if (
            filters.priceRange === "300to700" &&
            (price < 300000 || price > 700000)
          ) {
            return false;
          } else if (filters.priceRange === "over700" && price <= 700000) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by filter
        if (filters.sortBy === "priceLow") {
          return (
            parseInt(a.price.replace(/\./g, "")) -
            parseInt(b.price.replace(/\./g, ""))
          );
        } else if (filters.sortBy === "priceHigh") {
          return (
            parseInt(b.price.replace(/\./g, "")) -
            parseInt(a.price.replace(/\./g, ""))
          );
        }
        // Default sort by newest
        return b.id - a.id;
      });
  };

  const filteredProducts = applyFilters(products);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(+page);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update URL with page number and preserve other query parameters
    const url = new URL(window.location);
    url.searchParams.set("page", page);
    window.history.pushState({}, "", url);
  };

  return (
    <div className="container mx-auto mt-40 mb-20 py-8">
      <h1
        className="mb-10 text-center text-3xl font-bold"
        style={{ color: "#911f3f" }}
      >
        Danh Sách Sản Phẩm
      </h1>

      {!isLoading && (
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            Có{" "}
            <span className="font-semibold text-gray-800">
              {totalItems} sản phẩm
            </span>{" "}
            cho tìm kiếm
          </p>
        </div>
      )}

      {/* Filter toggle button for mobile */}
      <button
        className="mb-4 w-full rounded-lg bg-pink-100 px-4 py-2 font-semibold text-pink-800 lg:hidden"
        onClick={toggleFilter}
      >
        {showFilter ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
      </button>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Filter column */}
        <div
          className={`lg:w-1/4 ${showFilter ? "block" : "hidden"} h-fit rounded-lg bg-pink-50 p-4 lg:block`}
        >
          <h2 className="mb-4 text-xl font-semibold">Bộ lọc</h2>

          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-700">
              Danh mục
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="clothing">Quần áo</option>
              <option value="shoes">Giày dép</option>
              <option value="accessories">Phụ kiện</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-700">
              Khoảng giá
            </label>
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="under300">Dưới 300.000 VNĐ</option>
              <option value="300to700">300.000 - 700.000 VNĐ</option>
              <option value="over700">Trên 700.000 VNĐ</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-700">
              Sắp xếp theo
            </label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="priceLow">Giá thấp đến cao</option>
              <option value="priceHigh">Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Product listing column */}
        <div className="lg:w-3/4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
              {numberToArray(LIMIT).map((item) => (
                <ProductCardSkeleton key={item} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-600">
                Không tìm thấy sản phẩm phù hợp với bộ lọc.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id_pro} product={product} />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Pagination
                  showQuickJumper
                  current={currentPage}
                  total={totalItems}
                  pageSize={perPage}
                  onChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
