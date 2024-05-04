// userStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const usePlayerStore = defineStore({
  id: 'player',
  state: () => ({
    nowPlayingSong: null,
    inRadioMode: true,
    id: null,
    title: null,
    author: null,
    art: null,
    duration: null,
    isSongLiked: false,
    likedSongsList: null
  }),
  actions: {
    async getNowPlaying() {
      try {
        const response = await axios.get('http://localhost/api/nowplaying/1')
        const song = response.data.now_playing.song
        this.nowPlayingSong = song
        this.id = song.id
        this.title = song.title
        this.author = song.artist
        this.art = song.art
        this.duration = null // Assuming duration is not provided in the response
        this.isSongLiked = false // Default value, adjust based on your logic
        // Additional fields can be set here if needed
      } catch (error) {
        console.error('Failed to fetch now playing data:', error)
        this.nowPlayingSong = null
      }
    }
  }
})
