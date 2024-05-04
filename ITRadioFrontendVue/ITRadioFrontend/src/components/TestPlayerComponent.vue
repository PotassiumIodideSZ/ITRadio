<template>
  <div class="player-container">
    <div v-if="nowPlaying.song" class="player-container">
      <img :src="nowPlaying.song.art" alt="Album Art" />
      <div class="info-container">
        <h2>{{ nowPlaying.song.title }}</h2>
        <h3>{{ nowPlaying.song.artist }}</h3>
      </div>
      <button
        v-if="state.isTokenValid"
        :class="{ 'float-right-button': true, liked: state.isLiked }"
        @click="songLiked"
      >
        Like
      </button>
    </div>
  </div>
  <div class="player-container">
    <button class="play" @click="play">Play</button>
    <button class="pause" @click="pause">Pause</button>
    <input type="range" v-model="state.volume" min="0" max="1" step="0.01" />
  </div>
  <div class="player-container">
    <button class="play" @click="play2">Play</button>
    <button class="pause" @click="pause2">Pause</button>
    <input type="range" v-model="state.slider" min="0" step="1" @input="changePosition" />
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, watch } from "vue";
import axios from "axios";
import { Howl } from "howler";
import { useUserStore } from "../stores/userCred";

export default {
  name: "TestComponent",
  setup() {
    const state = reactive({
      volume: 0.5,
      slider: 0,
      isTokenValid: false,
      isLiked: false,
      likedSongs: {},
    });

    const store = useUserStore();
    const nowPlaying = reactive({ song: null });

    const verifyUserToken = async () => {
      if (store.verifyToken()) {
        state.isTokenValid = true;
        const fetchLikedSongs = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/liked-songs/", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            state.likedSongs = response.data;
          } catch (error) {
            console.error("Error fetching liked songs:", error);
          }
        };
        await fetchLikedSongs();
        isLiked();
      } else {
        state.isTokenValid = false;
      }
    };
    const songLiked = async () => {
      const token = localStorage.getItem("token");
      const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:8000/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (state.isLiked) {
        // If the song is already liked, send a request to delete it
        axiosInstance
          .post("delete-song/", {
            id: nowPlaying.song.id,
          })
          .then((response) => {
            state.isLiked = false;
            delete state.likedSongs[nowPlaying.song.id];
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        axiosInstance
          .post("add-song/", {
            new_song: nowPlaying.song,
          })
          .then((response) => {
            state.isLiked = true;
            state.likedSongs[nowPlaying.song.id] = nowPlaying.song;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };
    function isLiked() {
      // Check if the song is in the likedSongs list
      state.isLiked = Object.values(state.likedSongs).some(
        (song) => song.id === nowPlaying.song.id
      );
    }
    //Howler
    const sound = new Howl({
      src: ["http://localhost:8000/radio.mp3"],
      html5: true,
    });

    const sound2 = new Howl({
      src: ["http://localhost/api/station/1/file/8e68726a6b45fddd6397eae0/play"],
      format: ["mp3"],
      onload: function () {
        state.slider = sound2.duration();
      },
    });

    const fetchNowPlaying = async () => {
      try {
        const response = await axios.get("http://localhost/api/nowplaying/1");
        nowPlaying.song = response.data.now_playing.song;
        isLiked();
      } catch (error) {
        console.error("Failed to fetch now playing data:", error);
        nowPlaying.song = null;
      }
    };

    const play = () => {
      sound.play();
    };

    const pause = () => {
      sound.pause();
    };

    const play2 = () => {
      sound2.play();
    };

    const pause2 = () => {
      sound2.pause();
    };

    watch(
      () => state.volume,
      (newVolume) => {
        sound.volume(newVolume);
      }
    );
    let animationId;

    const updateSlider = () => {
      state.slider = sound2.seek() || 0;
      animationId = requestAnimationFrame(updateSlider);
    };

    const sseBaseUri = "https://localhost/api/live/station/1/nowplaying/sse";
    const sseUriParams = new URLSearchParams({
      cf_connect: JSON.stringify({
        subs: {
          "station:itr": {},
        },
      }),
    });
    const sseUri = sseBaseUri + "?" + sseUriParams.toString();
    const sse = new EventSource(sseUri);

    // This is a now-playing event from a station. Update your now-playing data accordingly.
    function handleData(payload) {
      const jsonData = payload?.pub?.data ?? {};
      currentTime = jsonData.current_time;
      nowplaying = jsonData.np;
    }

    sse.onmessage = (e) => {
      const jsonData = JSON.parse(e.data);
      if ("connect" in jsonData) {
        // Initial data is sent in the "connect" response as an array of rows similar to individual messages.
        const initialData = jsonData.connect.data ?? [];
        initialData.forEach((initialRow) => handleData(initialRow));
      } else if ("channel" in jsonData) {
        handleData(jsonData);
      }
    };

    onMounted(() => {
      fetchNowPlaying();
      animationId = requestAnimationFrame(updateSlider);

      verifyUserToken();
    });

    onUnmounted(() => {
      cancelAnimationFrame(animationId);
    });

    const changePosition = () => {
      sound2.seek(state.slider);
    };

    return {
      play,
      pause,
      state,
      play2,
      pause2,
      changePosition,
      nowPlaying,
      songLiked,
      sse,
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
</style>
