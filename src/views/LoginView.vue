<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = () => {
  router.push("/home");
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Student Login</h2>

      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email" />
      </div>

      <div class="form-group">
        <input v-model="password" type="password" placeholder="Password" />
      </div>

      <button @click="handleLogin" class="auth-btn">Sign In</button>

      <p class="toggle-text">
        New to the Hub? <RouterLink to="/register">Create Account</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f5f5f5;
}

.auth-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  margin-bottom: 2rem;
  color: oklab(37.625% -0.02343 -0.18183);
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 8px;
  font-weight: 600;
  color: #666;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.auth-btn {
  width: 100%;
  background-color: oklab(37.625% -0.02343 -0.18183);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  margin-bottom: 1rem;
  transition: opacity 0.2s;
}

.auth-btn:hover {
  opacity: 0.9;
}

.toggle-text {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.toggle-text a {
  color: oklab(37.625% -0.02343 -0.18183);
  text-decoration: none;
  font-weight: bold;
}
</style>
