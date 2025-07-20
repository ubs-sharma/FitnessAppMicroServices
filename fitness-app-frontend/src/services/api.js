import axios from "axios";
import { act } from "react";

const API_URL = "http://localhost:8080/api/";

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (userId) {
            config.headers['X-User-ID'] = userId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getActivities = () => api.get('/activities');

export const addActivity = (activity) => api.post('/activity', activity);

export const getActivityDetatils = (id) => api.get(`/recommendations/activity/${id}`,);


export default api;