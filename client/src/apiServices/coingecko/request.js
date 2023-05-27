import axios from 'axios';
import APP_CONFIGS from '@cd/config';

const request = axios.create({
  baseURL: APP_CONFIGS.COINGECKO_API,
  timeout: 30 * 1000,
  withCredentials: true,
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
