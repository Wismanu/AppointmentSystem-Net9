import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5005/api' // Tu puerto exacto
});

export default api;