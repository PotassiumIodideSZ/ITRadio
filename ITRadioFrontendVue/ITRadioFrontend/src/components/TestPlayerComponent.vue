<template>
  <div class="player-container">
    <div v-if="nowPlaying.song" style="display: flex;">
        <img :src="nowPlaying.song.art" alt="Album Art" />
        <div class="info-container">
          <h2>{{ nowPlaying.song.title }}</h2>
          <h3>{{ nowPlaying.song.artist }}</h3>
        </div>
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
export default {
  name: "TestComponent",
  setup() {
    const state = reactive({
      volume: 0.5,
      slider: 0,
    });

    const nowPlaying = reactive({ song: null });

    const sound = new Howl({
      src: ["http://localhost:8000/radio.mp3"],
      html5: true,
    });

    const sound2 = new Howl({
      src: ["https://cdn.freesound.org/previews/732/732054_1648170-lq.mp3"],
      format: ["mp3"],
      onload: function () {
        state.slider = sound2.duration();
      },
    });

    const fetchNowPlaying = async () => {
      try {
        const response = await axios.get("http://localhost/api/nowplaying/1");
        nowPlaying.song = response.data.now_playing.song;
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

    onMounted(() => {
      fetchNowPlaying();
      animationId = requestAnimationFrame(updateSlider);
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
  transition: opacity .2s;
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
  background: #4CAF50;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}
</style>
