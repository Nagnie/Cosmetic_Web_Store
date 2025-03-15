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

  getProductsByBrandName: async (brandName, { page = 1, limit = 9 }) => {
    return axios.get(`/product/brand`, {
      params: {
        brand: brandName,
        page,
        limit,
      },
    });
  },

  getProductsByCategoryName: async (categoryName, { page = 1, limit = 9 }) => {
    return axios.get(`/product/category`, {
      params: {
        category: categoryName,
        page,
        limit,
      },
    });
  },

  getProductAdmin: async ({ page = 1, limit = 9 }) => {
    return axios.get(`/product`, {
      params: {
        page,
        limit,
      },
    });
  },

  getProductDetail: async (id, { signal }) => {
    return axios.get(`/product/${id}`, { signal });
  },

  getProductsByBrand: (
    brandName,
    { pageParam = 1, limit = 8, signal } = {},
  ) => {
    return axios.get("/product/same_brand", {
      signal,
      params: {
        bra_name: brandName,
        limit: limit,
        page: pageParam,
      },
    });
  },

  getProductsByCategory: (
    categoryName,
    { pageParam = 1, limit = 8, signal } = {},
  ) => {
    return axios.get("/product/same_subcategory", {
      signal,
      params: {
        scat_name: categoryName,
        limit: limit,
        page: pageParam,
      },
    });
  },

  searchProducts: async (search, { page = 1, limit = 9 }) => {
    return axios.get(`/product/search`, {
      params: {
        key: search,
        page,
        limit,
      },
    });
  },

  getFilterProducts: async (filter, { page = 1, limit = 9 }) => {
    return axios.get(`/product/filter`, {
      params: {
        ...filter,
        page,
        limit,
      },
    });
  },
};

export default productsApi;
