<template>
  <AppCard title="Evolución del resultado" subtitle="Resultado acumulado por fecha de cierre">
    <ApexChart v-if="series[0]!.data.length" type="area" height="300" :options="options" :series="series" />
    <EmptyState v-else icon="show_chart" title="Sin datos para graficar" />
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ApexOptions } from 'apexcharts';
import AppCard from 'components/ui/AppCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { baseChartOptions } from 'src/constants/chart-theme';
import type { EquityPoint } from 'src/utils/stats';
import { formatAmount } from 'src/utils/format';

const props = defineProps<{ points: EquityPoint[] }>();

const series = computed(() => [{ name: 'Acumulado', data: props.points }]);

const options = computed<ApexOptions>(() => {
  const base = baseChartOptions();
  const lastValue = props.points.at(-1)?.y ?? 0;
  const color = lastValue >= 0 ? '#2fd48a' : '#ff5d73';

  return {
    ...base,
    colors: [color],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90, 100] },
    },
    xaxis: { ...base.xaxis, type: 'datetime' },
    yaxis: {
      labels: { style: { colors: '#9aa4bd' }, formatter: (v: number) => formatAmount(v) },
    },
    tooltip: { theme: 'dark', x: { format: 'dd/MM/yyyy HH:mm' } },
  };
});
</script>
