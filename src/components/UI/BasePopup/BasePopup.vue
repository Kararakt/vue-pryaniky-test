<script setup lang="ts">
import './BasePopup.scss';

interface Props {
  modelValue: boolean;
  title: string;
}

const emits = defineEmits<{
  (event: 'closePopup'): void;
  (event: 'update:modelValue', value: boolean): void;
}>();

const props = defineProps<Props>();

const popup = ref<Element | null>(null);

const modelUpdate = computed({
  get: () => props.modelValue,
  set: (newValue: boolean) => emits('update:modelValue', newValue),
});

const closePopup = () => emits('closePopup');

const handleCloseByEsc = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && modelUpdate.value) {
    closePopup();
  }
};

const handleCloseByOverlay = (event: Event) => {
  if (event.target === popup.value) {
    closePopup();
  }
};

const addEventListeners = () => {
  document.addEventListener('keydown', handleCloseByEsc);

  document.addEventListener('click', handleCloseByOverlay);
};

const removeEventListeners = () => {
  document.removeEventListener('keydown', handleCloseByEsc);

  document.removeEventListener('click', handleCloseByOverlay);
};

onMounted(addEventListeners);

onUnmounted(removeEventListeners);

watch(modelUpdate, () => {
  document.body.style.overflowY = modelUpdate.value ? 'hidden' : 'auto';
});
</script>

<template>
  <Transition name="popup">
    <section v-if="modelUpdate" ref="popup" class="popup">
      <div class="popup__content">
        <font-awesome-icon
          icon="fa-solid fa-x"
          class="popup__close"
          @click="closePopup"
        />
        <h2 class="popup__title">{{ title }}</h2>
        <slot name="content"></slot>
      </div>
    </section>
  </Transition>
</template>
