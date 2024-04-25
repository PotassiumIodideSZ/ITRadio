// userStore.js
import { defineStore } from 'pinia'
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null,
    token: null,
    refreshToken: null
  }),
  actions: {
    setUser(user, token, refreshToken) {
      localStorage.setItem('user', user)
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
    },
    clearUser() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
    isLoggedIn() {
      return localStorage.getItem('token') !== null
    },
    async verifyToken() {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')
  
        const response = await api.post('token/verify/', { token })
        console.log('Token verified successfully:', response.data)
        return true;
      } catch (error) {
        console.error('Error verifying token:', error)
        return await this.refreshToken(); // Call refreshToken on failure
      }
    },
    async refreshToken() {
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token found')

        const response = await api.post('token/refresh/', { refreshToken })
        console.log('Token refreshed successfully:', response.data)
        localStorage.setItem('token', response.data.token) // Update token in localStorage
        return true;
      } catch (error) {
        console.error('Error refreshing token:', error)
        return false;
      }
    },
  },
})