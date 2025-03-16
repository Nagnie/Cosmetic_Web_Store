import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "antd";

import { useQueryString } from "@hooks/useQueryString.jsx";
import productsApi from "@apis/productsApi.js";
import { useAllCategories } from "@hooks/useCategoryQueries.js";
import FilterPanel from "./components/FilterPanel.jsx";
import ProductGrid from "./components/ProductGrid.jsx";

const LIMIT = 9;
const MIN_MAX_PRICE = [0, 10000000];

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
    priceRange: [0, 1000000],
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
        filters.priceRange[0] !== 0 ||
        filters.priceRange[1] !== 1000000 ||
        filters.sortBy !== "newest";

      if (isFiltered) {
        const [minPrice, maxPrice] = filters.priceRange;

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
  const products = useMemo(
    () => data?.data?.data?.products ?? data?.data?.data ?? [],
    [data],
  );
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
  }, [currentPage, products]);

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
            minMaxPrice={MIN_MAX_PRICE}
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
