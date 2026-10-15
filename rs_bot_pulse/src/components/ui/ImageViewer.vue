<template>
  <q-dialog v-model="model" maximized transition-show="fade" transition-hide="fade">
    <div class="image-viewer">
      <div class="image-viewer__toolbar">
        <AppButton
          round
          dense
          :icon="zoomed ? 'zoom_out_map' : 'zoom_in'"
          @click="zoomed = !zoomed"
        >
          <q-tooltip>{{ zoomed ? 'Ajustar a la pantalla' : 'Tamaño real' }}</q-tooltip>
        </AppButton>
        <AppButton v-close-popup round dense icon="close" />
      </div>

      <div :class="['image-viewer__stage', { 'image-viewer__stage--zoomed': zoomed }]">
        <img :src="src" alt="Captura" :class="{ 'is-zoomed': zoomed }" @click="zoomed = !zoomed" />
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AppButton from './AppButton.vue';

defineProps<{ src: string }>();

const model = defineModel<boolean>({ required: true });
const zoomed = ref(false);

watch(model, (open) => {
  if (open) zoomed.value = false;
});
</script>
