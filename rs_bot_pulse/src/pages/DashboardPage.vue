<template>
  <q-page class="app-page">
    <PageHeader title="Dashboard" subtitle="Resumen general de tu rendimiento">
      <AppButton variant="primary" icon="add" label="Nueva operación" to="/trades" />
    </PageHeader>

    <EmptyState
      v-if="!tradesStore.trades.length"
      icon="insights"
      title="Todavía no hay datos"
      description="Registra tus operaciones para ver estadísticas aquí"
    />

    <template v-else>
      <div class="row q-col-gutter-lg">
        <div v-for="stat in stats" :key="stat.label" class="col-12 col-sm-6 col-lg-3">
          <StatCard v-bind="stat" />
        </div>
      </div>

      <div class="row q-col-gutter-lg q-mt-xs">
        <div class="col-12 col-lg-8">
          <EquityChart :points="equityCurve" />
        </div>
        <div class="col-12 col-lg-4">
          <WinLossCard :summary="summary" />
        </div>
      </div>

      <div class="row q-col-gutter-lg q-mt-xs">
        <div class="col-12 col-md-6 col-lg-4">
          <RankingCard title="Mejores pares" subtitle="Por resultado neto" :rows="pairRows">
            <template #label="{ row }">
              <PairLabel :pair="pairsStore.getById(row.key)" />
            </template>
          </RankingCard>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <RankingCard title="Mejores horarios" subtitle="Hora de apertura" :rows="hourRows" />
        </div>
        <div class="col-12 col-lg-4">
          <RankingCard title="Por broker" subtitle="Resultado neto" :rows="brokerRows" />
        </div>
      </div>

      <div class="row q-col-gutter-lg q-mt-xs">
        <div class="col-12">
          <BreakdownCard
            title="Por estrategia"
            subtitle="Operaciones, ganadas, perdidas y % de acierto"
            :rows="strategyRows"
          />
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BreakdownCard, { type BreakdownRow } from 'components/dashboard/BreakdownCard.vue';
import EquityChart from 'components/dashboard/EquityChart.vue';
import RankingCard, { type RankingRow } from 'components/dashboard/RankingCard.vue';
import WinLossCard from 'components/dashboard/WinLossCard.vue';
import AppButton from 'components/ui/AppButton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import PageHeader from 'components/ui/PageHeader.vue';
import PairLabel from 'components/ui/PairLabel.vue';
import StatCard from 'components/ui/StatCard.vue';
import { useBrokersStore } from 'src/stores/brokers-store';
import { usePairsStore } from 'src/stores/pairs-store';
import { useStrategiesStore } from 'src/stores/strategies-store';
import { useTradesStore } from 'src/stores/trades-store';
import { formatPercent, formatSignedAmount } from 'src/utils/format';
import {
  buildEquityCurve,
  groupTrades,
  openingHour,
  type TradeGroup,
} from 'src/utils/stats';

const TOP_LIMIT = 5;

const tradesStore = useTradesStore();
const pairsStore = usePairsStore();
const brokersStore = useBrokersStore();
const strategiesStore = useStrategiesStore();

const summary = computed(() => tradesStore.summary);
const equityCurve = computed(() => buildEquityCurve(tradesStore.trades));

const stats = computed(() => [
  {
    label: 'Resultado neto',
    value: formatSignedAmount(summary.value.totalResult),
    icon: 'account_balance_wallet',
    tone: summary.value.totalResult >= 0 ? ('positive' as const) : ('negative' as const),
    hint: `ROI ${formatPercent(summary.value.roi)}`,
  },
  {
    label: 'Operaciones',
    value: summary.value.count,
    icon: 'receipt_long',
    hint: `${summary.value.wins} ganadas · ${summary.value.losses} perdidas`,
  },
  {
    label: 'Tasa de acierto',
    value: formatPercent(summary.value.winRate),
    icon: 'track_changes',
  },
  {
    label: 'Promedio por operación',
    value: formatSignedAmount(summary.value.averageResult),
    icon: 'functions',
  },
]);

function toRows(groups: TradeGroup[], labelOf: (key: string) => string): RankingRow[] {
  return groups
    .sort((a, b) => b.result - a.result)
    .slice(0, TOP_LIMIT)
    .map((group) => ({
      key: group.key,
      label: labelOf(group.key),
      meta: `${group.count} op. · ${formatPercent(group.winRate, 0)} acierto`,
      value: group.result,
    }));
}

const pairRows = computed(() =>
  toRows(groupTrades(tradesStore.trades, (t) => t.pairId), (key) => pairsStore.getById(key)?.symbol ?? key),
);

const hourRows = computed(() =>
  toRows(groupTrades(tradesStore.trades, openingHour), (key) => `${key}:00 – ${key}:59`),
);

const brokerRows = computed(() =>
  toRows(groupTrades(tradesStore.trades, (t) => t.brokerId), (key) => brokersStore.nameOf(key)),
);

const NO_STRATEGY = 'none';

// Ordenadas por cantidad de operaciones; las anteriores a las estrategias se agrupan aparte
const strategyRows = computed<BreakdownRow[]>(() =>
  groupTrades(tradesStore.trades, (t) => t.strategyId ?? NO_STRATEGY)
    .sort((a, b) => b.count - a.count)
    .map(({ key, count, wins, losses, winRate }) => ({
      key,
      label: key === NO_STRATEGY ? 'Sin estrategia' : strategiesStore.nameOf(key),
      count,
      wins,
      losses,
      winRate,
    })),
);
</script>
