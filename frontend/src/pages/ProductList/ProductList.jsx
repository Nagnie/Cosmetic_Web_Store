import { useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "@hooks/useQueryString.jsx";
import productsApi from "@apis/productsApi.js";
import { Pagination } from "antd";
import { numberToArray } from "@utils/utils.js";
import ProductCardSkeleton from "@components/ProductCard/ProductCardSkeleton.jsx";

const LIMIT = 9;

const ProductListingPage = () => {
  // State để lưu trạng thái hiển thị filter trên mobile
  const [showFilter, setShowFilter] = useState(false);
  // State cho bộ lọc
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    sortBy: "newest",
  });

  const queryString = useQueryString();
  const [currentPage, setCurrentPage] = useState(+queryString.page || 1);

  const { data, isLoading } = useQuery({
    queryKey: ["products", currentPage],
    queryFn: () => productsApi.getProducts({ page: currentPage }),
  });

  const products = data?.data?.data || [];

  const perPage = data?.data?.limit || LIMIT;

  const totalItems = data?.data?.total_items || 0;

  console.log(">>> data", data);

  // Hàm xử lý khi thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Lọc và sắp xếp sản phẩm dựa trên bộ lọc
  const filteredProducts = products
    .filter((product) => {
      // Lọc theo danh mục
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }

      // Lọc theo khoảng giá
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
      // Sắp xếp theo bộ lọc
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
      // Mặc định sắp xếp theo mới nhất (theo id trong ví dụ này)
      return b.id - a.id;
    });

  // Toggle hiển thị filter trên mobile
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="container mx-auto mt-40 mb-20 py-8">
      <h1
        className="mb-15 text-center text-3xl font-bold"
        style={{ color: "#911f3f" }}
      >
        Danh Sách Sản Phẩm
      </h1>

      {/* Button hiển thị filter chỉ hiện trên mobile */}
      <button
        className="mb-4 w-full rounded-lg bg-pink-100 px-4 py-2 font-semibold text-pink-800 lg:hidden"
        onClick={toggleFilter}
      >
        {showFilter ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
      </button>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Cột filter - ẩn trên mobile trừ khi được toggle */}
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

        {/* Cột danh sách sản phẩm */}
        <div className="lg:w-3/4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
              {numberToArray(LIMIT).map((item) => (
                <ProductCardSkeleton key={item} />
              ))}
            </div>
          ) : null}
          {filteredProducts.length === 0 && !isLoading ? (
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
                  onChange={(page) => {
                    setCurrentPage(+page);

                    window.scrollTo({ top: 0, behavior: "smooth" });
                    window.history.pushState({}, "", `?page=${page}`);
                  }}
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
