import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');
        const token = localStorage.getItem('token');
        const activeToken = adminToken || token;

        if (activeToken) {
            config.headers.Authorization = `Bearer ${activeToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const fetchPrograms = async (page = 1, limit = 12) => {
    const response = await api.get(`/programs?page=${page}&limit=${limit}`);
    return response.data;
};

export const fetchOneProgram = async (id) => {
    const response = await api.get(`/programs/${id}`);
    return response.data;
};

export const createProgram = async (formData) => {
    const response = await api.post('/programs', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateProgram = async (id, formData) => {
    const response = await api.put(`/programs/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteProgram = async (id) => {
    const response = await api.delete(`/programs/${id}`);
    return response.data;
};


export const login = async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const register = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const googleLogin = async (token) => {
    const response = await api.post('/auth/google', { token });
    return response.data;
};


// Sports Module API
export const fetchPlayers = async () => (await api.get('/players')).data;
export const fetchOnePlayer = async (id) => (await api.get(`/players/${id}`)).data;
export const createPlayer = async (formData) => (await api.post('/players', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const updatePlayer = async (id, formData) => (await api.put(`/players/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const deletePlayer = async (id) => (await api.delete(`/players/${id}`)).data;


export const fetchTeams = async () => (await api.get('/teams')).data;
export const fetchOneTeam = async (id) => (await api.get(`/teams/${id}`)).data;
export const createTeam = async (formData) => (await api.post('/teams', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const updateTeam = async (id, formData) => (await api.put(`/teams/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const deleteTeam = async (id) => (await api.delete(`/teams/${id}`)).data;

export const fetchGames = async () => (await api.get('/games')).data;
export const fetchOneGame = async (id) => (await api.get(`/games/${id}`)).data;
export const createGame = async (data) => (await api.post('/games', data)).data;
export const updateGame = async (id, data) => (await api.put(`/games/${id}`, data)).data;
export const deleteGame = async (id) => (await api.delete(`/games/${id}`)).data;

export const fetchLeagues = async () => (await api.get('/leagues')).data;
export const fetchOneLeague = async (id) => (await api.get(`/leagues/${id}`)).data;
export const createLeague = async (data) => (await api.post('/leagues', data)).data;
export const updateLeague = async (id, data) => (await api.put(`/leagues/${id}`, data)).data;
export const deleteLeague = async (id) => (await api.delete(`/leagues/${id}`)).data;

export const fetchPlayerStatsByGame = async (gameId) => (await api.get(`/stats/game/${gameId}`)).data;
export const fetchPlayerStatsByPlayer = async (playerId) => (await api.get(`/stats/player/${playerId}`)).data;
export const savePlayerStats = async (data) => (await api.post('/stats', data)).data;
export const deletePlayerStats = async (gameId, playerId) => (await api.delete(`/stats/${gameId}/${playerId}`)).data;
export const fetchPlayerAverages = async (playerId) => (await api.get(`/stats/player/${playerId}/averages`)).data;

export const fetchPlayerProfile = async (playerId) => (await api.get(`/profiles/${playerId}`)).data;
export const savePlayerProfile = async (data) => (await api.post('/profiles', data)).data;

// Ecommerce Products API
export const fetchProducts = async () => (await api.get('/products')).data;
export const fetchCategories = async () => (await api.get('/products/categories')).data;
export const fetchOneProduct = async (slug) => (await api.get(`/products/${slug}`)).data;
export const fetchSuccessfulOrders = async () => (await api.get('/orders/successful')).data;
export const createOrder = async (orderData) => (await api.post('/orders', orderData)).data;
export const simulatePayment = async (data) => (await api.post('/payments/mock-callback', data)).data;
export const createProduct = async (formData) => (await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const updateProduct = async (id, formData) => (await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;

export const fetchFeatures = async (page = 1, limit = 12) => (await api.get(`/features?page=${page}&limit=${limit}`)).data;
export const fetchOneFeature = async (id) => (await api.get(`/features/${id}`)).data;
export const createFeature = async (formData) => (await api.post('/features', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const updateFeature = async (id, formData) => (await api.put(`/features/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const deleteFeature = async (id) => (await api.delete(`/features/${id}`)).data;


export default api;
