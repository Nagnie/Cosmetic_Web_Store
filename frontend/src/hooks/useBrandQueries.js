import { useQuery } from "@tanstack/react-query";

import { getBrands } from "@apis/brandApi";

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });
};
