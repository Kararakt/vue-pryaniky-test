<script setup lang="ts">
import BasePopup from '../UI/BasePopup/BasePopup.vue';

interface Props {
  modelValue: boolean;
  closePopup: () => boolean;
}

const emits = defineEmits<{
  (event: 'closePopup'): void;
  (event: 'update:modelValue', value: boolean): void;
}>();

const props = defineProps<Props>();

const modelUpdate = computed({
  get: () => props.modelValue,
  set: (newValue: boolean) => emits('update:modelValue', newValue),
});
</script>

<template>
  <BasePopup
    title="Произошла ошибка"
    v-model="modelUpdate"
    @close-popup="closePopup"
  >
    <template #content>
      Проверьте введенные данные или сервер недоступен
    </template>
  </BasePopup>
</template>
