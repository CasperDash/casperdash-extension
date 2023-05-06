import axios from 'axios';

const request = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 30 * 1000,
  withCredentials: true,
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status } = error.response;

    if (status === 400) {
      const {
        data: { message },
      } = error.response;

      alert(message);
    }

    return Promise.reject(error);
  }
);

export default request;
