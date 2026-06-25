import axios from 'axios';
import store from '../app/store';
import { signOutSuccess } from '../features/userSlice';
import toast from 'react-hot-toast';

export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const apiClient = axios.create({
    baseURL: API_BASE,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(signOutSuccess());
            toast.error('Session expired. Please log in again.');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
