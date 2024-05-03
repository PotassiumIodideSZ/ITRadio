<template>
  <div>
    <div class="login-container">
      <input v-model="username" placeholder="Username" class="login-input" />
      <input v-model="email" placeholder="Email" class="login-input" /> <!-- New email input -->
      <input type="password" v-model="password" placeholder="Password" class="login-input" />
      <button @click="handleAuth('token/')" class="login-button">Login</button>
      <button @click="handleAuth('register/')" class="register-button">Register</button> <!-- New register button -->
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/userCred";

export default {
  setup() {
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const userStore = useUserStore(); // Create an instance of the user store
    const logout = () => {
      userStore.clearUser();
      showMessage("You have been logged out.");
      // Optionally redirect or change UI state here
    };
    const handleAuth = async (endpoint) => {
  if (username.value === "" || password.value === "") {
    showMessage("Please enter a username and password.");
    return;
  }

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
  });

  const payload = {
    username: username.value,
    email: email.value,
    password: password.value,
  };

  if (endpoint === "register") {
    payload.email = email.value; // Assuming you have an email field for registration
  }

  api.post(endpoint, payload)
    .then((response) => {
      userStore.setUser(username.value, response.data.access, response.data.refresh);
      showMessage(endpoint === "register" ? "Registration successful." : "Login successful.");
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
      email,
      handleAuth,
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
.register-button {
  padding: 10px 20px;
  background-color: #4CAF50; /* Green color for distinction */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #45a049;
}
</style>
