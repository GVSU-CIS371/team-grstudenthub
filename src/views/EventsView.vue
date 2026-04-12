<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goToCampus = () => {
  router.push("/events/campus");
};

const goToCity = () => {
  router.push("/events/city");
};
</script>

<template>
  <div class="events-portal">
    <h1>Events Finder</h1>
    <div class="portal-grid">
      <div class="portal-card campus-bg" @click="goToCampus">
        <div class="overlay">
          <h2>Campus Events</h2>
          <button class="explore-btn">Explore Allendale</button>
        </div>
      </div>

      <div class="portal-card city-bg" @click="goToCity">
        <div class="overlay">
          <h2>City Events</h2>
          <button class="explore-btn">Explore Downtown</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.events-portal {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  color: #0032a0;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  margin-bottom: 40px;
}

.portal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.portal-card {
  height: 400px;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.campus-bg {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("gvsu.jpg");
}

.city-bg {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url("grandrapids.jpg");
}

.overlay {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background: rgba(0, 0, 0, 0.1);
}
.portal-card:hover .overlay {
  background: rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2rem;
  margin-bottom: 5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.explore-btn {
  margin-top: 25px;
  padding: 12px 30px;
  border: 2px solid white;
  background: transparent;
  color: white;
  border-radius: 30px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.portal-card:hover .explore-btn {
  background: white;
  color: #0032a0;
}

@media (max-width: 768px) {
  .portal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
