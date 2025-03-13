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

  getProductAdmin: async ({ page = 1, limit = 9 }) => {
    return axios.get(`/product`, {
      params: {
        page,
        limit,
      }
    })
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

  createProduct: async (product) => {
    return axios.post(`/product`, {
      product,
    })
  },

  updateProduct: async (product) => {
    return axios.put(`/product/${product.id}`, {
      product,
    })
  },

  deleteProduct: async (id) => {
    return axios.delete(`/product/${id}`);
  },
};



export default productsApi;
