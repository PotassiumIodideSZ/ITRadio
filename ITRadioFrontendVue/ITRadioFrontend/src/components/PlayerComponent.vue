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
          <button
            v-if="state.isTokenValid"
            :class="{ 'float-right-button': true, liked: playerStore.isLiked }"
            @click="songLiked"
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

export default {
  name: "BottomPlayer",
  setup() {
    const playerStore = usePlayerStore();
    const userStore = useUserStore();
    userStore.verifyToken();
    // Access store state directly
    const state = reactive({
      volume: 0.5,
      currentDuration: 0,
      isTokenValid: false,
      isLiked: false,
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
    this.playerStore.getNowPlaying();
    this.userStore
      .verifyToken()
      .then((isValid) => {
        this.state.isTokenValid = isValid;
      })
      .catch((error) => {
        console.error("Failed to verify token:", error);
      });
  },
  computed: {
    // Example of a computed property that depends on the store's state
    isLiked() {
      return this.playerStore.isSongLiked;
    },
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
  width: 40px; /* Adjust image size */
  height: 40px; /* Adjust image height */
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
</style>
