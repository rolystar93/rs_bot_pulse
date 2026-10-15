<template>
  <AppCard :title="title" :subtitle="subtitle">
    <EmptyState v-if="!rows.length" icon="leaderboard" title="Sin datos" />

    <div v-for="row in rows" :key="row.key" class="rank-row">
      <div>
        <slot name="label" :row="row">
          <div class="text-weight-medium">{{ row.label }}</div>
        </slot>
        <div v-if="row.meta" class="rank-row__meta">{{ row.meta }}</div>
      </div>
      <MoneyValue :value="row.value" class="text-weight-bold" />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from 'components/ui/AppCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import MoneyValue from 'components/ui/MoneyValue.vue';

export interface RankingRow {
  key: string;
  label: string;
  meta?: string;
  value: number;
}

defineProps<{ title: string; subtitle?: string; rows: RankingRow[] }>();
</script>
