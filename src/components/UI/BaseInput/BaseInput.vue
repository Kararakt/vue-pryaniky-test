<script setup lang="ts">
interface Props {
  modelValue: string;
  type: 'text' | 'password' | 'email';
  name: string;
  placeholder: string;
  minLength?: number;
  maxLength?: number;
}

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  minLength: 0,
  maxLength: Infinity,
});

const modelUpdate = computed({
  get: () => props.modelValue,
  set: (newValue: string) => emit('update:modelValue', newValue),
});
</script>

<template>
  <input
    v-model="modelUpdate"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    autocomplete="off"
    :minlength="minLength"
    :maxlength="maxLength"
    required
  />
</template>
