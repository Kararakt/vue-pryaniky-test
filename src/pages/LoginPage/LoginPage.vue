<script setup lang="ts">
import './LoginPage.scss';

import { login } from '../../utils/auth';
import router from '../../router/router';
import { usePopup } from '../../composables/usePopup';
import { handleResponseError } from '../../utils/errorHandler';

import BaseInput from '../../components/UI/BaseInput/BaseInput.vue';
import InfoTooltip from '../../components/InfoTooltip/InfoTooltip.vue';

const { isPopupVisible, showPopup, hidePopup } = usePopup();

const disableButton = ref<boolean>(false);

const username = ref<string>('');
const password = ref<string>('');

const handleLogin = async () => {
  disableButton.value = true;

  login(username.value, password.value)
    .then((res) => {
      handleResponseError(res);

      localStorage.setItem('jwt', res.data.token);
      router.push('/');
    })
    .catch((error) => {
      showPopup();
      console.log('Произошла ошибка авторизации', error);
    })
    .finally(() => {
      disableButton.value = false;
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
      <button :disabled="disableButton" type="submit" class="login__button">
        {{ disableButton ? 'Заходим...' : 'Войти' }}
      </button>
    </form>
    <span>Пользователь - username{N}</span>
    <span>Пароль - password</span>
  </section>

  <InfoTooltip
    v-model="isPopupVisible"
    :closePopup="hidePopup"
    title="Ошибка входа"
    description="Проверьте введенные данные, подсказка под кнопкой!"
  />
</template>
