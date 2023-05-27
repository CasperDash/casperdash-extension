import axios from 'axios';
import APP_CONFIGS from '@cd/config';

const request = axios.create({
  baseURL: APP_CONFIGS.SWAP_FM_API_ROOT,
  timeout: 30 * 1000,
  withCredentials: true,
});

request.interceptors.response.use(
  (response) => response.data,
);

export default request;
