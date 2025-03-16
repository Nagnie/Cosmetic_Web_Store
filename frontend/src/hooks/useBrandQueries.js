import { useQuery } from "@tanstack/react-query";

import brandsApi from "@apis/brandsApi";
import { getBrands } from "@apis/brandApi";

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });
};

export const useAllBrands = () => {
  return useQuery({
    queryKey: ["allBrands"],
    queryFn: async () => {
      const firstPageResponse = await brandsApi.getBrands({
        page: 1,
        limit: 100,
      });

      const { data } = firstPageResponse.data;

      const total_pages = data.total_pages;

      if (total_pages <= 1) {
        return data.data;
      }

      const remainingPagesPromises = [];
      for (let page = 2; page <= total_pages; page++) {
        remainingPagesPromises.push(
          brandsApi.getBrands({ page, limit: 100 }).then((response) => {
            return response.data.data.data;
          }),
        );
      }

      const remainingPagesData = await Promise.all(remainingPagesPromises);

      return [...data.data, ...remainingPagesData.flat()];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 giờ
  });
};
