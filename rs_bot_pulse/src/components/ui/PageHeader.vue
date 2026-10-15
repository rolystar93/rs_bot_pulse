<template>
  <header class="page-header">
    <div>
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <slot />
  </header>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>();
</script>
