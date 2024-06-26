<template>
  <div
    v-for="song in playerStore.likedSongsList"
    :key="song.id"
    class="player-container"
    @click="setSongDetails(song)"
    :class="{ 'selected-song': state.currentSong && song.id === state.currentSong.id }"
  >
    <div v-if="song" class="player-container">
      <img :src="song.art" alt="Album Art" />
      <div class="info-container">
        <h2>{{ song.title }}</h2>
        <h3>{{ song.artist }}</h3>
      </div>
      <button
        v-if="state.isTokenValid"
        :class="['float-right-button', 'liked']"
        @click.stop="LikeSongWrapper(song)"
      >
        Like
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { reactive, onMounted } from "vue";
import { usePlayerStore } from "../stores/playerStore";
import { LikeSong } from "../util/likeSong";

export default {
  name: "LikedSongs",
  setup() {
    const playerStore = usePlayerStore();
    const state = reactive({
      likedSongs: [],
      isTokenValid: true, // This should be dynamically checked
      volume: 0.5,
      currentSong: null,
    });

    const fetchLikedSongs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/liked-songs/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        state.likedSongs = response.data.map((song) => ({
          ...song,
          isLiked: true, // Initialize or set based on response
        }));
        playerStore.likedSongsList = state.likedSongs;
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      }
    };

    onMounted(() => {
      playerStore
        .getLikedSongs()
        .then((likedSongsList) => {
          playerStore.likedSongsList = likedSongsList;
        })
        .catch((error) => {
          console.error("Failed to get liked songs:", error);
        });
    });

    function LikeSongWrapper(song) {
      LikeSong(song, true);
    }
    function setSongDetails(song) {
      playerStore.changeSong(song);
      state.currentSong = song;
    }

    const play = (song) => {
      // Implement play functionality
      console.log("Play:", song);
    };

    const pause = (song) => {
      // Implement pause functionality
      console.log("Pause:", song);
    };
    return {
      state,
      playerStore,
      LikeSongWrapper,
      setSongDetails,
      play,
      pause,
    };
  },
};
</script>

<style>
.player-container {
  display: flex;
  align-items: center;
}

.player-container img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

.player-container h2 {
  margin: 0;
}

.player-container h3 {
  margin: 0;
  color: #666;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.play {
  background-color: #4caf50;
}

.pause {
  background-color: #ff9800;
}

input[type="range"] {
  width: 100%;
  margin: 10px 0;
}

button,
input[type="range"] {
  display: block;
  margin-bottom: 10px;
}
.info-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

input[type="range"]:hover {
  opacity: 1;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
}
.float-right-button {
  margin-left: auto;
  background-color: #007bff; /* Blue background */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.float-right-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}
.liked {
  background-color: #d11e69; /* Green background for liked state */
}

.liked:hover {
  background-color: #8f1344; /* Slightly darker shade of the original liked background color */
}
.selected-song {
  border: 2px solid #007bff; /* Blue border */
}
</style>
