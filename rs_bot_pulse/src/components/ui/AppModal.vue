<template>
  <q-dialog v-model="model" persistent transition-show="fade" transition-hide="fade" @hide="emit('hide')">
    <!-- Debe ser un <div>: Quasar solo habilita pointer-events en hijos div directos -->
    <div :class="['app-dialog', wide && 'app-dialog--wide']">
      <div class="app-dialog__title">
        <q-icon v-if="icon" :name="icon" color="primary" size="28px" />
        <span>{{ title }}</span>
      </div>

      <slot />

      <div v-if="$slots.actions" class="app-dialog__actions">
        <slot name="actions" />
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps<{ title: string; icon?: string | undefined; wide?: boolean }>();

const emit = defineEmits<{ hide: [] }>();
const model = defineModel<boolean>({ required: true });
</script>
