<template>
  <div class="detail-item">
    <div class="detail-item__label">{{ label }}</div>
    <div class="detail-item__value">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string | number }>();
</script>
