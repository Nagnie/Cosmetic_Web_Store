import axios from "@utils/axios";

const loginApi = {
    login: async ({ email, password }) => {
        return await axios.post("/auth/login", {
            email,
            password,
        })
    },

    changePassword: async ({ email, newPassword }) => {
        return await axios.post("/auth/change-password", {
            email,
            newPassword
        })
    }
}

export default loginApi;
