<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useEventStore } from "../store/eventStore";
import { useAuthStore } from "../store/auth";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const eventStore = useEventStore();
const authStore = useAuthStore();

const searchQuery = ref("");
const reviewComment = ref("");
const rating = ref(5);
const allReviews = ref<any[]>([]);

const allOptions = computed(() => {
  return eventStore.events.map((e) => e.title);
});

const submitReview = async () => {
  if (!searchQuery.value || !reviewComment.value) return;

  try {
    await addDoc(collection(db, "reviews"), {
      itemName:
        typeof searchQuery.value === "string"
          ? searchQuery.value
          : (searchQuery.value as any).title,
      comment: reviewComment.value,
      rating: rating.value,
      userId: authStore.user?.uid,
      userName: authStore.user?.displayName || "GVSU Student",
      createdAt: serverTimestamp(),
    });
    searchQuery.value = "";
    reviewComment.value = "";
    rating.value = 5;
  } catch (e) {
    console.error("Error adding review: ", e);
  }
};

onMounted(async () => {
  if (eventStore.events.length === 0) {
    eventStore.subscribeToEvents();
  }

  const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    allReviews.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
});
</script>

<template>
  <v-container class="reviews-page">
    <v-card class="pa-6 mx-auto mb-8" max-width="700" elevation="2">
      <h2 class="text-center mb-4" style="color: #0032a0">Campus Feedback</h2>

      <v-combobox
        v-model="searchQuery"
        :items="allOptions"
        label="Restaurant or Event Name"
        variant="filled"
        density="comfortable"
        class="mb-2"
      ></v-combobox>

      <v-rating v-model="rating" color="amber" class="mb-4"></v-rating>

      <v-textarea
        v-model="reviewComment"
        label="How was your experience?"
        variant="filled"
        rows="8"
        auto-grow
        persistent-hint
        class="large-input"
      ></v-textarea>

      <v-btn
        block
        color="#0032a0"
        size="large"
        @click="submitReview"
        class="text-white"
      >
        Post Review
      </v-btn>
    </v-card>

    <div class="feed-container mx-auto" style="max-width: 700px">
      <v-card
        v-for="rev in allReviews"
        :key="rev.id"
        class="mb-4 pa-4"
        variant="outlined"
      >
        <div class="d-flex justify-space-between align-center">
          <span class="font-weight-bold" style="color: #0032a0">{{
            rev.itemName
          }}</span>
          <v-rating
            :model-value="rev.rating"
            readonly
            density="compact"
            size="x-small"
            color="amber"
          ></v-rating>
        </div>
        <p class="mt-2 text-body-2">"{{ rev.comment }}"</p>
        <div class="text-caption text-grey mt-2">— {{ rev.userName }}</div>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.reviews-page {
  background: #fdfdfd;
  min-height: 100vh;
}
</style>
