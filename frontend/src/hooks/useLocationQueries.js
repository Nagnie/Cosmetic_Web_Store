import LocationService from "@services/LocationService";
import { useQuery } from "@tanstack/react-query";

// Hook lấy danh sách tỉnh/thành phố
export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await LocationService.fetchProvinces();

      return response?.data || [];
    },
    config: {
      staleTime: 24 * 60 * 60 * 1000, // 24 giờ
      cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    },
  });
};

// Hook lấy danh sách quận/huyện
export const useDistricts = (cityId) => {
  return useQuery({
    queryKey: ["districts", cityId],
    queryFn: async () => {
      if (!cityId) return [];
      const response = await LocationService.fetchDistricts(cityId);
      return response?.data || [];
    },
    config: {
      enabled: !!cityId,
      staleTime: 24 * 60 * 60 * 1000,
      cacheTime: 7 * 24 * 60 * 60 * 1000,
    },
  });
};

// Hook lấy danh sách phường/xã
export const useWards = (districtId) => {
  return useQuery({
    queryKey: ["wards", districtId],
    queryFn: async () => {
      if (!districtId || districtId === "N/A") return [];
      const response = await LocationService.fetchWards(districtId);
      return response?.data || [];
    },
    config: {
      enabled: !!districtId && districtId !== "N/A",
      staleTime: 24 * 60 * 60 * 1000,
      cacheTime: 7 * 24 * 60 * 60 * 1000,
    },
  });
};
