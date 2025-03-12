import axios from "@utils/axios";

const subcategoriesApi = {
    getSubcategories: async ({ page, limit}) => {
        return axios.get(`/subcategory`, {
            params: {
                page,
                limit,
            },
        });
    },

    getSubcategoryDetail: async (id, { signal }) => {
        return axios.get(`/subcategory/${id}`, { signal });
    },

    updateSubcategoryDetail: async (id, { signal }) => {
        return axios.patch(`/subcategory/${id}`, { signal });
    },

    createSubcategory: async (data) => {
        return axios.post(`/subcategory`, data);
    },

    deleteSubcategory: async (id) => {
        return axios.delete(`/subcategory/${id}`);
    }

};

export default subcategoriesApi;
