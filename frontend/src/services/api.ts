import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3003',
  timeout: 10000,
});

// Add request interceptor for logging
API.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    if (error.response?.status === 404) {
      throw new Error('API endpoint not found. Please check the API configuration.');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw error;
  }
);

export const fetchOrders = () => API.get('/api/orders');
export const createOrder = (order: any) => API.post('/api/orders', order);
export const searchOrders = (query: string) => API.get(`/api/orders/search`, { params: { query } });
export const optimizeRoutes = () => API.get('/api/routes/optimize');
export const createSampleOrders = () => API.post('/api/routes/sample-orders');
export const deleteOrder = (id: string) => API.delete(`/api/orders/${id}`);
export const updateOrder = (id: string, updatedOrder: any) => API.put(`/api/orders/${id}`, updatedOrder);