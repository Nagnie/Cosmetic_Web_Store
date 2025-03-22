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
};

export default discountsApi;
