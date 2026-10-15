<template>
  <AppDialog
    v-model="model"
    :title="pair ? 'Editar par' : 'Nuevo par'"
    icon="currency_exchange"
    :submit-label="pair ? 'Guardar cambios' : 'Guardar'"
    @submit="submit"
  >
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <AppInput
          v-model="form.base"
          label="Divisa base"
          hint="Ej. EUR, XAU, BTC"
          maxlength="6"
          :error="showError('base')"
          error-message="2 a 6 letras o números"
          @update:model-value="onCodeInput('base')"
        />
      </div>
      <div class="col-6">
        <AppInput
          v-model="form.quote"
          label="Divisa cotizada"
          hint="Ej. USD"
          maxlength="6"
          :error="showError('quote')"
          error-message="2 a 6 letras o números"
          @update:model-value="onCodeInput('quote')"
        />
      </div>

      <div class="col-6">
        <AppInput
          v-model="form.baseFlag"
          label="Bandera base (opcional)"
          hint="Código de país, ej. eu"
          maxlength="2"
          :error="showError('baseFlag')"
          error-message="2 letras"
          @update:model-value="flagTouched.base = true"
        />
      </div>
      <div class="col-6">
        <AppInput
          v-model="form.quoteFlag"
          label="Bandera cotizada (opcional)"
          hint="Código de país, ej. us"
          maxlength="2"
          :error="showError('quoteFlag')"
          error-message="2 letras"
          @update:model-value="flagTouched.quote = true"
        />
      </div>

      <div class="col-12">
        <div class="field-label">Vista previa</div>
        <PairLabel v-if="preview" :pair="preview" />
        <span v-else class="text-muted">Completa las divisas para ver el par</span>
      </div>

      <div v-if="duplicate" class="col-12 text-negative text-caption">
        El par {{ preview?.symbol }} ya existe.
      </div>
    </div>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import AppDialog from 'components/ui/AppDialog.vue';
import AppInput from 'components/ui/AppInput.vue';
import PairLabel from 'components/ui/PairLabel.vue';
import { useFeedback } from 'src/composables/use-feedback';
import { CURRENCY_FLAGS } from 'src/data/currency-flags';
import { usePairsStore } from 'src/stores/pairs-store';
import { useTradesStore } from 'src/stores/trades-store';
import type { TradingPair } from 'src/types';

const props = defineProps<{ pair?: TradingPair | null | undefined }>();
const emit = defineEmits<{ saved: [pairId: string] }>();
const model = defineModel<boolean>({ required: true });

const pairsStore = usePairsStore();
const tradesStore = useTradesStore();
const { notify } = useFeedback();

const CODE_PATTERN = /^[A-Z0-9]{2,6}$/;
const FLAG_PATTERN = /^[a-z]{2}$/;

interface PairForm {
  base: string;
  quote: string;
  baseFlag: string;
  quoteFlag: string;
}

const emptyForm = (): PairForm => ({ base: '', quote: '', baseFlag: '', quoteFlag: '' });
const toForm = ({ base, quote, baseFlag, quoteFlag }: TradingPair): PairForm => ({
  base,
  quote,
  baseFlag,
  quoteFlag,
});

const form = reactive<PairForm>(emptyForm());
const flagTouched = reactive({ base: false, quote: false });
const submitted = ref(false);

watch(model, (open) => {
  if (!open) return;
  Object.assign(form, props.pair ? toForm(props.pair) : emptyForm());
  // Al editar se respetan las banderas guardadas
  flagTouched.base = flagTouched.quote = !!props.pair;
  submitted.value = false;
});

/** Normaliza el código a mayúsculas y sugiere la bandera si el usuario no la editó. */
function onCodeInput(side: 'base' | 'quote'): void {
  form[side] = form[side].toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!flagTouched[side]) form[`${side}Flag`] = CURRENCY_FLAGS[form[side]] ?? '';
}

const errors = computed(() => ({
  base: !CODE_PATTERN.test(form.base),
  quote: !CODE_PATTERN.test(form.quote),
  baseFlag: !!form.baseFlag && !FLAG_PATTERN.test(form.baseFlag),
  quoteFlag: !!form.quoteFlag && !FLAG_PATTERN.test(form.quoteFlag),
}));

const showError = (field: keyof typeof errors.value) => submitted.value && errors.value[field];

const preview = computed<TradingPair | null>(() => {
  if (errors.value.base || errors.value.quote) return null;

  return {
    id: `${form.base}${form.quote}`,
    symbol: `${form.base}/${form.quote}`,
    base: form.base,
    quote: form.quote,
    baseFlag: errors.value.baseFlag ? '' : form.baseFlag,
    quoteFlag: errors.value.quoteFlag ? '' : form.quoteFlag,
    category: 'custom',
  };
});

const duplicate = computed(
  () =>
    !!preview.value && preview.value.id !== props.pair?.id && pairsStore.exists(preview.value.id),
);

function submit(): void {
  submitted.value = true;
  if (Object.values(errors.value).some(Boolean) || !preview.value || form.base === form.quote) return;

  const next = preview.value;
  const previous = props.pair;

  if (previous) {
    if (!pairsStore.updateCustom(previous.id, next)) return;
    if (next.id !== previous.id) tradesStore.reassignPair(previous.id, next.id);
    notify(`Par ${next.symbol} actualizado`);
  } else {
    if (!pairsStore.addCustom(next)) return;
    notify(`Par ${next.symbol} agregado`);
  }

  emit('saved', next.id);
  model.value = false;
}
</script>
