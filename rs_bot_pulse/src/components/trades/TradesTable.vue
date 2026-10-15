<template>
  <q-table
    flat
    class="app-table table-row-clickable"
    row-key="id"
    :rows="trades"
    :columns="columns"
    :rows-per-page-options="[10, 25, 50]"
    rows-per-page-label="Filas"
    no-data-label="Sin operaciones"
    @row-click="(_evt, row) => emit('select', row)"
  >
    <template #body-cell-pair="{ row }">
      <q-td>
        <PairLabel :pair="pairsStore.getById(row.pairId)" />
      </q-td>
    </template>

    <template #body-cell-result="{ row }">
      <q-td class="text-right text-weight-bold">
        <MoneyValue :value="row.result" />
      </q-td>
    </template>

    <template #body-cell-actions="{ row }">
      <q-td class="text-right">
        <q-icon v-if="row.screenshotId" name="image" size="20px" class="text-soft q-mr-sm">
          <q-tooltip>Tiene captura</q-tooltip>
        </q-icon>
        <AppButton round dense variant="flat" icon="edit" @click.stop="emit('edit', row)" />
        <AppButton round dense variant="flat" icon="delete_outline" @click.stop="emit('remove', row)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import AppButton from 'components/ui/AppButton.vue';
import MoneyValue from 'components/ui/MoneyValue.vue';
import PairLabel from 'components/ui/PairLabel.vue';
import { useBrokersStore } from 'src/stores/brokers-store';
import { useOperationTypesStore } from 'src/stores/operation-types-store';
import { usePairsStore } from 'src/stores/pairs-store';
import { useStrategiesStore } from 'src/stores/strategies-store';
import type { Trade } from 'src/types';
import { formatAmount, formatDateTime } from 'src/utils/format';

defineProps<{ trades: Trade[] }>();
const emit = defineEmits<{ select: [trade: Trade]; edit: [trade: Trade]; remove: [trade: Trade] }>();

const pairsStore = usePairsStore();
const brokersStore = useBrokersStore();
const operationTypesStore = useOperationTypesStore();
const strategiesStore = useStrategiesStore();

const columns: QTableColumn<Trade>[] = [
  {
    name: 'openedAt',
    label: 'Apertura',
    field: 'openedAt',
    align: 'left',
    sortable: true,
    format: (value: string) => formatDateTime(value),
  },
  {
    name: 'closedAt',
    label: 'Cierre',
    field: 'closedAt',
    align: 'left',
    format: (value: string) => formatDateTime(value),
  },
  { name: 'pair', label: 'Par', field: 'pairId', align: 'left' },
  { name: 'timeframe', label: 'TF', field: 'timeframe', align: 'center' },
  {
    name: 'broker',
    label: 'Broker',
    field: 'brokerId',
    align: 'left',
    format: (value: string) => brokersStore.nameOf(value),
  },
  {
    name: 'operationType',
    label: 'Tipo',
    field: 'operationTypeId',
    align: 'left',
    format: (value: string) => operationTypesStore.nameOf(value),
  },
  {
    name: 'strategy',
    label: 'Estrategia',
    field: (row: Trade) => row.strategyId ?? '',
    align: 'left',
    format: (value: string) => (value ? strategiesStore.nameOf(value) : '—'),
  },
  {
    name: 'investment',
    label: 'Inversión',
    field: 'investment',
    align: 'right',
    format: (value: number) => formatAmount(value),
  },
  { name: 'result', label: 'Resultado', field: 'result', align: 'right', sortable: true },
  { name: 'actions', label: '', field: 'id', align: 'right' },
];
</script>
