<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { updateProfile } from "firebase/auth";

const authStore = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleRegister = async () => {
  errorMessage.value = "";

  try {
    await authStore.register(email.value, password.value);

    if (authStore.user) {
      await updateProfile(authStore.user, { displayName: name.value });
    }

    router.push("/home");
  } catch (err: any) {
    errorMessage.value = "Registration failed. Please check your info.";
    console.error(err.code);
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Create Account</h2>
      <div class="form-group">
        <label>Full Name</label>
        <input v-model="name" type="text" placeholder=" " />
      </div>
      <div class="form-group">
        <label>GVSU Email</label>
        <input v-model="email" type="email" placeholder="" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder=" " />
      </div>
      <button @click="handleRegister" class="auth-btn">Register</button>
      <p>Already have an account? <RouterLink to="/">Login</RouterLink></p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  outline: 3px solid black;
  outline-color: black;
}
.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
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
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: #ffffff;
  transition: border-color 0.2s;
}
button {
  background-color: oklab(37.625% -0.02343 -0.18183);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
