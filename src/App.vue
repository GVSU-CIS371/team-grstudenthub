<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/");
};
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/home" class="logo-link">
      <div class="logo">
        <span class="logo-icon">🏠</span>
        GR Student Hub
      </div>
    </RouterLink>

    <ul class="nav-menu">
      <li v-if="auth.isLoggedIn">
        <span class="user-greet">Hi, {{ auth.user?.displayName }}!</span>
        <button class="logout-btn" @click="handleLogout">Logout</button>
      </li>
    </ul>
  </nav>

  <RouterView />
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: oklab(37.625% -0.02343 -0.18183);
  color: #ffffff;
  position: relative;
  z-index: 10;

  a {
    color: white !important;
    text-decoration: none !important;
    &:visited,
    &:active {
      color: white !important;
      text-decoration: none !important;
      outline: none;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  .nav-menu {
    display: flex;
    align-items: center;
    gap: 15px;
    list-style: none;
  }

  .logo {
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }

  .user-greet {
    margin-right: 10px;
  }

  .logout-btn {
    background: transparent;
    border: 1px solid white;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
}

.auth-page {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url("./assets/gvsu.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    color: oklab(37.625% -0.02343 -0.18183);
    margin-bottom: 1.5rem;
  }
}

.auth-btn {
  width: 100%;
  padding: 12px;
  background-color: oklab(37.625% -0.02343 -0.18183);
}
</style>
