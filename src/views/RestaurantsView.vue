<script setup lang="ts">
import { ref, onMounted } from "vue";
import restaurantData from "../assets/restaurants.json";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();

const restaurants = ref<any[]>([]);
const loading = ref(true);

onMounted(() => {
  restaurants.value = restaurantData.businesses || restaurantData;

  setTimeout(() => {
    loading.value = false;
  }, 500);
});

const addToFavorites = async (item: any) => {
  if (!authStore.user?.uid) {
    alert("You aren't logged in!");
    return;
  }

  try {
    await addDoc(collection(db, "restaurant"), {
      userId: authStore.user.uid,
      restaurantName: item.name || "Missing Name",
      restaurantId: item.id || "Missing ID",
      image: item.image_url || "",
      address: item.location?.address1 || "Address not available",
      type: "Restaurant",
    });

    alert(`${item.name} saved!`);
  } catch (e) {
    console.error("CHECK 4: Firebase Error ->", e);
  }
};
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
        <button class="emoji-btn" @click="addToFavorites(biz)">❤️</button>

        <img :src="biz.image_url" class="biz-img" />

        <div class="biz-details">
          <h3>{{ biz.name }}</h3>
          <p>Rating: {{ biz.rating }} ⭐</p>
          <p>{{ biz.location?.address1 }}</p>
          <a :href="biz.url" target="_blank" class="yelp-link">View on Yelp</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  padding: 20px;
}

.biz-card {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.biz-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.emoji-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.biz-details {
  padding: 15px;
}

.biz-details p {
  display: block;
  margin: 5px 0;
  color: #555;
  font-size: 1rem;
}

h3 {
  margin: 0;
  color: #333;
}

.biz-details p {
  margin: 2px 0;
  font-size: 1rem;
  color: #555;
  text-align: left;
  justify-items: start;
}

.yelp-link {
  margin-top: 12px;
  color: #d32323;
  text-decoration: none;
  font-weight: bold;
}

.loader {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2rem;
  color: #0032a0;
}
h1 {
  color: #0032a0;
  font-size: 2.5rem;
}
h1 + p {
  color: #0032a0;
  font-size: 1.2rem;
}
</style>
