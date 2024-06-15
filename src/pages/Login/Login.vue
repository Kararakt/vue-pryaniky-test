<script setup lang="ts">
import './Login.scss';

import { login } from '../../utils/auth';

import BaseInput from '../../components/UI/BaseInput/BaseInput.vue';

const buttonText = ref<boolean>(false);
const popupActive = ref<boolean>(false);

const username = ref<string>('');
const password = ref<string>('');

const handleClosePopup = () => (popupActive.value = false);

const handleLogin = async () => {
  buttonText.value = true;
  return login(username.value, password.value)
    .then((res) => {
      if (res.error_code === 2004) {
        throw new Error('Ошибка, проверьте введенные данные');
      }

      localStorage.setItem('jwt', res.data.token);
    })
    .catch((error) => {
      popupActive.value = true;
      console.log('Произошла ошибка авторизации', error);
    })
    .finally(() => {
      buttonText.value = false;
    });
};
</script>

<template>
  <section class="login">
    <h2 class="login__title">Вход</h2>
    <form @submit.prevent="handleLogin" class="login__form">
      <BaseInput
        v-model="username"
        type="text"
        name="username"
        placeholder="Введите имя пользователя"
        :minLength="4"
      />
      <BaseInput
        type="password"
        v-model="password"
        name="password"
        placeholder="Введите пароль"
        :minLength="4"
      />
      <button type="submit">{{ buttonText ? 'Заходим...' : 'Войти' }}</button>
    </form>
    <span>Пользователь - username{N}</span>
    <span>Пароль - password</span>
  </section>

  <InfoTooltip v-model="popupActive" :closePopup="handleClosePopup" />
</template>
