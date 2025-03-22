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

    updateSubcategoryDetail: async (id, data) => {
        return axios.patch(`/subcategory/update/${id}`, data);
    },

    createSubcategory: async (data) => {
        return axios.post(`/subcategory/create`, data);
    },

    deleteSubcategory: async (id) => {
        return axios.delete(`/subcategory/delete/${id}`);
    }
};

export default subcategoriesApi;