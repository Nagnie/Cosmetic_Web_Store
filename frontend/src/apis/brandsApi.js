import axios from "@utils/axios";

const brandsApi = {
    getBrands: async ({ page, limit}) => {
        return axios.get(`/brands`, {
            params: {
                page,
                limit,
            },
        });
    },

    getBrandDetail: async (id, { signal }) => {
        return axios.get(`/brands/${id}`, { signal });
    },

    updateBrandDDetail: async (id, data, options = {}) => {
        return axios.patch(`/brands/${id}`, data, options);
    },

    createBrandD: async (data) => {
        return axios.post(`/brands`, data);
    },

    deleteBrandD: async (id) => {
        return axios.delete(`/brands/${id}`);
    }

};

export default brandsApi;
