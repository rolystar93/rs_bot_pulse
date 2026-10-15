<template>
  <AppCard>
    <div class="stat-card">
      <div :class="['stat-card__icon', tone && `stat-card__icon--${tone}`]">
        <q-icon :name="icon" />
      </div>
      <div>
        <div class="stat-card__label">{{ label }}</div>
        <div :class="['stat-card__value tabular', tone === 'positive' && 'text-profit', tone === 'negative' && 'text-loss']">
          {{ value }}
        </div>
        <div v-if="hint" class="stat-card__hint">{{ hint }}</div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from './AppCard.vue';

defineProps<{
  label: string;
  value: string | number;
  icon: string;
  hint?: string;
  tone?: 'positive' | 'negative';
}>();
</script>
