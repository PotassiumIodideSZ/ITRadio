<template>
  <div>
    <div class="login-container">
      <input v-model="username" placeholder="Username" class="login-input" />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        class="login-input"
      />
      <button @click="login" class="login-button">Login</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/userCred"; // Import the useUserStore function

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const userStore = useUserStore(); // Create an instance of the user store
    const logout = () => {
      userStore.clearUser();
      showMessage("You have been logged out.");
      // Optionally redirect or change UI state here
    };
    const login = async () => {
      if (username.value === "" || password.value === "") {
        showMessage("Please enter a username and password.");
        return;
      }

      const api = axios.create({
        baseURL: "http://127.0.0.1:8000/api/",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         const api = axios.create({
  // baseURL: "http://127.0.0.1:8000/api/",
  // withCredentials: true,
  //add spinner
        },
      });
      api
        .post("token/", {
          username: username.value,
          password: password.value,
        })
        .then((response) => {
          userStore.setUser(username.value, response.data.access, response.data.refresh);
        })
        .catch((error) => {
          centralizedErrorHandler(error);
        });
    };

    const centralizedErrorHandler = (error) => {
      console.error("Error:", error);
      showMessage("An error occurred. Please try again.");
    };

    const showMessage = (message) => {
      console.log(message);
    };

    return {
      username,
      password,
      login,
      logout,
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
}
.logout-button {
  padding: 10px 20px;
  background-color: #f44336; /* Red color for distinction */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #d32f2f;
}
</style>
