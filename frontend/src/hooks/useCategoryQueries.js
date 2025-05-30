import { useQuery } from "@tanstack/react-query";

import categoriesApi from "@apis/categoriesApi";

export const useAllCategories = () => {
  return useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const firstPageResponse = await categoriesApi.getCategories({
        page: 1,
        limit: 100,
      });

      const { total_pages, data } = firstPageResponse.data;

      if (total_pages <= 1) {
        return data;
      }

      const remainingPagesPromises = [];
      for (let page = 2; page <= total_pages; page++) {
        remainingPagesPromises.push(
          categoriesApi
            .getCategories({ page, limit: 100 })
            .then((response) => response.data.data),
        );
      }

      const remainingPagesData = await Promise.all(remainingPagesPromises);

      return [...data, ...remainingPagesData.flat()];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 giờ
  });
};
