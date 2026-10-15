<template>
  <q-input
    v-model="model"
    borderless
    class="app-field"
    stack-label
    :label="label"
    :error="error"
    :error-message="errorMessage"
  >
    <template #prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="model" :mask="MASK" :options="isDateAllowed">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Aceptar" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>

    <template #append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="model" :mask="MASK" format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Aceptar" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
// Misma máscara que usa el resto de la app (YYYY-MM-DDTHH:mm)
const MASK = 'YYYY-MM-DD[T]HH:mm';

const props = defineProps<{
  label: string;
  error?: boolean;
  errorMessage?: string;
  /** Fechas permitidas en el calendario, formato YYYY-MM-DD */
  minDate?: string | undefined;
  maxDate?: string | undefined;
}>();

const model = defineModel<string>({ required: true });

function isDateAllowed(day: string): boolean {
  const iso = day.replace(/\//g, '-');
  if (props.minDate && iso < props.minDate) return false;
  if (props.maxDate && iso > props.maxDate) return false;
  return true;
}
</script>
