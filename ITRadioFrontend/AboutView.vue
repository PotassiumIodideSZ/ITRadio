<template>
  <div>
    <button id="play" @click="play">Play</button>
    <button id="pause" @click="pause">Pause</button>
    <input type="range" v-model="volume" min="0" max="1" step="0.01" />
  </div>
  <div>
    <button id="play2" @click="play2">Play</button>
    <button id="pause2" @click="pause2">Pause</button>
    <input type="range" v-model="slider" min="0" step="1" @input="changePosition" />
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { Howl } from "howler";

export default {
  setup() {
    const volume = ref(0);
    const slider = ref(0);

    const sound = new Howl({
      src: ["http://localhost:8000/radio.mp3"],
      html5: true,
    });

    const sound2 = new Howl({
      src: ["https://cdn.freesound.org/previews/732/732054_1648170-lq.mp3"],
      format: ["mp3"],
      onload: function () {
        slider.value = sound2.duration();
      },
    });

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

    watch(volume, (newVolume) => {
      sound.volume(newVolume);
    });
    let intervalId;

    const updateSlider = () => {
      slider.value = sound2.seek() || 0;
    };

    onMounted(() => {
      intervalId = setInterval(updateSlider, 1000); // Update every second
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });
    const changePosition = () => {
      sound2.seek(slider.value);
    };
    return {
      play,
      pause,
      volume,
      play2,
      pause2,
      slider,
      changePosition,
    };
  },
};
</script>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  margin: 0;
  font-family: Arial, sans-serif;
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

#play {
  background-color: #4caf50;
}

#pause {
  background-color: #ff9800;
}

#play2 {
  background-color: #b9f;
}

#pause2 {
  background-color: #6f6028;
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
</style>
