<template>
  <q-btn
    unelevated
    no-caps
    :class="['app-btn', `app-btn--${variant}`]"
  >
    <slot />
  </q-btn>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'danger' | 'flat';
  }>(),
  { variant: 'default' },
);
</script>
