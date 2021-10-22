import axios from 'axios';
import { getAccessToken } from '../utils/auth';

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    const at = getAccessToken();
    config.headers.Authorization = `Bearer ${at}`;
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error.response.data);
});

export default axios