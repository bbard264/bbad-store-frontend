import axios from 'axios';
import Token from './services/Token';

axios.interceptors.request.use(
  (config) => {
    // console.log('Request:', config.url, config.params ?? '');
    if (
      config.url.includes('/api/user/login') ||
      config.url.includes('/api/user/register')
    )
      return config;

    const token = Token.getToken();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (response) => {
    // console.log('Response:', response);
    return response;
  },
  (err) => {
    if (err.response?.status === 401) {
      Token.removeToken();
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export default axios;
