<template>
  <AppModal v-model="model" title="Detalle de la operación" icon="receipt_long" wide>
    <template v-if="trade">
      <div class="detail-grid">
        <DetailItem label="Par"><PairLabel :pair="pair" /></DetailItem>
        <DetailItem label="Temporalidad" :value="trade.timeframe" />
        <DetailItem label="Broker" :value="brokersStore.nameOf(trade.brokerId)" />
        <DetailItem label="Tipo de operación" :value="operationTypesStore.nameOf(trade.operationTypeId)" />
        <DetailItem label="Estrategia">
          <template v-if="trade.strategyId">
            <div>{{ strategiesStore.nameOf(trade.strategyId) }}</div>
            <div v-if="strategiesStore.descriptionOf(trade.strategyId)" class="text-soft text-caption">
              {{ strategiesStore.descriptionOf(trade.strategyId) }}
            </div>
          </template>
          <span v-else>—</span>
        </DetailItem>
        <DetailItem label="Apertura" :value="formatDateTime(trade.openedAt)" />
        <DetailItem label="Cierre" :value="formatDateTime(trade.closedAt)" />
        <DetailItem label="Duración" :value="formatDuration(trade.openedAt, trade.closedAt)" />
        <DetailItem label="Inversión" :value="formatAmount(trade.investment)" />
        <DetailItem label="Resultado"><MoneyValue :value="trade.result" /></DetailItem>
        <DetailItem label="Rentabilidad">
          <span :class="trade.result >= 0 ? 'text-profit' : 'text-loss'">
            {{ formatPercent((trade.result / trade.investment) * 100) }}
          </span>
        </DetailItem>
      </div>

      <div class="field-label">Captura de pantalla</div>
      <button v-if="screenshotUrl" type="button" class="screenshot-thumb" @click="viewerOpen = true">
        <img :src="screenshotUrl" alt="Captura de la operación" />
        <span class="screenshot-thumb__hint"><q-icon name="fullscreen" /> Ampliar</span>
      </button>
      <EmptyState v-else icon="hide_image" title="Sin captura" description="Edita la operación para adjuntar una" />

      <ImageViewer v-if="screenshotUrl" v-model="viewerOpen" :src="screenshotUrl" />
    </template>

    <template #actions>
      <AppButton variant="danger" icon="delete_outline" label="Eliminar" @click="emit('remove')" />
      <AppButton icon="edit" label="Editar" @click="emit('edit')" />
      <AppButton v-close-popup variant="flat" label="Cerrar" />
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppButton from 'components/ui/AppButton.vue';
import AppModal from 'components/ui/AppModal.vue';
import DetailItem from 'components/ui/DetailItem.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import ImageViewer from 'components/ui/ImageViewer.vue';
import MoneyValue from 'components/ui/MoneyValue.vue';
import PairLabel from 'components/ui/PairLabel.vue';
import { useScreenshotUrl } from 'src/composables/use-screenshot-url';
import { useBrokersStore } from 'src/stores/brokers-store';
import { useOperationTypesStore } from 'src/stores/operation-types-store';
import { usePairsStore } from 'src/stores/pairs-store';
import { useStrategiesStore } from 'src/stores/strategies-store';
import type { Trade } from 'src/types';
import { formatAmount, formatDateTime, formatDuration, formatPercent } from 'src/utils/format';

const props = defineProps<{ trade: Trade | null }>();
const emit = defineEmits<{ edit: []; remove: [] }>();
const model = defineModel<boolean>({ required: true });

const pairsStore = usePairsStore();
const brokersStore = useBrokersStore();
const operationTypesStore = useOperationTypesStore();
const strategiesStore = useStrategiesStore();

const pair = computed(() => (props.trade ? pairsStore.getById(props.trade.pairId) : undefined));
const screenshotUrl = useScreenshotUrl(computed(() => (model.value ? props.trade?.screenshotId : null)));
const viewerOpen = ref(false);
</script>
