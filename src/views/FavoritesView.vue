<script setup lang="ts">
import { ref, onMounted } from "vue";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();
const favorites = ref<any[]>([]);
const loading = ref(true);

const fetchFavorites = async () => {
  if (!authStore.user) return;

  try {
    const q = query(
      collection(db, "restaurant"),
      where("userId", "==", authStore.user.uid),
    );

    const querySnapshot = await getDocs(q);
    favorites.value = querySnapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching favorites:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFavorites);
</script>

<template>
  <div class="favorites-page">
    <h1>My Student Hub</h1>
    <p class="subtitle">Your saved Grand Rapids spots!</p>

    <div v-if="loading" class="loader">Loading your favorites...</div>

    <div v-else-if="favorites.length === 0" class="no-favorites">
      <p>You haven't saved any favorites yet! ❤️</p>
      <v-btn to="/restaurants" color="primary">Find Restaurants</v-btn>
    </div>

    <div v-else class="results-grid">
      <div v-for="fav in favorites" :key="fav.docId" class="biz-card">
        <img :src="fav.image" class="biz-img" />
        <div class="biz-details">
          <h3>{{ fav.restaurantName }}</h3>
          <p class="address-text">📍 {{ fav.address }}</p>
          <p class="type-tag">{{ fav.type }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Inter", sans-serif;
}

h1 {
  color: #0032a0;
  font-size: 2.5rem;
  margin-bottom: 5px;
}

.subtitle {
  color: #0032a0;
  font-size: 1.1rem;
  margin-bottom: 40px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.biz-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
}

.biz-card:hover {
  transform: translateY(-5px);
}

.biz-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.biz-details {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.25rem;
  line-height: 1.2;
}

.type-tag {
  display: inline-block;
  background: #eef2ff;
  color: #0032a0;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  align-self: flex-start;
}

.no-favorites {
  text-align: center;
  margin-top: 60px;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 20px;
  border: 2px dashed #ccc;
}

.no-favorites p {
  font-size: 1.3rem;
  color: #0032a0;
  margin-bottom: 20px;
}

.loader {
  text-align: center;
  font-size: 1.2rem;
  color: #0032a0;
  margin-top: 50px;
}
</style>
