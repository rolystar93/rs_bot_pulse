<template>
  <section :class="['app-card', { 'app-card--flush': flush }]">
    <header v-if="title || $slots.actions" class="app-card__header">
      <div>
        <div class="app-card__title">{{ title }}</div>
        <div v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</div>
      </div>
      <slot name="actions" />
    </header>

    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string | undefined;
  subtitle?: string | undefined;
  /** Sin padding interno (útil para tablas) */
  flush?: boolean;
}>();
</script>
