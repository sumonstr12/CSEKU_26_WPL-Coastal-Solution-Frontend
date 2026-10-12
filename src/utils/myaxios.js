import axios from "axios";

const API_BASE_URL =
    "https://cseku-26-wpl-coastal-solution-backend.onrender.com/api/v1/";

const myaxios = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

let isRedirecting = false;

const logoutAndRedirect = () => {
    if (isRedirecting) return; 
    isRedirecting = true;

    localStorage.removeItem("token");
    window.location.href = "/";
};


myaxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


myaxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            
            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}token/get-refresh/`,
                    {},
                    {
                        withCredentials: true
                    }
                );

                localStorage.setItem("token", data.access);
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return myaxios(originalRequest);

            } catch (refreshError) {
                
                logoutAndRedirect();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default myaxios;