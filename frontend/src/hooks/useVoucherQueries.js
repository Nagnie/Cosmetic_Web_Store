import discountsApi from "@apis/discountsApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Hook để lấy danh sách voucher với phân trang
export const useVouchers = (
  params = { limit: 10, page: 1, orderBy: "ASC", sortBy: "id" },
) => {
  const queryClient = useQueryClient();

  // Prefetch trang tiếp theo
  const prefetchNextPage = async (nextPage) => {
    if (nextPage) {
      await queryClient.prefetchQuery(
        ["vouchers", { ...params, page: nextPage }],
        async () => {
          const { data } = await discountsApi.getDiscounts({
            ...params,
            page: nextPage,
          });

          return data;
        },
      );
    }
  };

  const result = useQuery({
    queryKey: ["vouchers", params],
    queryFn: async () => {
      const { data } = await discountsApi.getDiscounts(params);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    keepPreviousData: true, // Giữ dữ liệu cũ - lưu ý: trong v5 nên dùng placeholderData thay vì keepPreviousData
    onSuccess: (data) => {
      // Nếu còn trang tiếp theo, prefetch trang đó
      if (data.data.page < data.data.total_pages) {
        prefetchNextPage(Number(data.data.page) + 1);
      }
      // Prefetch trang trước nếu không phải trang đầu
      if (data.data.page > 1) {
        prefetchNextPage(Number(data.data.page) - 1);
      }
    },
  });

  return {
    ...result,
    // Thêm các hàm hỗ trợ phân trang
    hasNextPage: result.data?.data?.page < result.data?.data?.total_pages,
    hasPrevPage: result.data?.data?.page > 1,
    currentPage: result.data?.data?.page ? Number(result.data?.data?.page) : 1,
    totalPages: result.data?.data?.total_pages || 1,
    // Hàm để nạp trang tiếp theo
    fetchNextPage: () => {
      if (result.data?.data?.page < result.data?.data?.total_pages) {
        return { ...params, page: Number(result.data.data.page) + 1 };
      }
      return null;
    },
    // Hàm để nạp trang trước
    fetchPrevPage: () => {
      if (result.data?.data?.page > 1) {
        return { ...params, page: Number(result.data.data.page) - 1 };
      }
      return null;
    },
  };
};
