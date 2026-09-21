// ============================================================================
// API CLIENT — currently MOCKED. Swap this file's contents when the
// Node/Express + MongoDB backend is ready; every page imports from here,
// so this is the ONLY file that needs to change.
// ============================================================================

// --- CURRENT: mock client (no backend needed) ---
import mockClient from './mockClient';
export default mockClient;

// --- LATER: real client, once the MongoDB/Express API is running ---
// import axios from 'axios';
//
// const client = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
// });
//
// client.interceptors.request.use((config) => {
//   const token = localStorage.getItem('cee4_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
//
// client.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('cee4_token');
//       localStorage.removeItem('cee4_user');
//     }
//     return Promise.reject(error);
//   }
// );
//
// export default client;
