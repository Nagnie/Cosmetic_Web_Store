import { useQuery } from "@tanstack/react-query";

import postersApi from "@apis/postersApi.js";

export const useAllPosters = () => {
    return useQuery({
        queryKey: ["allPosters"],
        queryFn: async () => {
            const firstPageResponse = await postersApi.getPosters({
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
                    postersApi
                        .getPosters({ page, limit: 100 })
                        .then((response) => response.data.data),
                );
            }

            const remainingPagesData = await Promise.all(remainingPagesPromises);

            return [...data, ...remainingPagesData.flat()];
        },
        staleTime: 24 * 60 * 60 * 1000, // 24 giờ
    });
};
