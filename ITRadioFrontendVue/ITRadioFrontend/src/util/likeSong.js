import axios from 'axios'
import { usePlayerStore } from '../stores/playerStore'

export function LikeSong(song, isLiked) {
  const playerStore = usePlayerStore()
  const token = localStorage.getItem('token')
  const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (isLiked) {
    // If the song is already liked, send a request to delete it
    axiosInstance
      .post('delete-song/', {
        id: song.id
      })
      .then((response) => {
        playerStore.likedSongsList = playerStore.likedSongsList.filter(s => s.id !== song.id);
        if (song.id == playerStore.id) playerStore.isSongLiked = !playerStore.isSongLiked;
        return true
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  } else {
    axiosInstance
      .post('add-song/', {
        new_song: song
      })
      .then((response) => {
        playerStore.likedSongsList.push(song);
        if (song.id == playerStore.id) playerStore.isSongLiked = !playerStore.isSongLiked;
        return false
      })
      .catch((error) => {
        console.error('Error:', error)
      })
      
  }
}
