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

    updateCategoryDetail: async (id, data, signal) => {
        return axios.patch(`/category/update/${id}`, data, { signal });
    },

    createCategory: async (data) => {
        return axios.post(`/category/create`, data);
    },

    deleteCategory: async (id) => {
        return axios.delete(`/category/delete/${id}`);
    }

};

export default categoriesApi;
