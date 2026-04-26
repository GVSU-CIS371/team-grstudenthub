import { defineStore } from "pinia";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import cityData from "../assets/cityEvents.json";

export const useEventStore = defineStore("event", {
  state: () => ({
    grEvents: [] as any[],
    campusEvents: [] as any[],
    events: [] as any[],
    loading: false,
  }),
  actions: {
    subscribeToEvents() {
      this.loading = true;

      this.grEvents = cityData.events || [];

      try {
        const q = query(collection(db, "events"), orderBy("start", "asc"));

        onSnapshot(
          q,
          (snapshot) => {
            const allFirestoreEvents = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            this.campusEvents = allFirestoreEvents.filter(
              (event: any) => event.category !== "City",
            );
            this.events = [...this.grEvents, ...this.campusEvents];
            this.loading = false;
          },
          (error) => {
            console.error("Firestore error:", error);
            this.loading = false;
          },
        );
      } catch (e) {
        console.error("Setup error:", e);
        this.loading = false;
      }
    },
  },
});
