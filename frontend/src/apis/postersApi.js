import axios from "@utils/axios";

const postersApi = {
    getPosters: async ({ page, limit}) => {
        return axios.get(`/poster`, {
            params: {
                page,
                limit,
            },
        });
    },

    updatePoster: async (id, data) => {
        return axios.patch(`/poster/update/${id}`, data);
    },

    createPoster: async (data) => {
        return axios.post(`/poster/create`, data);
    },

    deletePoster: async (id) => {
        return axios.delete(`/poster/delete/${id}`);
    }

};

export default postersApi;
