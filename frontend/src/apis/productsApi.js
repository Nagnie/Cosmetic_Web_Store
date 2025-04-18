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

  getProductAdmin: async ({ page, limit }) => {
    return axios.get(`/product`, {
      params: {
        page,
        limit,
      },
    });
  },

  getProductDetail: async (id) => {
    return axios.get(`/product/${id}`);
  },

  getProductsByBrand: (
    { brandName, id_pro },
    { pageParam = 1, limit = 8, signal } = {},
  ) => {
    return axios.get("/product/same_brand", {
      signal,
      params: {
        id_pro: id_pro,
        bra_name: brandName,
        limit: limit,
        page: pageParam,
      },
    });
  },

  getProductsByCategory: (
    { categoryName, id_pro },
    { pageParam = 1, limit = 8, signal } = {},
  ) => {
    return axios.get("/product/same_subcategory", {
      signal,
      params: {
        id_pro: id_pro,
        scat_name: categoryName,
        limit: limit,
        page: pageParam,
      },
    });
  },

  searchProducts: async (search, { page = 1, limit = 30 }) => {
    return axios.get(`/product/search`, {
      params: {
        key: search,
        page,
        limit,
      },
    });
  },

  findProducts: async (
    { orderBy, sortBy, minPrice, maxPrice, brand, subcate, category, key },
    { page = 1, limit = 30 },
  ) => {
    // Tạo đối tượng params ban đầu
    const params = {
      orderBy,
      sortBy:
        sortBy === "" || sortBy === undefined || sortBy === null
          ? "id_pro"
          : sortBy,
      minPrice,
      maxPrice,
      brand,
      subcate,
      category,
      key,
      page,
      limit,
    };

    // Loại bỏ các tham số rỗng, null hoặc undefined
    const cleanParams = {};
    Object.entries(params).forEach(([paramName, paramValue]) => {
      if (
        paramValue !== "" &&
        paramValue !== null &&
        paramValue !== undefined
      ) {
        cleanParams[paramName] = paramValue;
      }
    });

    return axios.get(`/product/search`, {
      params: cleanParams,
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

  createProduct: async (productData) => {
    return axios.post(`/product/create`, productData);
  },

  deleteProduct: async (productId) => {
    return axios.delete(`/product/delete/${productId}`, {});
  },

  updateProduct: async (productId, productData) => {
    return axios.patch(`/product/update/${productId}`, productData);
  },
};

export default productsApi;
