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
    loading.value = true;

    const qRest = query(
      collection(db, "restaurant"),
      where("userId", "==", authStore.user.uid),
    );

    const qEvent = query(
      collection(db, "favorite_events"),
      where("userId", "==", authStore.user.uid),
    );

    const [restSnap, eventSnap] = await Promise.all([
      getDocs(qRest),
      getDocs(qEvent),
    ]);

    const restList = restSnap.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    const eventList = eventSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        docId: doc.id,
        ...data,
        restaurantName: data.title || "Untitled Event",
        address: data.location || "GVSU Campus",
        type: "Event",
      };
    });

    favorites.value = [...restList, ...eventList];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFavorites);
</script>

<template>
  <div class="favorites-page">
    <h1>My Student Hub</h1>
    <p class="subtitle">Your saved Grand Rapids spots and events!</p>

    <div v-if="loading" class="loader">Syncing...</div>

    <div v-else-if="favorites.length === 0" class="no-favorites">
      <p>You haven't saved anything yet! ❤️</p>
      <div class="d-flex justify-center flex-wrap">
        <v-btn to="/restaurants" color="primary" class="ma-2">Find Food</v-btn>
        <v-btn to="/events" color="primary" class="ma-2">Find Events</v-btn>
      </div>
    </div>

    <div v-else class="results-grid">
      <div v-for="fav in favorites" :key="fav.docId" class="biz-card">
        <div v-if="fav.type === 'Event'" class="biz-bg-box">
          <v-icon color="white" size="48">mdi-calendar-heart</v-icon>
        </div>
        <img v-else :src="fav.image" class="biz-img" />

        <div class="biz-details">
          <div>
            <h3>{{ fav.restaurantName }}</h3>
            <p class="address-text">📍 {{ fav.address }}</p>
            <div v-if="fav.type === 'Event'">
              <p class="date-text">
                📅 {{ new Date(fav.start).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div class="card-footer">
            <span
              :class="[
                'type-tag',
                fav.type === 'Event' ? 'event-tag' : 'rest-tag',
              ]"
            >
              {{ fav.type }}
            </span>
            <a
              v-if="fav.link"
              :href="fav.link"
              target="_blank"
              class="details-link"
              >Details</a
            >
          </div>
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
  height: 100%;
}

.biz-card:hover {
  transform: translateY(-5px);
}

.biz-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.biz-bg-box {
  width: 100%;
  height: 180px;
  background-color: #0032a0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 1.1rem;
  line-height: 1.2;
}

.address-text {
  font-size: 0.9rem;
  color: #666;
}
.date-text {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.type-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.event-tag {
  background: #eef2ff;
  color: #0032a0;
}

.rest-tag {
  background: #fff1f2;
  color: #d32323;
}

.details-link {
  font-size: 0.85rem;
  color: #0032a0;
  text-decoration: none;
  font-weight: 600;
}

.no-favorites {
  text-align: center;
  margin-top: 60px;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 20px;
  border: 2px dashed #ccc;
}

.loader {
  text-align: center;
  font-size: 1.2rem;
  color: #0032a0;
  margin-top: 50px;
}
</style>
