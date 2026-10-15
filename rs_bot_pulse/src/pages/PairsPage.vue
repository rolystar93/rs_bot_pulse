<template>
  <q-page class="app-page">
    <PageHeader title="Pares" subtitle="Pares predeterminados y los que agregues tú">
      <AppButton variant="primary" icon="add" label="Nuevo par" @click="openCreate" />
    </PageHeader>

    <AppCard flush>
      <div class="q-pa-md">
        <AppInput v-model="search" dense clearable placeholder="Buscar par...">
          <template #prepend><q-icon name="search" /></template>
        </AppInput>
      </div>

      <q-table
        v-if="filtered.length"
        flat
        class="app-table"
        row-key="id"
        :rows="filtered"
        :columns="columns"
        :rows-per-page-options="[10, 25, 50]"
        rows-per-page-label="Filas"
      >
        <template #body-cell-symbol="{ row }">
          <q-td><PairLabel :pair="row" /></q-td>
        </template>
        <template #body-cell-category="{ row }">
          <q-td>
            <AppBadge>{{ row.category === 'custom' ? 'Personalizado' : 'Predeterminado' }}</AppBadge>
          </q-td>
        </template>
        <template #body-cell-actions="{ row }">
          <q-td class="text-right">
            <template v-if="row.category === 'custom'">
              <AppButton round dense variant="flat" icon="edit" @click="openEdit(row)">
                <q-tooltip>Editar</q-tooltip>
              </AppButton>
              <AppButton round dense variant="flat" icon="delete_outline" @click="removePair(row)">
                <q-tooltip>Eliminar</q-tooltip>
              </AppButton>
            </template>
          </q-td>
        </template>
      </q-table>
      <EmptyState v-else icon="currency_exchange" title="Sin resultados" description="Prueba con otra búsqueda" />
    </AppCard>

    <PairFormDialog v-model="dialogOpen" :pair="editing" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import PairFormDialog from 'components/pairs/PairFormDialog.vue';
import AppBadge from 'components/ui/AppBadge.vue';
import AppButton from 'components/ui/AppButton.vue';
import AppCard from 'components/ui/AppCard.vue';
import AppInput from 'components/ui/AppInput.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import PageHeader from 'components/ui/PageHeader.vue';
import PairLabel from 'components/ui/PairLabel.vue';
import { useFeedback } from 'src/composables/use-feedback';
import { usePairsStore } from 'src/stores/pairs-store';
import { useTradesStore } from 'src/stores/trades-store';
import type { TradingPair } from 'src/types';

const pairsStore = usePairsStore();
const tradesStore = useTradesStore();
const { confirm, notify } = useFeedback();

const search = ref<string | number | null>('');
const dialogOpen = ref(false);
const editing = ref<TradingPair | null>(null);

function openCreate(): void {
  editing.value = null;
  dialogOpen.value = true;
}

function openEdit(pair: TradingPair): void {
  editing.value = pair;
  dialogOpen.value = true;
}

const tradesOf = (pairId: string): number => tradesStore.countBy('pairId', pairId);

const columns: QTableColumn[] = [
  { name: 'symbol', label: 'Par', field: 'symbol', align: 'left', sortable: true },
  { name: 'category', label: 'Tipo', field: 'category', align: 'left', sortable: true },
  {
    name: 'trades',
    label: 'Operaciones',
    field: (row: TradingPair) => tradesOf(row.id),
    align: 'right',
    sortable: true,
  },
  { name: 'actions', label: '', field: 'id', align: 'right' },
];

const filtered = computed(() => {
  const term = String(search.value ?? '').trim().toLowerCase();
  if (!term) return pairsStore.pairs;
  return pairsStore.pairs.filter((pair) => pair.symbol.toLowerCase().includes(term));
});

async function removePair(pair: TradingPair): Promise<void> {
  if (tradesOf(pair.id)) {
    notify('No puedes eliminar un par con operaciones registradas', 'negative');
    return;
  }

  const accepted = await confirm({
    title: 'Eliminar par',
    message: `¿Eliminar el par ${pair.symbol}?`,
  });

  if (accepted) {
    pairsStore.removeCustom(pair.id);
    notify('Par eliminado');
  }
}
</script>
