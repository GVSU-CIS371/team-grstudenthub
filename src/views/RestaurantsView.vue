<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getRestaurants } from "../store/yelpService";

const restaurants = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  restaurants.value = await getRestaurants("Grand Rapids, MI");
  loading.value = false;
});
</script>

<template>
  <div class="restaurant-page">
    <h1>Welcome to our Restaurant Guide!</h1>
    <p>Discover the best restaurants in Grand Rapids!</p>

    <div v-if="loading" class="loader">
      Finding the best food in Grand Rapids...
    </div>

    <div v-else class="results-grid">
      <div v-for="biz in restaurants" :key="biz.id" class="biz-card">
        <img :src="biz.image_url" class="biz-img" />
        <div class="biz-details">
          <h3>{{ biz.name }}</h3>
          <p>Rating: {{ biz.rating }} ⭐</p>
          <p>{{ biz.location.address1 }}</p>
          <a :href="biz.url" target="_blank" class="yelp-link">View on Yelp</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  display: grid;
  color: #0032a0;
  justify-items: center;
  margin-bottom: 0.5rem;
  font-style:
    Times New Roman,
    serif;
}
p {
  display: grid;
  font-size: 1.2rem;
  justify-items: center;
  margin-bottom: 2rem;
  color: #0032a0;
}
.loader {
  display: grid;
  justify-items: center;
  font-size: 1rem;
  color: #0032a0;
}
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}
.biz-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}
.biz-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.biz-details {
  padding: 10px;
}
.yelp-link {
  display: inline-block;
  margin-top: 10px;
  color: #d32323;
  text-decoration: none;
  font-weight: bold;
}
</style>
