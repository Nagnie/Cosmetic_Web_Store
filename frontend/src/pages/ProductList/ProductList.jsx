import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "antd";

import { useQueryString } from "@hooks/useQueryString.jsx";
import productsApi from "@apis/productsApi.js";
import { useAllCategories } from "@hooks/useCategoryQueries.js";
import FilterPanel from "./components/FilterPanel.jsx";
import ProductGrid from "./components/ProductGrid.jsx";

import "./ProductList.css";
import { useAllBrands } from "@hooks/useBrandQueries.js";
import { useLocation } from "react-router-dom";

const LIMIT = 9;
const MIN_MAX_PRICE = [0, 10000000];

const ProductListingPage = () => {
  const location = useLocation();

  const queryString = useQueryString();
  const {
    brand: brandName,
    category: categoryParam,
    subcategory: subcateParam,
    search: searchParam,
    page,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    orderBy: orderByParam,
    sortBy: sortByParam,
  } = queryString;

  const [currentPage, setCurrentPage] = useState(+page || 1);
  const [showFilter, setShowFilter] = useState(false);
  const [userInteractedWithFilters] = useState(false);

  // Initialize filters with URL parameters or defaults
  const [filters, setFilters] = useState(() => ({
    category: categoryParam || "",
    subcate: subcateParam || "",
    brand: brandName || "",
    priceRange: [
      minPriceParam ? parseInt(minPriceParam) : MIN_MAX_PRICE[0],
      maxPriceParam ? parseInt(maxPriceParam) : MIN_MAX_PRICE[1],
    ],
    sortBy: sortByParam || "",
    orderBy: orderByParam || "",
    key: searchParam || "",
  }));

  // Check if URL has any search parameters
  const hasUrlParams = useMemo(() => {
    return Boolean(
      brandName ||
        categoryParam ||
        subcateParam ||
        searchParam ||
        minPriceParam ||
        maxPriceParam ||
        orderByParam ||
        sortByParam,
    );
  }, [
    brandName,
    categoryParam,
    subcateParam,
    searchParam,
    minPriceParam,
    maxPriceParam,
    orderByParam,
    sortByParam,
  ]);

  useEffect(() => {
    // Cập nhật filters khi URL thay đổi
    const params = new URLSearchParams(location.search);

    setFilters({
      category: params.get("category") || "",
      subcate: params.get("subcategory") || "",
      brand: params.get("brand") || "",
      priceRange: [
        params.get("minPrice")
          ? parseInt(params.get("minPrice"))
          : MIN_MAX_PRICE[0],
        params.get("maxPrice")
          ? parseInt(params.get("maxPrice"))
          : MIN_MAX_PRICE[1],
      ],
      sortBy: params.get("sortBy") || "",
      orderBy: params.get("orderBy") || "",
      key: params.get("search") || "",
    });

    // Cập nhật trang hiện tại
    const pageParam = params.get("page");
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    } else {
      setCurrentPage(1);
    }
  }, [location.search]); // Chỉ chạy khi URL thay đổi

  // Update filters when URL params change and user hasn't interacted with filters
  useEffect(() => {
    if (hasUrlParams) {
      setFilters({
        category: categoryParam || "",
        subcate: subcateParam || "",
        brand: brandName || "",
        priceRange: [
          minPriceParam ? parseInt(minPriceParam) : MIN_MAX_PRICE[0],
          maxPriceParam ? parseInt(maxPriceParam) : MIN_MAX_PRICE[1],
        ],
        sortBy: sortByParam || "",
        orderBy: orderByParam || "",
        key: searchParam || "",
      });
    }
  }, [
    hasUrlParams,
    userInteractedWithFilters,
    categoryParam,
    subcateParam,
    brandName,
    minPriceParam,
    maxPriceParam,
    sortByParam,
    orderByParam,
    searchParam,
  ]);

  useEffect(() => {
    const url = new URL(window.location);

    // Cập nhật URL với giá trị filter hiện tại
    if (filters.category && filters.category !== "") {
      url.searchParams.set("category", filters.category);
    } else {
      url.searchParams.delete("category");
    }

    if (filters.subcate) {
      url.searchParams.set("subcategory", filters.subcate);
    } else {
      url.searchParams.delete("subcategory");
    }

    if (filters.brand) {
      url.searchParams.set("brand", filters.brand);
    } else {
      url.searchParams.delete("brand");
    }

    const [minPrice, maxPrice] = filters.priceRange;
    if (minPrice > MIN_MAX_PRICE[0]) {
      url.searchParams.set("minPrice", minPrice);
    } else {
      url.searchParams.delete("minPrice");
    }

    if (maxPrice < MIN_MAX_PRICE[1]) {
      url.searchParams.set("maxPrice", maxPrice);
    } else {
      url.searchParams.delete("maxPrice");
    }

    if (filters.sortBy) {
      url.searchParams.set("sortBy", filters.sortBy);
    } else {
      url.searchParams.delete("sortBy");
    }

    if (filters.orderBy) {
      url.searchParams.set("orderBy", filters.orderBy);
    } else {
      url.searchParams.delete("orderBy");
    }

    if (filters.key) {
      url.searchParams.set("search", filters.key);
    } else {
      url.searchParams.delete("search");
    }

    url.searchParams.set("page", currentPage);

    window.history.pushState({}, "", url);
  }, [filters, currentPage, userInteractedWithFilters]);

  // Prepare query parameters for API call
  const queryParams = useMemo(() => {
    const [minPrice, maxPrice] = filters.priceRange;

    return {
      orderBy: filters.orderBy,
      sortBy: filters.sortBy,
      minPrice,
      maxPrice,
      brand: filters.brand || "",
      subcate: filters.subcate || "",
      category: filters.category === "" ? "" : filters.category,
      key: filters.key,
    };
  }, [filters]);

  // console.log(queryParams);

  // Fetch products with consolidated API
  const fetchProducts = async () => {
    return productsApi.findProducts(queryParams, {
      page: currentPage,
      limit: LIMIT,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", currentPage, queryParams],
    queryFn: fetchProducts,
  });

  // Extract product data
  const products = useMemo(
    () => data?.data?.data?.products ?? data?.data?.data ?? [],
    [data],
  );

  const perPage = data?.data?.limit ?? data?.data?.data?.limit ?? LIMIT;
  const totalItems =
    data?.data?.total_items ?? data?.data?.data?.total_items ?? 0;

  // Build result text message
  const resultText = useMemo(() => {
    let searchTerms = [];

    if (searchParam) searchTerms.push(`từ khóa "${searchParam}"`);

    if (searchTerms.length === 0) return null;

    return <p>Kết quả tìm kiếm cho {searchTerms.join(", ")}.</p>;
  }, [searchParam]);

  // Get categories for filter panel
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

  // Handle filter changes
  const handleFilterChange = ({ target: { name, value } }) => {
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Reset page khi filter thay đổi
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const toggleFilter = () => setShowFilter((prev) => !prev);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updatePageInUrl(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updatePageInUrl = (page) => {
    const url = new URL(window.location);
    url.searchParams.set("page", page);
    window.history.pushState({}, "", url);
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // console.log(">>> filters", filters);

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

      <div className="flex flex-col gap-2 md:gap-4 lg:flex-row lg:gap-5 xl:gap-10">
        {/* Filter column */}
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

        {/* Product listing column */}
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
