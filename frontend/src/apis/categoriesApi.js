import axios from "@utils/axios";

const categoriesApi = {
    getCategories: async ({ page, limit}) => {
        return axios.get(`/category`, {
            params: {
                page,
                limit,
            },
        });
    },

    getCategoryDetail: async (id, { signal }) => {
        return axios.get(`/category/${id}`, { signal });
    },

    updateCategoryDetail: async (id, { signal }) => {
        return axios.patch(`/category/${id}`, { signal });
    },

    createCategory: async (data) => {
        return axios.post(`/category`, data);
    },

    deleteCategory: async (id) => {
        return axios.delete(`/category/${id}`);
    }

};

export default categoriesApi;
