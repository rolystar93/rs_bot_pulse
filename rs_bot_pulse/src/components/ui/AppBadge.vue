<template>
  <span :class="['app-badge', tone && `app-badge--${tone}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{ tone?: 'positive' | 'negative' }>();
</script>
