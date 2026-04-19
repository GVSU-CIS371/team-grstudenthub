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
  flex-shrink: 0;

  a {
    color: white !important;
    text-decoration: none !important;
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
.user-greet {
  margin-right: 10px;
  font-weight: 500;
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
  min-height: calc(100vh - 65px);
  width: 100%;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: #ffffff !important;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;

  h2 {
    color: oklab(37.625% -0.02343 -0.18183) !important;
    margin-bottom: 1.5rem;
  }

  p {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #444444 !important;

    a {
      color: oklab(37.625% -0.02343 -0.18183) !important;
      font-weight: bold;
      text-decoration: none;
    }
  }
}

.form-group {
  text-align: left;
  margin-bottom: 1rem;

  label {
    display: block;
    font-size: 0.85rem;
    margin-bottom: 5px;
    color: #333333 !important;
    font-weight: 600;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #333333 !important;
    border-radius: 6px;
    font-size: 1rem;
    color: #000000 !important;
    background-color: #ffffff !important;
  }
}

.auth-btn {
  width: 100%;
  padding: 12px;
  background-color: oklab(37.625% -0.02343 -0.18183);
  color: #ffffff !important;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
}
</style>
