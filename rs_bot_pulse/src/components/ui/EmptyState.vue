<template>
  <div class="empty-state">
    <q-icon :name="icon" size="56px" />
    <div class="empty-state__title">{{ title }}</div>
    <div v-if="description">{{ description }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ icon?: string; title: string; description?: string }>(), {
  icon: 'inbox',
});
</script>
