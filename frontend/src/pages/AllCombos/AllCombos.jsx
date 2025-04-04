import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import comboApi from "@apis/comboApi.js";
import ComboProductCard from "@components/ComboProductCard/ComboProductCard.jsx";
import { FaSearch } from "react-icons/fa";
import { useSearchAndFilterCombo } from "@hooks/useComboQueries";
import { useQueryString } from "@hooks/useQueryString";
import { useDebounce, useDebounceCallback } from "@hooks/useDebounce";

const AllCombos = () => {
  const navigate = useNavigate();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterParams, setFilterParams] = useState({
    minPrice: "",
    maxPrice: "",
    orderBy: "DESC",
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedMinPrice = useDebounce(filterParams.minPrice, 500);
  const debouncedMaxPrice = useDebounce(filterParams.maxPrice, 500);

  const {
    page: pageFromUrl,
    limit,
    name: nameFromUrl,
    orderBy,
    sortBy,
    minPrice,
    maxPrice,
    status,
  } = useQueryString();

  useEffect(() => {
    if (nameFromUrl) {
      setSearchTerm(nameFromUrl);
    }
    if (minPrice) {
      setFilterParams((prev) => ({ ...prev, minPrice }));
    }
    if (maxPrice) {
      setFilterParams((prev) => ({ ...prev, maxPrice }));
    }
    if (orderBy) {
      setFilterParams((prev) => ({ ...prev, orderBy }));
    }
  }, []);

  const [pagination, setPagination] = useState({
    currentPage: parseInt(pageFromUrl) || 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    const updateUrlParams = () => {
      const params = new URLSearchParams();

      if (debouncedSearchTerm) {
        params.append("name", debouncedSearchTerm);
      }

      if (pagination.currentPage > 1) {
        params.append("page", pagination.currentPage);
      }

      if (debouncedMinPrice) {
        params.append("minPrice", debouncedMinPrice);
      }

      if (debouncedMaxPrice) {
        params.append("maxPrice", debouncedMaxPrice);
      }

      if (filterParams.orderBy !== "DESC") {
        params.append("orderBy", filterParams.orderBy);
      }

      const newURL = params.toString()
        ? `?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState(null, "", newURL);
    };

    updateUrlParams();
  }, [
    debouncedSearchTerm,
    pagination.currentPage,
    debouncedMinPrice,
    debouncedMaxPrice,
    filterParams.orderBy,
  ]);

  const { data, isLoading, error } = useSearchAndFilterCombo(
    {
      page: pagination.currentPage,
      limit: 6,
    },
    {
      name: debouncedSearchTerm,
      orderBy: filterParams.orderBy,
      sortBy: sortBy || "",
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      status: status || "",
    },
  );

  const combo = data?.data?.data || [];

  useEffect(() => {
    if (data?.data) {
      setPagination({
        currentPage: data.data.current_page || pagination.currentPage,
        totalPages: data.data.total_pages || 1,
        totalItems: data.data.total_items || 0,
      });
    }
  }, [data, pagination.currentPage]);

  const debouncedTextInputChange = useDebounceCallback((name, value) => {
    if (name === "searchTerm") {
      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    } else {
      setFilterParams((prev) => ({
        ...prev,
        [name]: value,
      }));

      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    }
  }, 500);

  const handleTextInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "searchTerm") {
      setSearchTerm(value);
    } else {
      setFilterParams((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    debouncedTextInputChange(name, value);
  };

  const handleOrderByChange = (e) => {
    const { name, value } = e.target;

    setFilterParams((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  if (error) {
    return (
      <div className="py-10 text-center">
        Không thể tải dữ liệu combo. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="container mx-auto mt-40 mb-20 py-8">
        <div className="mb-15">
          <h1 className="text-3xl font-bold text-gray-800">Tất cả combo</h1>
        </div>
        {/* Search and Filter Section */}
        <div className="mx-3 mb-10 grid gap-4 md:grid-rows-2 lg:grid-cols-5 lg:grid-rows-1">
          <div className="lg:col-span-3">
            <div className="flex">
              <input
                type="text"
                name="searchTerm"
                placeholder="Tìm kiếm combo..."
                value={searchTerm}
                onChange={handleTextInputChange}
                className="me-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-primary focus:ring-2"
              />
              <button
                type="button"
                className="flex items-center justify-center rounded-lg px-4 text-white focus:outline-none focus:ring-primary-light focus:ring-2"
                style={{ backgroundColor: "#8D7B68" }}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-2 lg:col-span-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Giá từ"
              value={filterParams.minPrice}
              onChange={handleTextInputChange}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-primary focus:ring-2"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Đến"
              value={filterParams.maxPrice}
              onChange={handleTextInputChange}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-primary focus:ring-2"
            />

            <select
              name="orderBy"
              value={filterParams.orderBy}
              onChange={handleOrderByChange}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-primary focus:ring-2"
            >
              <option value="DESC">Giá tăng dần</option>
              <option value="ACS">Giá giảm dần</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : combo.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Không tìm thấy combo phù hợp
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {combo.map((comboItem) => (
              <ComboProductCard
                key={comboItem.id_combo ?? comboItem.id}
                combo={comboItem}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            {[...Array(pagination.totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-2 rounded px-4 py-2 ${
                  pagination.currentPage === index + 1
                    ? "bg-primary-dark text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCombos;
