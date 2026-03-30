<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <nav class="navbar">
    <div class="logo">GR Student Hub</div>
    <ul class="nav-menu">
      <li><RouterLink to="/">Home</RouterLink></li>
    </ul>
  </nav>
  <RouterView />
</template>

<style lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: oklab(37.625% -0.02343 -0.18183);
  color: #ffffff;
}
</style>
