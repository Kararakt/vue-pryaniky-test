<script setup lang="ts">
import './App.scss';
import InfoTooltip from './components/InfoTooltip/InfoTooltip.vue';

import { usePopup } from './composables/usePopup';

import Header from './layouts/Header/Header.vue';
import { login } from './utils/auth';

const { isPopupVisible, showPopup, hidePopup } = usePopup();

onMounted(() => {
  login('username14', 'password')
    .then(() => {
      console.log('Запрос прошёл успешно');
    })
    .catch((error) => {
      showPopup();
      console.error('Сервер лежит', error);
    });
});
</script>

<template>
  <div class="app">
    <Header />
    <main class="app__main">
      <RouterView />

      <InfoTooltip
        v-model="isPopupVisible"
        :closePopup="hidePopup"
        title="Предупреждение"
        description="Сервер предоставляемый для тестового задания не работает! Если интересно, можете посмотреть исходный код на github"
      />
    </main>
  </div>
</template>
