<template>
    <div>
      <LikedSongsComponent />
    </div>
  </template>
  
  <script>
  import LikedSongsComponent from "@/components/LikedSongs.vue";
  
  export default {
    name: "LikedSongsView",
    components: {
      LikedSongsComponent,
    },
  };
  </script>
  