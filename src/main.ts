import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { useAuthStore } from "./store/auth";

export default createVuetify({
  icons: {
    defaultSet: "mdi",
  },
});

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: () => import("./views/HomeView.vue"),
    },
    {
      path: "/",
      name: "login",
      component: () => import("./views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("./views/RegisterView.vue"),
    },
    {
      path: "/events",
      name: "events",
      component: () => import("./views/EventsView.vue"),
    },
    {
      path: "/restaurants",
      name: "restaurants",
      component: () => import("./views/RestaurantsView.vue"),
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("./views/FavoritesView.vue"),
    },
    {
      path: "/reviews",
      name: "reviews",
      component: () => import("./views/ReviewsView.vue"),
    },
    {
      path: "/events/campus",
      name: "campus-events",
      component: () => import("./views/CampusEventsView.vue"),
    },
    {
      path: "/events/city",
      name: "city-events",
      component: () => import("./views/GREventsView.vue"),
    },
  ],
});

const vuetify = createVuetify({
  components,
  directives,
});
const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(vuetify);
app.use(router);
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const publicPages = ["/", "/register"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !authStore.user) {
    return next("/");
  }
  next();
});

app.mount("#app");
