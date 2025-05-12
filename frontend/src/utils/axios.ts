import axios from 'axios';

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const baseURL = isMobile
	? 'http://192.168.143.4:5000' 
	: import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
	baseURL,
	withCredentials: true 
});

export default API;
