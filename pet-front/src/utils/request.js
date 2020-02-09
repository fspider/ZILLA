import axios from 'axios';
import store from '@/store';
import { getToken } from '@/utils/auth';

const service = axios.create({
	timeout: 70000
});

service.interceptors.request.use(config => {
	config.headers['Content-Type'] = 'application/json';
	if (store.getters.token) {
		config.headers['Authorization'] = 'Bearer ' + getToken();
		config.headers['X-Requested-With'] = 'XMLHttpRequest';
	}
	return config;
}, error => {
  
  Promise.reject(error)
});

service.interceptors.response.use(
    response => response,
    error => {
		console.log('err' + error);
		return Promise.reject(error);
	}
);

export default service;
