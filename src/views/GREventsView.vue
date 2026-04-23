<script setup lang="ts">
import { onMounted } from "vue";
import { useEventStore } from "../store/eventStore";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuthStore } from "../store/auth";

const eventStore = useEventStore();
const authStore = useAuthStore();

onMounted(() => {
  eventStore.subscribeToEvents();
});

const addToFavorites = async (event: any) => {
  if (!authStore.user?.uid) {
    alert("You aren't logged in!");
    return;
  }

  try {
    await addDoc(collection(db, "favorite_events"), {
      userId: authStore.user.uid,
      title: event.title || "Untitled Event",
      eventId: event.id || "no-id",
      start: event.start || "",
      location: event.location || "Grand Rapids",
      link: event.link || "",
      source: event.source || "ExperienceGR",
      type: "Event",
      savedAt: new Date().toISOString(),
    });

    alert(`⭐️ ${event.title} saved!`);
  } catch (e) {
    console.error("Firebase Add Error:", e);
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Date TBD";
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <div class="restaurant-page">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="$router.push('/events')"
      style="color: #d32323"
    >
      ⬅️ Back to Finder
    </v-btn>

    <h1>🌆 City Events</h1>
    <p>Discover what's happening in Downtown Grand Rapids!</p>

    <div v-if="eventStore.loading" class="loader">Loading city life...</div>

    <div v-else class="results-grid">
      <div
        v-for="event in eventStore.grEvents"
        :key="event.id"
        class="biz-card"
      >
        <button class="emoji-btn" @click="addToFavorites(event)">❤️</button>

        <div class="biz-bg-box">
          <v-icon color="white" size="48">mdi-city-variant-outline</v-icon>
        </div>

        <div class="biz-details">
          <h3>{{ event.title }}</h3>
          <p class="date-text">📅 {{ formatDate(event.start) }}</p>
          <p>📍 {{ event.location }}</p>
          <p class="description-text">{{ event.description }}</p>
          <a :href="event.link" target="_blank" class="yelp-link"
            >View Details</a
          >
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

.biz-bg-box {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #333333 0%, #d32323 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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
}

.biz-details {
  padding: 15px;
}

h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  line-height: 1.3;
}

.date-text {
  font-weight: bold;
  color: #d32323 !important;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.85rem !important;
  color: #555;
  margin: 8px 0;
}

.yelp-link {
  display: inline-block;
  margin-top: 12px;
  color: #d32323;
  text-decoration: none;
  font-weight: bold;
}

.loader {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2rem;
  color: #d32323;
}

h1 {
  color: #333;
  font-size: 2.5rem;
  margin-top: 10px;
}

h1 + p {
  color: #666;
  font-size: 1.2rem;
  padding: 0 20px;
}
</style>
