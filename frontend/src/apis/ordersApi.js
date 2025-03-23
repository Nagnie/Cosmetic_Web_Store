import axios from "@utils/axios";

const ordersApi = {
    getOrders: async ({ page, limit}) => {
        return axios.get(`/order`, {
            params: {
                page,
                limit,
            },
        });
    },

    getOrderDetail: async (id, { signal }) => {
        return axios.get(`/order/${id}`, { signal });
    },

    updateOrder: async (id, data, options = {}) => {
        return axios.patch(`/order/${id}`, data, options);
    },

    createOrder: async (data) => {
        return axios.post(`/order`, data);
    },

    deleteOrder: async (id) => {
        return axios.delete(`/order/${id}`);
    }

};

export default ordersApi;
