import { defineStore } from "pinia";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import cityData from "../assets/cityEvents.json";

export const useEventStore = defineStore("event", {
  state: () => ({
    grEvents: [] as any[],
    campusEvents: [] as any[],
    restaurants: [] as any[],
    events: [] as any[],
    loading: false,
  }),
  actions: {
    // 1. PLACE IT HERE (Right at the top of actions)
    updateEventsList() {
      const allData = [
        ...this.grEvents,
        ...this.campusEvents,
        ...this.restaurants,
      ];

      const uniqueMap = new Map();
      allData.forEach((item) => {
        if (item.title && !uniqueMap.has(item.title)) {
          uniqueMap.set(item.title, item);
        }
      });
      this.events = Array.from(uniqueMap.values());
    },
    subscribeToEvents() {
      this.loading = true;
      this.grEvents = cityData.events || [];
      this.updateEventsList();

      const qEvents = query(collection(db, "events"), orderBy("start", "asc"));
      onSnapshot(qEvents, (snapshot) => {
        this.campusEvents = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            let eventDate = data.start;
            // Date Fixer
            if (eventDate && typeof eventDate.toDate === "function") {
              eventDate = eventDate.toDate().toISOString();
            }
            return { id: doc.id, ...data, start: eventDate };
          })
          .filter((event: any) => event.category !== "City");

        this.updateEventsList();
        this.loading = false;
      });

      const qRest = collection(db, "restaurant");
      onSnapshot(qRest, (snapshot) => {
        this.restaurants = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            title: data.restaurantName || "Unnamed Restaurant",
            category: "Restaurant",
          };
        });
        this.updateEventsList();
      });
    },
  },
});
