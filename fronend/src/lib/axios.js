import axios from "axios";

const axiosInstance = axios.create({
 
    baseURL: import.meta.env.MODE === "development" 
        ? "http://localhost:5000/api" 
        : "https://ecommerce-2-4h2z.onrender.com", 
    withCredentials: true, // Required to pass cookies/sessions securely
});

export default axiosInstance;