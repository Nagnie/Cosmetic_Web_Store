import discountsApi from "@apis/discountsApi";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useInfiniteVouchers = (
  params = { limit: 10, orderBy: "ASC", sortBy: "id" },
) => {
  const result = useInfiniteQuery({
    queryKey: ["vouchers", params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await discountsApi.getDiscounts({
        ...params,
        page: pageParam,
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      // Nếu trang hiện tại nhỏ hơn tổng số trang, trả về số trang tiếp theo
      if (lastPage.data.page < lastPage.data.total_pages) {
        return Number(lastPage.data.page) + 1;
      }
      // Trả về undefined nếu không còn trang tiếp theo
      return undefined;
    },
    getPreviousPageParam: (firstPage) => {
      // Nếu trang hiện tại lớn hơn 1, trả về số trang trước đó
      if (firstPage.data.page > 1) {
        return Number(firstPage.data.page) - 1;
      }
      // Trả về undefined nếu không có trang trước đó
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  // Tính toán các giá trị hữu ích từ dữ liệu trả về
  const currentPage =
    result.data?.pages[result.data.pages.length - 1]?.data.page || 1;
  const totalPages =
    result.data?.pages[result.data.pages.length - 1]?.data.total_pages || 1;

  return {
    ...result,
    // Các thuộc tính hỗ trợ phân trang
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    currentPage,
    totalPages,
    // Mở rộng để lấy dữ liệu trang hiện tại dễ dàng hơn
    currentData: result.data?.pages[result.data?.pages.length - 1]?.data,
    // Lấy tất cả các voucher từ tất cả các trang đã tải
    allVouchers: result.data?.pages.flatMap((page) => page.data.items || []),
  };
};

export const useVouchers = (
  params = { limit: 10, orderBy: "ASC", sortBy: "id", page: 1 },
) => {
  return useQuery({
    queryKey: ["vouchers", params],
    queryFn: async () => {
      const { data } = await discountsApi.getDiscounts(params);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

export const useSearchAndFilterVouchers = (
  params = {
    page: 1,
    limit: 10,
    code: "",
    filter: {
      orderBy: "ASC",
      sortBy: "id",
    },
  },
) => {
  return useQuery({
    queryKey: ["vouchers", params],
    queryFn: async () => {
      const { data } = await discountsApi.searchAndFilterDiscounts(params);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};
