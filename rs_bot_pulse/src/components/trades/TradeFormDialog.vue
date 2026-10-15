<template>
  <AppDialog v-model="model" :title="trade ? 'Editar operación' : 'Nueva operación'" icon="candlestick_chart" wide
    @submit="submit">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <AppSelect v-model="form.pairId" label="Par" :options="pairsStore.options" :error="showError('pairId')"
          error-message="Selecciona un par">
          <template #selected-item="{ opt }">
            <PairLabel :pair="opt.pair" />
          </template>
          <template #option="{ opt, itemProps }">
            <q-item v-bind="itemProps">
              <q-item-section>
                <PairLabel :pair="opt.pair" />
              </q-item-section>
            </q-item>
          </template>
          <template #after-options>
            <q-item clickable @click="pairDialogOpen = true">
              <q-item-section avatar><q-icon name="add_circle_outline" color="primary" /></q-item-section>
              <q-item-section class="text-primary">Agregar par nuevo...</q-item-section>
            </q-item>
          </template>
        </AppSelect>
      </div>

      <div class="col-12 col-sm-6">
        <AppSelect v-model="form.timeframe" label="Temporalidad" :options="TIMEFRAMES" />
      </div>

      <div class="col-12 col-sm-6">
        <AppSelect v-model="form.brokerId" label="Broker" :options="brokersStore.options" :error="showError('brokerId')"
          :error-message="brokersStore.items.length ? 'Selecciona un broker' : 'Primero registra un broker'" />
      </div>

      <div class="col-12 col-sm-6">
        <AppSelect v-model="form.operationTypeId" label="Tipo de operación" :options="operationTypesStore.options"
          :error="showError('operationTypeId')" :error-message="operationTypesStore.items.length ? 'Selecciona un tipo' : 'Primero registra un tipo'
            " />
      </div>

      <div class="col-12">
        <AppSelect v-model="form.strategyId" label="Estrategia" :options="strategiesStore.options"
          :error="showError('strategyId')"
          :error-message="strategiesStore.items.length ? 'Selecciona una estrategia' : 'Primero registra una estrategia'" />
      </div>

      <div class="col-12 col-sm-6">
        <AppDateTimeField v-model="form.openedAt" label="Apertura" :max-date="today" :error="showError('openedAt')"
          :error-message="openedAtMessage" />
      </div>

      <div class="col-12 col-sm-6">
        <AppDateTimeField v-model="form.closedAt" label="Cierre" :min-date="form.openedAt.slice(0, 10)"
          :error="showError('closedAt')" :error-message="closedAtMessage" />
      </div>

      <div class="col-12 col-sm-6">
        <AppInput v-model="form.investment" type="number" min="0" step="0.01" label="Inversión"
          :error="showError('investment')" error-message="Debe ser mayor a 0" />
      </div>

      <div class="col-12 col-sm-6">
        <AppInput v-model="form.result" type="number" step="0.01" label="Ganancia / Pérdida"
          hint="Usa negativo para pérdidas" :error="showError('result')" error-message="Ingresa un valor" />
      </div>

      <div class="col-12">
        <ImageUpload :url="screenshotUrl" @select="onScreenshotSelect" @clear="onScreenshotClear"
          @invalid="(message) => notify(message, 'negative')" />
      </div>
    </div>
  </AppDialog>

  <PairFormDialog v-model="pairDialogOpen" @saved="(pairId) => (form.pairId = pairId)" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import AppDateTimeField from 'components/ui/AppDateTimeField.vue';
import AppDialog from 'components/ui/AppDialog.vue';
import AppInput from 'components/ui/AppInput.vue';
import AppSelect from 'components/ui/AppSelect.vue';
import ImageUpload from 'components/ui/ImageUpload.vue';
import PairFormDialog from 'components/pairs/PairFormDialog.vue';
import PairLabel from 'components/ui/PairLabel.vue';
import { useFeedback } from 'src/composables/use-feedback';
import { useScreenshotUrl } from 'src/composables/use-screenshot-url';
import { DEFAULT_TIMEFRAME, TIMEFRAMES } from 'src/constants/app';
import { useBrokersStore } from 'src/stores/brokers-store';
import { useOperationTypesStore } from 'src/stores/operation-types-store';
import { usePairsStore } from 'src/stores/pairs-store';
import { useStrategiesStore } from 'src/stores/strategies-store';
import type { ScreenshotChange, Trade, TradeInput } from 'src/types';
import { fromLocalInput, nowLocalInput, toLocalInput } from 'src/utils/format';

const props = defineProps<{ trade?: Trade | null }>();
const emit = defineEmits<{ save: [input: TradeInput, screenshot: ScreenshotChange] }>();
const model = defineModel<boolean>({ required: true });

const pairsStore = usePairsStore();
const brokersStore = useBrokersStore();
const operationTypesStore = useOperationTypesStore();
const strategiesStore = useStrategiesStore();

interface FormState {
  pairId: string | null;
  timeframe: string;
  brokerId: string | null;
  operationTypeId: string | null;
  strategyId: string | null;
  openedAt: string;
  closedAt: string;
  investment: string | number | null;
  result: string | number | null;
}

type FormField = keyof FormState;

function emptyForm(): FormState {
  const now = nowLocalInput();
  return {
    pairId: null,
    timeframe: DEFAULT_TIMEFRAME,
    brokerId: null,
    operationTypeId: null,
    strategyId: null,
    openedAt: now,
    closedAt: now,
    investment: null,
    result: null,
  };
}

function formFromTrade(trade: Trade): FormState {
  return {
    pairId: trade.pairId,
    timeframe: trade.timeframe,
    brokerId: trade.brokerId,
    operationTypeId: trade.operationTypeId,
    strategyId: trade.strategyId ?? null,
    openedAt: toLocalInput(trade.openedAt),
    closedAt: toLocalInput(trade.closedAt),
    investment: trade.investment,
    result: trade.result,
  };
}

const { notify } = useFeedback();

const form = reactive<FormState>(emptyForm());
const submitted = ref(false);
const pairDialogOpen = ref(false);

// Captura: la guardada (si existe) y el cambio pendiente del usuario
const storedScreenshotId = computed(() => props.trade?.screenshotId ?? null);
const storedScreenshotUrl = useScreenshotUrl(storedScreenshotId);
const screenshotChange = ref<ScreenshotChange>({ action: 'keep' });
const pendingUrl = ref<string | null>(null);

const screenshotUrl = computed(() => {
  if (screenshotChange.value.action === 'set') return pendingUrl.value;
  if (screenshotChange.value.action === 'remove') return null;
  return storedScreenshotUrl.value;
});

function releasePendingUrl(): void {
  if (pendingUrl.value) URL.revokeObjectURL(pendingUrl.value);
  pendingUrl.value = null;
}

function onScreenshotSelect(file: File): void {
  releasePendingUrl();
  pendingUrl.value = URL.createObjectURL(file);
  screenshotChange.value = { action: 'set', file };
}

function onScreenshotClear(): void {
  releasePendingUrl();
  screenshotChange.value = storedScreenshotId.value ? { action: 'remove' } : { action: 'keep' };
}

watch(model, (open) => {
  releasePendingUrl();
  screenshotChange.value = { action: 'keep' };
  if (!open) return;
  today.value = nowLocalInput().slice(0, 10);
  Object.assign(form, props.trade ? formFromTrade(props.trade) : emptyForm());
  submitted.value = false;
});

onBeforeUnmount(releasePendingUrl);

const isBlank = (value: unknown) => value === null || value === '' || value === undefined;

const today = ref(nowLocalInput().slice(0, 10));

const timestamp = (value: string): number => Date.parse(value);
const isValidDate = (value: string): boolean => !Number.isNaN(timestamp(value));

type DateIssue = 'invalid' | 'future' | 'beforeOpen' | null;

// La hora actual se evalúa al validar, no al montar el componente
function openedAtIssue(): DateIssue {
  if (!isValidDate(form.openedAt)) return 'invalid';
  return timestamp(form.openedAt) > Date.now() ? 'future' : null;
}

function closedAtIssue(): DateIssue {
  if (!isValidDate(form.closedAt)) return 'invalid';
  if (isValidDate(form.openedAt) && timestamp(form.closedAt) < timestamp(form.openedAt)) return 'beforeOpen';
  return timestamp(form.closedAt) > Date.now() ? 'future' : null;
}

const DATE_MESSAGES: Record<Exclude<DateIssue, null>, string> = {
  invalid: 'Fecha inválida',
  future: 'No puede ser posterior a la fecha y hora actual',
  beforeOpen: 'No puede ser anterior a la apertura',
};

const openedAtMessage = computed(() => DATE_MESSAGES[openedAtIssue() ?? 'invalid']);
const closedAtMessage = computed(() => DATE_MESSAGES[closedAtIssue() ?? 'invalid']);

const errors = computed<Partial<Record<FormField, boolean>>>(() => ({
  pairId: !form.pairId,
  brokerId: !form.brokerId,
  operationTypeId: !form.operationTypeId,
  strategyId: !form.strategyId,
  openedAt: openedAtIssue() !== null,
  closedAt: closedAtIssue() !== null,
  investment: isBlank(form.investment) || Number(form.investment) <= 0,
  result: isBlank(form.result) || Number.isNaN(Number(form.result)),
}));

const showError = (field: FormField) => submitted.value && !!errors.value[field];

function submit(): void {
  submitted.value = true;
  if (Object.values(errors.value).some(Boolean)) return;

  emit(
    'save',
    {
      pairId: form.pairId!,
      timeframe: form.timeframe,
      brokerId: form.brokerId!,
      operationTypeId: form.operationTypeId!,
      strategyId: form.strategyId!,
      openedAt: fromLocalInput(form.openedAt),
      closedAt: fromLocalInput(form.closedAt),
      investment: Number(form.investment),
      result: Number(form.result),
    },
    screenshotChange.value,
  );
  model.value = false;
}
</script>
