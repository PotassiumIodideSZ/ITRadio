// userStore.js
import { defineStore } from 'pinia'
import axios from "axios";
import isLoggedIn from '@/util/isLoggedIn';

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
    isUserLoggedIn: false,
    user: null,
    token: null,
    refreshToken: null,
  }),
  actions: {
    setUser(user, token, refreshToken) {
      this.user = user;
      this.isUserLoggedIn = true;
      localStorage.setItem('user', user)
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
    },
    clearUser() {
      this.user = null;
      this.isUserLoggedIn = false;
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
        if (localStorage.getItem('refreshToken')){
          return await this.refreshToken();
        }
        console.error('Error verifying token:', error)
      }
    },
    async refreshToken() {
      try {
        const refresh = localStorage.getItem('refreshToken')
        if (!refresh) throw new Error('No refresh token found')

        const response = await api.post('token/refresh/', { refresh })
        console.log('Token refreshed successfully:', response.data)
        localStorage.setItem('token', response.data.access) // Update token in localStorage
        return true;
      } catch (error) {
        console.error('Error refreshing token:', error)
        return false;
      }
    },
  },
})