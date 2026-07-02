import axios from "axios";
import {useAuthStore} from "../auth.js";

const api = axios.create({baseURL: import.meta.env.VITE_API_PATH})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 ) {
            const auth = useAuthStore();
            auth.logoutUser();
        }
        return Promise.reject(error);
    }
)

export default api;
