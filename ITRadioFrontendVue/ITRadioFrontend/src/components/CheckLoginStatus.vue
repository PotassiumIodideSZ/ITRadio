
  
  <script>
  
  export default {
    setup() {
      const isLoggedIn = () => {
        return document.cookie.split(';').some((item) => item.trim().startsWith('token='));
      };
  
      return {
        isLoggedIn,
      };
    },
  };
  </script>
  