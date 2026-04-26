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
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const eventStore = useEventStore();
const authStore = useAuthStore();

const searchQuery = ref("");
const reviewComment = ref("");
const rating = ref(5);
const allReviews = ref<any[]>([]);
const editingId = ref<string | null>(null);
const editComment = ref("");

const deleteReview = async (id: string) => {
  if (!confirm("Delete this review?")) return;
  try {
    await deleteDoc(doc(db, "reviews", id));
  } catch (e) {
    console.error("Delete failed:", e);
  }
};

const startEdit = (rev: any) => {
  editingId.value = rev.id;
  editComment.value = rev.comment;
};

const saveEdit = async (id: string) => {
  try {
    const reviewRef = doc(db, "reviews", id);
    await updateDoc(reviewRef, {
      comment: editComment.value,
      updatedAt: serverTimestamp(),
    });
    editingId.value = null;
  } catch (e) {
    console.error("Update failed:", e);
  }
};

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
        class="large-input"
      ></v-textarea>
      <v-btn
        block
        color="#0032a0"
        size="large"
        @click="submitReview"
        class="text-white"
        >Post Review</v-btn
      >
    </v-card>

    <div class="feed-container mx-auto" style="max-width: 700px">
      <v-card
        v-for="rev in allReviews"
        :key="rev.id"
        class="mb-4 pa-4 review-card"
        variant="outlined"
      >
        <div class="d-flex justify-space-between align-center mb-2">
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

        <div v-if="editingId === rev.id" class="mt-2">
          <v-textarea
            v-model="editComment"
            variant="underlined"
            rows="2"
            auto-grow
            density="compact"
          ></v-textarea>
          <div class="d-flex justify-end mt-1">
            <button
              class="emoji-btn-Cancel"
              @click="editingId = null"
              title="Cancel"
            >
              Cancel
            </button>
            <button
              class="emoji-btn-Save"
              @click="saveEdit(rev.id)"
              title="Save"
            >
              Save
            </button>
          </div>
        </div>
        <p v-else class="mt-2 text-body-2">"{{ rev.comment }}"</p>

        <div
          class="d-flex justify-space-between align-center mt-3 pt-2 border-top"
        >
          <div class="text-caption text-grey">— {{ rev.userName }}</div>

          <div v-if="rev.userId === authStore.user?.uid" class="d-flex">
            <button class="emoji-btn" @click="startEdit(rev)" title="Edit">
              ✏️
            </button>
            <button
              class="emoji-btn"
              @click="deleteReview(rev.id)"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.reviews-page {
  background: #fdfdfd;
  min-height: 100vh;
}

.review-card {
  border-radius: 12px !important;
  background: white;
}

.border-top {
  border-top: 1px solid #eeeeee;
}

.emoji-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 8px;
  transition: transform 0.1s;
}

.emoji-btn-Save {
  color: #41ad0b;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 8px;
  transition: transform 0.1s;
  border: black solid 0.5px;
}

.emoji-btn-Cancel {
  color: #d32323;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 8px;
  transition: transform 0.1s;
  border: black solid 0.5px;
}

.emoji-btn:hover {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
}
.emoji-btn-Save:hover {
  background: rgba(65, 173, 11, 0.1);
  border-radius: 6px;
}
.emoji-btn-Cancel:hover {
  background: rgba(211, 35, 35, 0.1);
  border-radius: 6px;
}
</style>
