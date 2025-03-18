import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const MIN_MAX_PRICE = [0, 10000000];

export const useProductFilters = (initialPage = 1) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showFilter, setShowFilter] = useState(false);

  // Lấy params từ URL
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      brandName: params.get("brand") || "",
      categoryParam: params.get("category") || "",
      subcateParam: params.get("subcategory") || "",
      searchParam: params.get("search") || "",
      page: params.get("page") ? parseInt(params.get("page")) : 1,
      minPriceParam: params.get("minPrice") || "",
      maxPriceParam: params.get("maxPrice") || "",
      orderByParam: params.get("orderBy") || "",
      sortByParam: params.get("sortBy") || "",
    };
  }, [location.search]);

  // State cho filters
  const [filters, setFilters] = useState(() => ({
    category: urlParams.categoryParam || "",
    subcate: urlParams.subcateParam || "",
    brand: urlParams.brandName || "",
    priceRange: [
      urlParams.minPriceParam
        ? parseInt(urlParams.minPriceParam)
        : MIN_MAX_PRICE[0],
      urlParams.maxPriceParam
        ? parseInt(urlParams.maxPriceParam)
        : MIN_MAX_PRICE[1],
    ],
    sortBy: urlParams.sortByParam || "",
    orderBy: urlParams.orderByParam || "",
    key: urlParams.searchParam || "",
  }));

  // Update filters khi URL thay đổi
  useEffect(() => {
    setFilters({
      category: urlParams.categoryParam || "",
      subcate: urlParams.subcateParam || "",
      brand: urlParams.brandName || "",
      priceRange: [
        urlParams.minPriceParam
          ? parseInt(urlParams.minPriceParam)
          : MIN_MAX_PRICE[0],
        urlParams.maxPriceParam
          ? parseInt(urlParams.maxPriceParam)
          : MIN_MAX_PRICE[1],
      ],
      sortBy: urlParams.sortByParam || "",
      orderBy: urlParams.orderByParam || "",
      key: urlParams.searchParam || "",
    });

    setCurrentPage(urlParams.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Cập nhật URL khi filters hoặc currentPage thay đổi
  useEffect(() => {
    const url = new URL(window.location);

    // Thêm hoặc xóa params dựa trên giá trị filter
    if (filters.category) url.searchParams.set("category", filters.category);
    else url.searchParams.delete("category");

    if (filters.subcate) url.searchParams.set("subcategory", filters.subcate);
    else url.searchParams.delete("subcategory");

    if (filters.brand) url.searchParams.set("brand", filters.brand);
    else url.searchParams.delete("brand");

    const [minPrice, maxPrice] = filters.priceRange;
    if (minPrice > MIN_MAX_PRICE[0]) url.searchParams.set("minPrice", minPrice);
    else url.searchParams.delete("minPrice");

    if (maxPrice < MIN_MAX_PRICE[1]) url.searchParams.set("maxPrice", maxPrice);
    else url.searchParams.delete("maxPrice");

    if (filters.sortBy) url.searchParams.set("sortBy", filters.sortBy);
    else url.searchParams.delete("sortBy");

    if (filters.orderBy) url.searchParams.set("orderBy", filters.orderBy);
    else url.searchParams.delete("orderBy");

    if (filters.key) url.searchParams.set("search", filters.key);
    else url.searchParams.delete("search");

    url.searchParams.set("page", currentPage);

    window.history.pushState({}, "", url);
  }, [filters, currentPage]);

  // Handlers
  const handleFilterChange = ({ target: { name, value } }) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFilter = () => setShowFilter((prev) => !prev);

  // Chuẩn bị query params cho API
  const queryParams = useMemo(() => {
    const [minPrice, maxPrice] = filters.priceRange;
    return {
      orderBy: filters.orderBy,
      sortBy: filters.sortBy,
      minPrice,
      maxPrice,
      brand: filters.brand || "",
      subcate: filters.subcate || "",
      category: filters.category || "",
      key: filters.key,
    };
  }, [filters]);

  return {
    filters,
    currentPage,
    showFilter,
    queryParams,
    urlParams,
    handleFilterChange,
    handlePageChange,
    toggleFilter,
    MIN_MAX_PRICE,
  };
};
