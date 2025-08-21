import axios from 'axios';
import { useUserStore } from '../store/index';
import { fetchAccessToken } from './users';
import type { RefreshResponse } from '../types/interface';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });

api.interceptors.request.use(
  (config) => {
    const accessToken = useUserStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    throw error;
  }
);

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    if (error.status === 401 && !error.config?._retry) {
      error.config._retry = true;
      try {
        const newAccessTokenResponse: RefreshResponse = await fetchAccessToken();
        const newAccessToken = newAccessTokenResponse.accessToken;

        useUserStore.getState().setAccessToken(newAccessToken);
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(error.config);
      } catch (error) {
        useUserStore.getState().logout();
        return Promise.reject(error);
      }
    }
  }
);

export default api;
