// userStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { Howl } from 'howler'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/'
})
const defaultSong = {
  id: 'ae669cbe730229f1ea0d2ff63ead1013',
  text: 'Amaris - Eve',
  artist: 'Amaris',
  title: 'Eve',
  album: '',
  genre: '',
  isrc: '',
  lyrics: '',
  art: 'http://localhost/api/station/itr/art/b91a45533bb991d3a62ea9f5-1713028289.jpg',
  custom_fields: []
}

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
    isRadioMode: true,
    isPlaying: false,
    id: null,
    title: null,
    author: null,
    art: null,
    duration: null,
    isSongLiked: false,
    likedSongsList: [],
    volume: 0.5,
    radioHowl: new Howl({
      src: ['http://localhost:8000/radio.mp3'],
      html5: true
    }),
    musicHowl: new Howl({
      src: ['http://localhost/api/station/1/file/8e68726a6b45fddd6397eae0/play'],
      format: ['mp3']
    })
  }),
  actions: {
    setSongDetails(song) {
      this.nowPlayingSong = song
      this.id = song.id
      this.title = song.title
      this.author = song.artist
      this.art = song.art
      this.duration = song.duration || null
      this.isSongLiked = false
      if (this.likedSongsList) this.isSongLiked = this.isLiked(song)
    },
    isLiked(songToCheck) {
      // Check if the song is in the likedSongs list
      return Object.values(this.likedSongsList).some((song) => song.id === songToCheck.id)
    },
    async getNowPlaying() {
      try {
        const response = await axios.get('http://localhost/api/nowplaying/1')
        const song = response.data.now_playing.song
        console.log(response.data)
        this.setSongDetails(song)
      } catch (error) {
        console.error('Failed to fetch now playing data:', error)
        this.nowPlayingSong = null
      }
    },
    async getLikedSongs() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/liked-songs/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        return response.data
      } catch (error) {
        console.error('Error fetching liked songs:', error)
      }
    },

    //Howler
    playRadio() {
      this.radioHowl.play()
    },
    pauseRadio() {
      this.radioHowl.pause()
    },
    playMusic() {
      this.musicHowl.play()
    },
    pauseMusic() {
      this.musicHowl.pause()
    },

    //Player controls
    togglePlay(toggleArgument) {
      if (typeof toggleArgument === 'boolean') {
        this.isPlaying = toggleArgument
      } else {
        this.isPlaying = !this.isPlaying
      }
      if (this.isPlaying) {
        if (this.isRadioMode) {
          this.radioHowl.play()
        } else {
          this.musicHowl.play()
        }
      } else {
        this.radioHowl.pause()
        this.musicHowl.pause()
      }
    },
    async changeSong(song) {
      // try {
      //   const response = await axios.get(`http://localhost/api/station/1/file/${song.id}`)
        
        this.musicHowl.stop()
      //   this.musicHowl.unload()

      //   this.musicHowl = new Howl({
      //     src: [`http://localhost/api/station/1/file/${response.data.id}/play`],
      //     format: ['mp3']
      //   })

        this.setSongDetails(song)
        this.isPlaying = true
        this.isRadioMode = false
        this.radioHowl.stop()
        this.musicHowl.play()
      // } catch (error) {
      //   console.error('Error fetching song link:', error)
      // }
    },
    toggleMode(){
      this.radioHowl.pause()
      this.musicHowl.pause()
      if (this.isRadioMode) {
        this.setSongDetails({
          id: "ae669cbe730229f1ea0d2ff63ead1013",
          text: "Amaris - Eve",
          artist: "Amaris",
          title: "Eve",
          album: "",
          genre: "",
          isrc: "",
          lyrics: "",
          art:
            "http://localhost/api/station/itr/art/b91a45533bb991d3a62ea9f5-1713028289.jpg",
          custom_fields: [],
        });
      } else {
        this.getNowPlaying();
      }
      this.isPlaying = false;
      this.isRadioMode = !this.isRadioMode;
    },
  }
})
