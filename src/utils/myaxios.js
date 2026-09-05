import axios from "axios";

const myaxios = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
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
                    "http://127.0.0.1:8000/api/v1/token/refresh/",
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