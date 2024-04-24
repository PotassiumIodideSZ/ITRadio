
<template>
  <div>
    <div class="login-container">
      <input v-model="username" placeholder="Username" class="login-input">
      <input type="password" v-model="password" placeholder="Password" class="login-input">
      <button @click="login" class="login-button">Login</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const username = ref('');
    const password = ref('');

    const login = async () => {
      if (username.value === '' || password.value === '') {
        showMessage('Please enter a username and password.');
        return;
      }
      
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
          username: username.value,
          password: password.value,
        });
        document.cookie = `token=${response.data.token}; path=/; httpOnly`;
        // Redirect or perform other actions after successful login
      } catch (error) {
        centralizedErrorHandler(error);
      }
    };

    const centralizedErrorHandler = (error) => {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again.');
    };

    const showMessage = (message) => {
      console.log(message);
    };

    return {
      username,
      password,
      login,
    };
    
  },
};
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.login-input {
  margin-bottom: 10px;
  padding: 8px;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>