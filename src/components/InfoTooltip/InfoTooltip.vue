<script setup lang="ts">
import BasePopup from '../UI/BasePopup/BasePopup.vue';

interface Props {
  modelValue: boolean;
  title: string;
  description: string;
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
  <BasePopup :title="title" v-model="modelUpdate" @close-popup="closePopup">
    <template #content>
      {{ description }}
    </template>
  </BasePopup>
</template>
