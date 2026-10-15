<template>
  <AppCard :title="title" :subtitle="subtitle">
    <EmptyState v-if="!rows.length" icon="psychology" title="Sin datos" />

    <div v-else class="breakdown">
      <div class="breakdown__row breakdown__row--head">
        <span>Estrategia</span>
        <span class="text-right">Ops.</span>
        <span class="text-right">Ganadas</span>
        <span class="text-right">Perdidas</span>
        <span class="text-right">Acierto</span>
      </div>

      <div v-for="row in rows" :key="row.key" class="breakdown__row">
        <span class="text-weight-medium breakdown__name">{{ row.label }}</span>
        <span class="text-right tabular">{{ row.count }}</span>
        <span class="text-right tabular text-profit">{{ row.wins }}</span>
        <span class="text-right tabular text-loss">{{ row.losses }}</span>
        <span class="text-right">
          <span class="tabular text-weight-bold">{{ formatPercent(row.winRate, 0) }}</span>
          <span class="neu-progress breakdown__bar">
            <span class="neu-progress__bar" :style="{ width: `${row.winRate}%` }" />
          </span>
        </span>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from 'components/ui/AppCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { formatPercent } from 'src/utils/format';

export interface BreakdownRow {
  key: string;
  label: string;
  count: number;
  wins: number;
  losses: number;
  winRate: number;
}

defineProps<{ title: string; subtitle?: string; rows: BreakdownRow[] }>();
</script>
