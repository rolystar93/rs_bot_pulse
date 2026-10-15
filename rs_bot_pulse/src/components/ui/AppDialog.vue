<template>
  <AppModal v-model="model" :title="title" :icon="icon" :wide="wide">
    <form novalidate @submit.prevent="emit('submit')">
      <slot />

      <div class="app-dialog__actions">
        <AppButton variant="flat" :label="cancelLabel" @click="cancel" />
        <AppButton type="submit" variant="primary" icon="save" :label="submitLabel" />
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { useFeedback } from 'src/composables/use-feedback';
import AppButton from './AppButton.vue';
import AppModal from './AppModal.vue';

withDefaults(
  defineProps<{
    title: string;
    icon?: string | undefined;
    wide?: boolean;
    submitLabel?: string;
    cancelLabel?: string;
  }>(),
  { submitLabel: 'Guardar', cancelLabel: 'Cancelar' },
);

const emit = defineEmits<{ submit: [] }>();
const model = defineModel<boolean>({ required: true });

const { confirmDiscard } = useFeedback();

async function cancel(): Promise<void> {
  if (await confirmDiscard()) model.value = false;
}
</script>
