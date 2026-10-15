<template>
  <AppModal v-model="open" :title="title" :icon="icon" @hide="emit('hide')">
    <form novalidate @submit.prevent="accept">
      <p class="app-dialog__message">{{ message }}</p>

      <AppInput
        v-if="requireText"
        v-model="typed"
        autofocus
        :label="`Escribe &quot;${requireText}&quot; para confirmar`"
      />

      <div class="app-dialog__actions">
        <AppButton variant="flat" :label="cancelLabel" @click="open = false" />
        <AppButton
          type="submit"
          variant="danger"
          :label="okLabel"
          :disable="!!requireText && typed !== requireText"
        />
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppButton from './AppButton.vue';
import AppInput from './AppInput.vue';
import AppModal from './AppModal.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    message: string;
    okLabel?: string;
    cancelLabel?: string;
    requireText?: string | undefined;
    icon?: string;
  }>(),
  { okLabel: 'Eliminar', cancelLabel: 'Cancelar', icon: 'warning_amber' },
);

// Eventos requeridos por Dialog.create({ component })
const emit = defineEmits<{ ok: []; hide: [] }>();

const open = ref(true);
const typed = ref('');

function accept(): void {
  if (props.requireText && typed.value !== props.requireText) return;
  emit('ok');
  open.value = false;
}
</script>
