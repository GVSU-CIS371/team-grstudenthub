<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/");
};

const categories = [
  {
    name: "Restaurants",
    icon: "🍴",
    description: "Best eats in GR",
    path: "/restaurants",
  },
  {
    name: "Events",
    icon: "📅",
    description: "Local concerts & shows",
    path: "/events",
  },
  {
    name: "Favorites",
    icon: "❤️",
    description: "Your saved spots and events",
    path: "/favorites",
  },
  {
    name: "Reviews",
    icon: "⭐",
    description: "Read and write reviews",
    path: "/reviews",
  },
];

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="home-container">
    <header class="hero">
      <h1>Welcome to the GR Student Hub!</h1>
      <h2>Everything you need for the Grand Rapids student lifestyle.</h2>
    </header>

    <div class="hub-grid">
      <div
        v-for="item in categories"
        :key="item.name"
        class="hub-card"
        @click="navigateTo(item.path)"
      >
        <div class="card-icon">{{ item.icon }}</div>
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.hero {
  margin-bottom: 3rem;
}

h1 {
  color: oklab(37.625% -0.02343 -0.18183);
  font-size: 2.5rem;
}

h2 {
  color: #666;
  font-weight: 400;
}

.hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 4rem;
}

.hub-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.hub-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: oklab(37.625% -0.02343 -0.18183);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hub-card h3 {
  margin: 0.5rem 0;
  color: #333;
}

.hub-card p {
  font-size: 0.9rem;
  color: #888;
}

.logout-section {
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 10px;
  display: inline-block;
}

.home-logout-btn {
  background-color: oklab(37.625% -0.02343 -0.18183);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
