<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/");
};
</script>

<template>
  <div class="home-container">
    <h1>Welcome to the GR Student Hub!</h1>
    <h2>Best app to find all you need to have fun in Grand Rapids!</h2>

    <div v-if="auth.isLoggedIn" class="logout-section">
      <p>Hi, {{ auth.user.displayName }}! You are currently signed in.</p>
      <button @click="handleLogout" class="home-logout-btn">
        Logout of Account
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  text-align: center;
}

.logout-section {
  margin-top: 3rem;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: inline-block;
}

.home-logout-btn {
  background-color: oklab(37.625% -0.02343 -0.18183);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}

.home-logout-btn:hover {
  opacity: 0.9;
}
h1 {
  color: oklab(37.625% -0.02343 -0.18183);
  margin-bottom: 1rem;
}
h2 {
  color: #555;
  margin-bottom: 2rem;
  font-size: small;
}
</style>
