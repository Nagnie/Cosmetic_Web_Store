import axios from "@utils/axios";

const discountsApi = {
  getDiscounts: async ({ page, limit }) => {
    return axios.get(`/discount`, {
      params: {
        page,
        limit,
      },
    });
  },

  getDiscountDetail: async (id) => {
    return axios.get(`/discount/${id}`);
  },

  updateDiscount: async (id, data) => {
    return axios.patch(`/discount/${id}`, data);
  },

  createDiscount: async (data) => {
    return axios.post(`/discount`, data);
  },

  deleteDiscount: async (id) => {
    return axios.delete(`/discount/${id}`);
  },

  searchAndFilterDiscounts: async ({
    page,
    limit,
    code,
    filter = {
      orderBy: "ASC",
      sortBy: "id",
    },
  }) => {
    return axios.get(`/discount/searchAndFilter`, {
      params: {
        page,
        limit,
        code,
        ...filter,
      },
    });
  },

  applyDiscount: async (code) => {
    return axios.post(`/discount/apply`, {
      code: code,
    });
  },
};

export default discountsApi;
