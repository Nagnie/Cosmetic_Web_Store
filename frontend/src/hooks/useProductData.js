import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import productsApi from "@apis/productsApi.js";

const LIMIT = 18;

export const useProductData = (queryParams, currentPage) => {
  // Fetch sản phẩm
  const fetchProducts = async () => {
    return productsApi.findProducts(queryParams, {
      page: currentPage,
      limit: LIMIT,
    })
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", currentPage, queryParams],
    queryFn: fetchProducts,
  });

  // Trích xuất dữ liệu sản phẩm
  const products = useMemo(
    () => data?.data?.data?.products ?? data?.data?.data ?? [],
    [data],
  );

  const perPage = data?.data?.limit ?? data?.data?.data?.limit ?? LIMIT;
  const totalItems =
    data?.data?.total_items ?? data?.data?.data?.total_items ?? 0;

  return {
    products,
    perPage,
    totalItems,
    isLoading,
    LIMIT,
  };
};
