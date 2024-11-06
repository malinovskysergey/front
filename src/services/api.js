// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://last-production-ebba.up.railway.app/api', // Ensure this matches your backend URL
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default {
  getItems(search) {
    return apiClient.get('/items', { params: { search } });
  },
  getItem(id) {
    return apiClient.get(`/items/${id}`);
  },
  getPerson(id) { // New method for fetching individual person details
    return apiClient.get(`/persons/${id}`);
  },
}; 
//
