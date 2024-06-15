<script setup lang="ts">
import './App.scss';

import Header from './layouts/Header/Header.vue';
</script>

<template>
  <div class="app">
    <Header />
    <main>
      <RouterView />
    </main>
  </div>
</template>
