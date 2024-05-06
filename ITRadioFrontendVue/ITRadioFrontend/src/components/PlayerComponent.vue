<template>
  <div class="bottom-player" :style="{ bottom: playerBottom }">
    <div class="toggle-arrow" @click="togglePlayer">{{ arrowDirection }}</div>
    <div class="player-wrapper">
      <div class="player-container-fixed">
        <div v-if="playerStore.nowPlayingSong" class="player-container-fixed">
          <img :src="playerStore.art" alt="Album Art" />
          <div class="info-container">
            <h2>{{ playerStore.title }}</h2>
            <h3>{{ playerStore.author }}</h3>
          </div>
          <button class="radio-control-button" @click="playerStore.togglePlay()">
            {{ playerStore.isPlaying ? "Pause" : "Play" }}
          </button>
          <button class="radio-control-button" @click="playerStore.toggleMode()">
            {{ this.playerStore.isRadioMode ? "To Music" : "To Radio" }}
          </button>
          <button
            v-if="state.isTokenValid"
            :class="{ 'float-right-button': true, liked: this.playerStore.isSongLiked }"
            @click="LikeSongWrapper(playerStore.nowPlayingSong)"
          >
            Like
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, watch } from "vue";
import { usePlayerStore } from "../stores/playerStore";
import { useUserStore } from "../stores/userCred";
import { LikeSong } from "../util/likeSong";
import { Howl } from "howler";
import axios from "axios";

export default {
  name: "BottomPlayer",
  setup() {
    const playerStore = usePlayerStore();
    const userStore = useUserStore();
    userStore.verifyToken();
    const state = reactive({
      isTokenValid: false,
    });
    
    
    return {
      playerStore,
      userStore,
      state,
    };
  },
  data() {
    return {
      playerBottom: "0px", // Start visible
      arrowDirection: "▼",
    };
  },
  mounted() {
    this.userStore
      .verifyToken()
      .then((isValid) => {
        this.state.isTokenValid = isValid;
      })
      .catch((error) => {
        console.error("Failed to verify token:", error);
      });

    this.playerStore
      .getLikedSongs()
      .then((likedSongsList) => {
        this.playerStore.likedSongsList = likedSongsList;
      })
      .catch((error) => {
        console.error("Failed to get liked songs:", error);
      })
      .finally(() => {
        this.playerStore.getNowPlaying();
      });
  },
  methods: {
    togglePlayer() {
      if (this.playerBottom === "0px") {
        this.playerBottom = "-70px";
        this.arrowDirection = "▲"; // Arrow points up when player is hidden
      } else {
        this.playerBottom = "0px";
        this.arrowDirection = "▼"; // Arrow points down when player is visible
      }
    },
    LikeSongWrapper(song) {
      LikeSong(song, this.playerStore.isSongLiked);
    },
  },
};
</script>

<style scoped>
.bottom-player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px 0;
  transition: bottom 0.5s;
}

.player-wrapper {
  height: 50px;
  display: flex; /* Use flexbox to align child elements */
  align-items: center; /* Center items vertically */
  justify-content: center; /* Center items horizontally */
}

.player-container-fixed {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Distribute space between elements */
  width: 90%; /* Adjust width as needed */
  padding: 5px; /* Add padding for spacing */
}

.info-container {
  flex-grow: 1; /* Allow the info container to take up remaining space */
  padding: 0 10px; /* Add padding on the sides */
}

img {
  width: 50px; /* Adjust image size */
  height: 50px; /* Adjust image height */
  margin-right: 10px; /* Space between image and info */
}
.toggle-arrow {
  cursor: pointer;
  font-size: 20px;
  color: #fff;
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  transition: transform 0.5s;
}

.controls button {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.controls button:hover {
  background-color: #45a049;
}
.radio-control-button {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.radio-control-button:hover {
  background-color: #45a049;
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
</style>
