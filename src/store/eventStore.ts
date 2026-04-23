import { defineStore } from "pinia";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";

export interface HubEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string;
  source: "GVSU" | "ExperienceGR";
  category: string;
  link: string;
}

export const useEventStore = defineStore("eventStore", {
  state: () => ({
    events: [] as HubEvent[],
    loading: true,
  }),

  getters: {
    campusEvents: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return state.events
        .filter((e) => e.source === "GVSU")
        .filter((e) => {
          const eventDate = new Date(e.start);
          if (isNaN(eventDate.getTime())) return true;
          return eventDate >= today;
        })
        .sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        );
    },
    grEvents: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return state.events
        .filter((e) => e.source === "ExperienceGR")
        .filter((e) => {
          const eventDate = new Date(e.start);
          return eventDate >= today;
        });
    },
  },

  actions: {
    subscribeToEvents() {
      this.loading = true;
      const q = query(collection(db, "events"), orderBy("start", "asc"));

      return onSnapshot(q, (snapshot) => {
        this.events = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<HubEvent, "id">),
        }));
        this.loading = false;
      });
    },
  },
});
