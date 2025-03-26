import axios from "@utils/axios";

const comboApi = {
  getCombos: async ({ page, limit }) => {
    return axios.get(`/combo`, {
      params: {
        page,
        limit,
      },
    });
  },
  searchCombos: async ({
    page = 1,
    limit = 10,
    name = "",
    orderBy = "ACS",
    sortBy = "",
    minPrice,
    maxPrice,
    status,
  }) => {
    const params = {
      page,
      limit,
      name,
      orderBy,
      sortBy,
      minPrice,
      maxPrice,
      status,
    };

    console.log("Params:", params);

    Object.keys(params).forEach((key) => {
      if (!params[key]) {
        delete params[key];
      }
    });

    return axios.get(`/combo/searchAndFilter`, {
      params: {
        ...params,
      },
    });
  },
  getComboDetail: async (id) => {
    return axios.get(`/combo/${id}`);
  },
  updateCombo: async (id, data, options = {}) => {
    return axios.patch(`/combo/${id}`, data, options);
  },
  createCombo: async (data) => {
    return axios.post(`/combo`, data);
  },
  deleteCombo: async (id) => {
    return axios.delete(`/combo/${id}`);
  },
};
export default comboApi;
