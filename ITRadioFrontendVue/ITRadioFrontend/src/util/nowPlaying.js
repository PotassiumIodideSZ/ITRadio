
import axios from "axios";

import { useUserStore } from "../stores/userCred";

const store = useUserStore();
const fetchNowPlaying = async () => {
    try {
      const response = await axios.get("http://localhost/api/nowplaying/1");
      store.nowPlayingSong = response.data.now_playing.song;
      isLiked();
    } catch (error) {
      console.error("Failed to fetch now playing data:", error);
      store.nowPlayingSong = null;
    }
  };