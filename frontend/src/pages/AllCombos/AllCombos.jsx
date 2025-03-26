import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import comboApi from "@apis/comboApi.js";
import ComboProductCard from "@components/ComboProductCard/ComboProductCard.jsx";
import { FaSearch } from "react-icons/fa";

const AllCombos = () => {
  const navigate = useNavigate();
  const [combo, setCombo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterParams, setFilterParams] = useState({
    minPrice: "",
    maxPrice: "",
    orderBy: "DESC",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchCombo = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await comboApi.getCombos({
        limit: 6,
        page: page,
      });
      console.log("Combo response:", response);

      // Ensure we're setting an array
      const comboData = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setCombo(comboData);

      // Update pagination state
      setPagination({
        currentPage: response.data.current_page || page,
        totalPages: response.data.total_pages || 1,
        totalItems: response.data.total_items || comboData.length,
      });

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching combos:", err);
      setError("Không thể tải dữ liệu combo. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  // Initial fetch of combos
  useEffect(() => {
    fetchCombo();
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error) {
    return <div className="py-10 text-center">{error}</div>;
  }

  return (
    <div className="font-sans">
      <div className="container mx-auto mt-48 mb-20 py-8">
        <div className="mb-15">
          <h1 className="text-3xl font-bold text-gray-800">Tất cả combo</h1>
        </div>
        {/* Search and Filter Section */}
        <div className="mx-3 mb-10 grid gap-4 md:grid-rows-2 lg:grid-cols-5 lg:grid-rows-1">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="lg:col-span-3">
            <div className="flex">
              <input
                type="text"
                placeholder="Tìm kiếm combo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2 w-full rounded-lg border p-2"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg px-4 text-white"
                style={{ backgroundColor: "#8D7B68" }}
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Price Filter */}
          <div className="flex items-center gap-2 lg:col-span-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Giá từ"
              value={filterParams.minPrice}
              onChange={handleFilterChange}
              className="w-full rounded-lg border p-2"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Đến"
              value={filterParams.maxPrice}
              onChange={handleFilterChange}
              className="w-full rounded-lg border p-2"
            />

            {/* Order By */}
            <select
              name="orderBy"
              value={filterParams.orderBy}
              onChange={handleFilterChange}
              className="w-full rounded-lg border p-2"
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
            {combo.map((combo) => (
              <ComboProductCard key={combo.id_combo} combo={combo} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            {[...Array(pagination.totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => fetchCombo(index + 1)}
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
