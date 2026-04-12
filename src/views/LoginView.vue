<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  try {
    await authStore.login(email.value, password.value);

    router.push("/home");
  } catch (err: any) {
    errorMessage.value = "Invalid email or password. Please try again.";
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Student Login</h2>

      <p
        v-if="errorMessage"
        style="
          color: #d32f2f;
          font-weight: bold;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        "
      >
        {{ errorMessage }}
      </p>

      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email" required />
      </div>

      <div class="form-group">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
      </div>

      <button @click="handleLogin" class="auth-btn">Sign In</button>

      <p class="toggle-text">
        New to the Hub? <RouterLink to="/register">Create Account</RouterLink>
      </p>
    </div>
  </div>
</template>

<
<style scoped>
.auth-page {
  /* 1. This pins the background to the WHOLE viewport */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  /* 2. Z-index -1 moves the image BEHIND your navbar */
  z-index: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  background-image:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url("../assets/gvsu.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* We make the card sit on top of the fixed background */
.auth-card {
  position: relative;
  z-index: 1;
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
  transition: opacity 0.2s;
}

.auth-btn:hover {
  opacity: 0.9;
}

.toggle-text {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #fff; /* White for better visibility on the photo */
}

.toggle-text a {
  color: white;
  text-decoration: underline;
  font-weight: bold;
}
</style>
