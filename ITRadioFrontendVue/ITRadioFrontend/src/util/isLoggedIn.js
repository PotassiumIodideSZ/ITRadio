import store from './store'; // Vuex store

export function isLoggedIn() {
  return store.getters['auth/loggedIn']; // replace with your Vuex getter
}