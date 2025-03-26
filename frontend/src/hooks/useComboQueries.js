import { useQuery } from "@tanstack/react-query";

import comboApi from "@apis/comboApi.js";

export const useAllCombo = () => {
  return useQuery({
    queryKey: ["allCombo"],
    queryFn: async () => {
      const firstPageResponse = await comboApi.getCombos({
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
          comboApi
            .getCombos({ page, limit: 100 })
            .then((response) => response.data.data),
        );
      }

      const remainingPagesData = await Promise.all(remainingPagesPromises);

      return [...data, ...remainingPagesData.flat()];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 giờ
  });
};

export const useSearchAndFilterCombo = ({ page = 1, limit = 9 }, query) => {
  return useQuery({
    queryKey: ["allCombo", page, limit, query],
    queryFn: () => comboApi.searchCombos({ page, limit, ...query }),
    select: (data) => data.data,
    keepPreviousData: true,
  });
};
