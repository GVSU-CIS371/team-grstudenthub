<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./store/auth";

const auth = useAuthStore();

const handleLogout = () => {
  auth.logout();
};
</script>

<template>
  <nav class="navbar">
    <div class="logo">GR Student Hub</div>

    <ul class="nav-menu">
      <li v-if="auth.isLoggedIn">
        <span class="user-greet">Hi, {{ auth.user.displayName }}!</span>
        <button class="logout-btn" @click="handleLogout">Logout</button>
      </li>
    </ul>
  </nav>

  <RouterView />
</template>

<style lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: oklab(37.625% -0.02343 -0.18183);
  color: #ffffff;

  .nav-menu {
    display: flex;
    align-items: center;
    gap: 15px;
    list-style: none;
  }

  .nav-link {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
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
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
}
</style>
