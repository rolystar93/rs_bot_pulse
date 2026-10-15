<template>
  <AppCard title="Ganadas vs perdidas" subtitle="Distribución de resultados">
    <div class="q-mb-lg">
      <div class="row justify-between q-mb-xs">
        <span class="text-profit text-weight-medium">Ganadas · {{ summary.wins }}</span>
        <span class="text-loss text-weight-medium">Perdidas · {{ summary.losses }}</span>
      </div>
      <div class="neu-progress">
        <div class="neu-progress__bar" :style="{ width: `${summary.winRate}%` }" />
      </div>
    </div>

    <div class="text-center">
      <div class="stat-card__value tabular">{{ formatPercent(summary.winRate) }}</div>
      <div class="stat-card__label">Tasa de acierto sobre {{ summary.count }} operaciones</div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from 'components/ui/AppCard.vue';
import { formatPercent } from 'src/utils/format';
import type { TradeSummary } from 'src/utils/stats';

defineProps<{ summary: TradeSummary }>();
</script>
