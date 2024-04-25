
import { useUserStore } from "../stores/userCred";
import axios from "axios";

export default async function isLoggedIn() {
  const userStore = useUserStore();
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  try {
    const response = await api.post("token/verify/", {
      token: userStore.token,
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};