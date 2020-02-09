import axios from 'axios';

const internalService = axios.create({
	timeout: 70000
});

const token = localStorage.token;

internalService.interceptors.request.use(config => {
	config.headers['Content-Type'] = 'application/json';
	if (token) {
		config.headers['Authorization'] = 'Bearer ' + token;
		config.headers['X-Requested-With'] = 'XMLHttpRequest';
	}
	return config;
}, error => {
  
    Promise.reject(error)
});

internalService.interceptors.response.use(
    response => response,
    error => {
		console.log('err' + error);
		return Promise.reject(error);
	}
);

const externalService = axios.create({
	timeout: 70000
});

externalService.interceptors.request.use(config => {
	config.headers['Content-Type'] = 'application/json';

	return config;
}, error => {
  
    Promise.reject(error)
});

externalService.interceptors.response.use(
    response => response,
    error => {
		console.log('err' + error);
		return Promise.reject(error);
	}
);


export function register(user) {
    return externalService({
        url: 'http://localhost:4000/register',
        method: 'post',
        user
    });
}

export function login(user) {

    return externalService({
        url: 'http://localhost:4000/login',
        method: 'post',
        user
    });
}