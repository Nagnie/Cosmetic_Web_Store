import { useQuery } from "@tanstack/react-query";

import productsApi from "@apis/productsApi";

export const queryKeys = {
  products: "products",
};

export const useProducts = ({ page = 1, limit = 9, enabled = true }) => {
  return useQuery({
    queryKey: [queryKeys.products, page, limit],
    queryFn: () => productsApi.getProducts({ page, limit }),
    select: (data) => data.data,
    keepPreviousData: true,
    enabled,
  });
};

export const useFindProducts = ({ page = 1, limit = 9, search }) => {
  return useQuery({
    queryKey: [queryKeys.products, page, limit, search],
    queryFn: () => productsApi.findProducts(search, { page, limit }),
    select: (data) => data.data,
    keepPreviousData: true,
  });
};
