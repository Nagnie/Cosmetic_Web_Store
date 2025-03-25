import axios from "@utils/axios";

const comboApi = {
    getCombos: async ({ page, limit}) => {
        return axios.get(`/combo`, {
            params: {
                page,
                limit,
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
    }

};

export default comboApi;
