import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "@hooks/useQueryString.jsx";
import { Pagination } from "antd";

import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import ProductCardSkeleton from "@components/ProductCard/ProductCardSkeleton.jsx";
import productsApi from "@apis/productsApi.js";
import { numberToArray } from "@utils/utils.js";
import { useAllCategories } from "@hooks/useCategoryQueries.js";

const LIMIT = 9;

// Tách các component con để cải thiện tính mô-đun và khả năng tái sử dụng
const FilterPanel = ({
  filters,
  onFilterChange,
  categories,
  isLoading,
  error,
}) => (
  <div className="h-fit rounded-lg bg-pink-50 p-4">
    <h2 className="mb-4 text-xl font-semibold">Bộ lọc</h2>

    <div className="mb-4">
      <label className="mb-2 block font-medium text-gray-700">Danh mục</label>
      {isLoading ? (
        <select className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none">
          <option>Đang tải danh mục...</option>
        </select>
      ) : error ? (
        <select className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none">
          <option>Không thể tải danh mục</option>
        </select>
      ) : (
        <select
          name="category"
          value={filters.category}
          onChange={onFilterChange}
          className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none"
        >
          <option value="all">Tất cả</option>
          {categories?.map((category) => (
            <option key={category.cat_id} value={category.cat_name}>
              {category.cat_name}
            </option>
          ))}
        </select>
      )}
    </div>

    <div className="mb-4">
      <label className="mb-2 block font-medium text-gray-700">Khoảng giá</label>
      <select
        name="priceRange"
        value={filters.priceRange}
        onChange={onFilterChange}
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
        onChange={onFilterChange}
        className="w-full rounded-lg border border-gray-300 p-2 focus:border-pink-500 focus:outline-none"
      >
        <option value="newest">Mới nhất</option>
        <option value="priceLow">Giá thấp đến cao</option>
        <option value="priceHigh">Giá cao đến thấp</option>
      </select>
    </div>
  </div>
);

const ProductGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {numberToArray(LIMIT).map((item) => (
          <ProductCardSkeleton key={item} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">
          Không tìm thấy sản phẩm phù hợp với bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id_pro} product={product} />
      ))}
    </div>
  );
};

const ProductListingPage = () => {
  const queryString = useQueryString();
  const {
    brand: brandName,
    category: categoryParam,
    search: searchParam,
    page,
  } = queryString;
  const [currentPage, setCurrentPage] = useState(+page || 1);
  const [showFilter, setShowFilter] = useState(false);

  // Thêm state để theo dõi nếu người dùng đã tương tác với bộ lọc
  const [userInteractedWithFilters, setUserInteractedWithFilters] =
    useState(false);

  // Kiểm tra xem có tham số URL nào được set không
  const hasUrlParams = Boolean(brandName || categoryParam || searchParam);

  // Sử dụng callback trong useState để tránh tính toán lại khi re-render
  const [filters, setFilters] = useState(() => ({
    category: categoryParam || "all",
    priceRange: "all",
    sortBy: "newest",
  }));

  // Cập nhật lại state filters khi URL params thay đổi
  useEffect(() => {
    if (hasUrlParams && !userInteractedWithFilters) {
      setFilters((prev) => ({
        ...prev,
        category: categoryParam || "all",
      }));
    }
  }, [categoryParam, hasUrlParams, userInteractedWithFilters]);

  // Xóa URL params khi người dùng tương tác với bộ lọc
  useEffect(() => {
    if (userInteractedWithFilters && hasUrlParams) {
      const url = new URL(window.location);
      if (brandName) url.searchParams.delete("brand");
      if (categoryParam) url.searchParams.delete("category");
      if (searchParam) url.searchParams.delete("search");
      window.history.pushState({}, "", url);
    }
  }, [
    userInteractedWithFilters,
    hasUrlParams,
    brandName,
    categoryParam,
    searchParam,
  ]);

  // Tối ưu hóa hàm fetchProducts thành useMemo để tránh tái tạo hàm không cần thiết
  const fetchProducts = useMemo(
    () => async () => {
      // Sử dụng URL params nếu chúng tồn tại và người dùng chưa tương tác với bộ lọc
      if (!userInteractedWithFilters) {
        if (brandName) {
          return productsApi.getProductsByBrandName(brandName, {
            page: currentPage,
          });
        }

        if (categoryParam) {
          return productsApi.getProductsByCategoryName(categoryParam, {
            pageParam: currentPage,
          });
        }

        if (searchParam) {
          return productsApi.searchProducts(searchParam, { page: currentPage });
        }
      }

      // Nếu không có URL params hoặc người dùng đã tương tác với bộ lọc
      const isFiltered =
        filters.category !== "all" ||
        filters.priceRange !== "all" ||
        filters.sortBy !== "newest";

      if (isFiltered) {
        const priceRanges = {
          under300: { min: 0, max: 300000 },
          "300to700": { min: 300000, max: 700000 },
          over700: { min: 700000, max: 100000000 },
        };

        const { min: minPrice, max: maxPrice } =
          filters.priceRange !== "all"
            ? priceRanges[filters.priceRange]
            : { min: 0, max: 100000000 };

        return productsApi.getFilterProducts(
          {
            category: filters.category === "all" ? "" : filters.category,
            minPrice,
            maxPrice,
          },
          { pageParam: currentPage },
        );
      }

      return productsApi.getProducts({ page: currentPage });
    },
    [
      brandName,
      categoryParam,
      searchParam,
      currentPage,
      filters,
      userInteractedWithFilters,
    ],
  );

  // Sử dụng alias để làm rõ cấu trúc dữ liệu
  const { data, isLoading } = useQuery({
    queryKey: [
      "products",
      brandName,
      categoryParam,
      searchParam,
      currentPage,
      filters,
      userInteractedWithFilters,
    ],
    queryFn: fetchProducts,
  });

  // Cải thiện trích xuất dữ liệu với destructuring và nullish coalescing
  const products = data?.data?.data?.products ?? data?.data?.data ?? [];
  const perPage = data?.data?.limit ?? data?.data?.data?.limit ?? LIMIT;
  const totalItems =
    data?.data?.total_items ?? data?.data?.data?.total_items ?? 0;

  // Tách ResultText thành một hàm riêng để làm rõ mục đích
  const resultText = useMemo(() => {
    // Không hiển thị nếu đang sử dụng bộ lọc tùy chỉnh
    if (
      userInteractedWithFilters ||
      (!brandName && !categoryParam && !searchParam)
    )
      return null;

    let searchType, searchValue;

    if (brandName) {
      searchType = "thương hiệu";
      searchValue = brandName;
    } else if (categoryParam) {
      searchType = "danh mục";
      searchValue = categoryParam;
    } else {
      searchType = "";
      searchValue = searchParam;
    }

    return (
      <p>
        Kết quả tìm kiếm {searchType && `cho ${searchType}`}{" "}
        <span className="font-semibold">&quot;{searchValue}&quot;</span>.
      </p>
    );
  }, [brandName, categoryParam, searchParam, userInteractedWithFilters]);

  // Hooks categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useAllCategories();

  // Tối ưu hóa event handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Đánh dấu rằng người dùng đã tương tác với bộ lọc
    if (!userInteractedWithFilters) {
      setUserInteractedWithFilters(true);
    }

    setFilters((prev) => ({ ...prev, [name]: value }));

    // Reset về trang 1 khi thay đổi bộ lọc
    if (currentPage !== 1) {
      setCurrentPage(1);
      updatePageInUrl(1);
    }
  };

  const toggleFilter = () => setShowFilter((prev) => !prev);

  const handlePageChange = (page) => {
    setCurrentPage(+page);
    updatePageInUrl(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Tách thành hàm riêng để tái sử dụng
  const updatePageInUrl = (page) => {
    const url = new URL(window.location);
    url.searchParams.set("page", page);
    window.history.pushState({}, "", url);
  };

  // Scroll to top khi thay đổi trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="container mx-auto mt-40 mb-20 py-8">
      <h1
        className="mb-10 text-center text-3xl font-bold"
        style={{ color: "#911f3f" }}
      >
        Danh Sách Sản Phẩm
      </h1>

      {!isLoading && (
        <div className="mb-8 text-center text-gray-600">
          <p>
            Có{" "}
            <span className="font-semibold text-gray-800">
              {totalItems} sản phẩm
            </span>{" "}
            cho tìm kiếm
          </p>
          <div className="mx-auto mt-4 w-20 border-4 border-b border-gray-300"></div>
        </div>
      )}

      {!isLoading && resultText && (
        <div className="mb-4 text-left text-gray-600">{resultText}</div>
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
        <div className={`lg:w-1/4 ${showFilter ? "block" : "hidden"} lg:block`}>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
            isLoading={categoriesLoading}
            error={categoriesError}
          />
        </div>

        {/* Product listing column */}
        <div className="lg:w-3/4">
          <ProductGrid products={products} isLoading={isLoading} />

          {!isLoading && products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
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
