import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from './authService'; // Import refresh token service

const  apiUrl = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: `${apiUrl}`,
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {

        const newAccessToken = await refreshAccessToken();
        Cookies.set('accessToken', newAccessToken, { expires: 1 }); // Store the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); 
      } catch (err) {
        console.error('Token refresh failed:', err);
       
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
