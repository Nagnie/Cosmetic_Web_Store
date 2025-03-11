import axios from "@utils/axios";

const productsApi = {
  getProducts: async ({ page = 1, limit = 9 }) => {
    return axios.get(`/product`, {
      params: {
        page,
        limit,
      },
    });
  },
};

export default productsApi;
