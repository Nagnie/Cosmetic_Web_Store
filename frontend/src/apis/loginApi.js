import axios from "@utils/axios";

const loginApi = {
    login: async ({ email, password }) => {
        return await axios.post("/auth/login", {
            email,
            password,
        })
    }
}

export default loginApi;
