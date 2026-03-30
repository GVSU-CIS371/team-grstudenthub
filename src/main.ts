import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./views/HomeView.vue"),
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
app.mount("#app");
