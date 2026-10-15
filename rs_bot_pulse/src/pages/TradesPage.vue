<template>
  <q-page class="app-page">
    <PageHeader title="Operaciones" subtitle="Registro de todas tus operaciones de trading">
      <AppButton variant="primary" icon="add" label="Nueva operación" @click="openCreate" />
    </PageHeader>

    <AppCard flush>
      <div class="q-pa-md">
        <AppInput v-model="search" dense clearable placeholder="Buscar por par, broker o tipo...">
          <template #prepend><q-icon name="search" /></template>
        </AppInput>
      </div>

      <TradesTable
        v-if="filtered.length"
        :trades="filtered"
        @select="openDetail"
        @edit="openEdit"
        @remove="removeTrade"
      />
      <EmptyState
        v-else
        icon="receipt_long"
        :title="tradesStore.trades.length ? 'Sin resultados' : 'Aún no hay operaciones'"
        :description="
          tradesStore.trades.length ? 'Prueba con otra búsqueda' : 'Registra tu primera operación'
        "
      />
    </AppCard>

    <TradeFormDialog v-model="dialogOpen" :trade="editing" @save="saveTrade" />
    <TradeDetailDialog
      v-model="detailOpen"
      :trade="selected"
      @edit="editSelected"
      @remove="removeSelected"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppButton from 'components/ui/AppButton.vue';
import AppCard from 'components/ui/AppCard.vue';
import AppInput from 'components/ui/AppInput.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import PageHeader from 'components/ui/PageHeader.vue';
import TradeDetailDialog from 'components/trades/TradeDetailDialog.vue';
import TradeFormDialog from 'components/trades/TradeFormDialog.vue';
import TradesTable from 'components/trades/TradesTable.vue';
import { useFeedback } from 'src/composables/use-feedback';
import { useBrokersStore } from 'src/stores/brokers-store';
import { useOperationTypesStore } from 'src/stores/operation-types-store';
import { usePairsStore } from 'src/stores/pairs-store';
import { useStrategiesStore } from 'src/stores/strategies-store';
import { useTradesStore } from 'src/stores/trades-store';
import type { ScreenshotChange, Trade, TradeInput } from 'src/types';

const tradesStore = useTradesStore();
const pairsStore = usePairsStore();
const brokersStore = useBrokersStore();
const operationTypesStore = useOperationTypesStore();
const strategiesStore = useStrategiesStore();
const { confirm, notify } = useFeedback();

const search = ref<string | number | null>('');
const dialogOpen = ref(false);
const editing = ref<Trade | null>(null);
const selected = ref<Trade | null>(null);
const detailOpen = ref(false);

const filtered = computed(() => {
  const term = String(search.value ?? '').trim().toLowerCase();
  if (!term) return tradesStore.sorted;

  return tradesStore.sorted.filter((trade) =>
    [
      pairsStore.getById(trade.pairId)?.symbol,
      brokersStore.nameOf(trade.brokerId),
      operationTypesStore.nameOf(trade.operationTypeId),
      trade.strategyId ? strategiesStore.nameOf(trade.strategyId) : '',
    ].some((text) => text?.toLowerCase().includes(term)),
  );
});

function openCreate(): void {
  editing.value = null;
  dialogOpen.value = true;
}

function openEdit(trade: Trade): void {
  editing.value = trade;
  dialogOpen.value = true;
}

function openDetail(trade: Trade): void {
  selected.value = trade;
  detailOpen.value = true;
}

function editSelected(): void {
  detailOpen.value = false;
  if (selected.value) openEdit(selected.value);
}

async function removeSelected(): Promise<void> {
  if (selected.value && (await removeTrade(selected.value))) detailOpen.value = false;
}

async function saveTrade(input: TradeInput, screenshot: ScreenshotChange): Promise<void> {
  try {
    if (editing.value) {
      await tradesStore.update(editing.value.id, input, screenshot);
      notify('Operación actualizada');
    } else {
      await tradesStore.add(input, screenshot.action === 'set' ? screenshot.file : null);
      notify('Operación registrada');
    }
  } catch {
    notify('No se pudo guardar la operación', 'negative');
  }
}

async function removeTrade(trade: Trade): Promise<boolean> {
  const accepted = await confirm({
    title: 'Eliminar operación',
    message: '¿Seguro que deseas eliminar esta operación? Esta acción no se puede deshacer.',
  });

  if (accepted) {
    await tradesStore.remove(trade.id);
    notify('Operación eliminada');
  }
  return accepted;
}
</script>
