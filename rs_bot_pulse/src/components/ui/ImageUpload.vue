<template>
  <div>
    <div class="field-label">{{ label }}</div>

    <div v-if="url" class="image-upload image-upload--filled">
      <img :src="url" alt="Captura de la operación" class="image-upload__preview" />
      <div class="image-upload__actions">
        <AppButton round dense icon="fullscreen" @click="viewerOpen = true" />
        <AppButton round dense variant="danger" icon="delete_outline" @click="emit('clear')" />
      </div>
    </div>

    <div
      v-else
      :class="['image-upload', { 'image-upload--over': dragging }]"
      tabindex="0"
      role="button"
      @click="input?.click()"
      @keydown.enter="input?.click()"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <q-icon name="add_photo_alternate" size="36px" />
      <div class="text-weight-medium">Haz clic, arrastra o pega (Ctrl+V) una captura</div>
      <div class="text-caption">PNG, JPG o WEBP · máx. {{ MAX_MB }} MB</div>
    </div>

    <input ref="input" type="file" accept="image/*" hidden @change="onPick" />
    <ImageViewer v-if="url" v-model="viewerOpen" :src="url" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import AppButton from './AppButton.vue';
import ImageViewer from './ImageViewer.vue';

const MAX_MB = 15;

withDefaults(defineProps<{ url: string | null; label?: string }>(), { label: 'Captura de pantalla' });

const emit = defineEmits<{ select: [file: File]; clear: []; invalid: [message: string] }>();

const input = ref<HTMLInputElement | null>(null);
const dragging = ref(false);
const viewerOpen = ref(false);

function accept(file: File | null | undefined): void {
  if (!file) return;
  if (!file.type.startsWith('image/')) return emit('invalid', 'El archivo debe ser una imagen');
  if (file.size > MAX_MB * 1024 * 1024) return emit('invalid', `La imagen supera los ${MAX_MB} MB`);
  emit('select', file);
}

function onPick(event: Event): void {
  const target = event.target as HTMLInputElement;
  accept(target.files?.[0]);
  target.value = '';
}

function onDrop(event: DragEvent): void {
  dragging.value = false;
  accept(event.dataTransfer?.files[0]);
}

function onPaste(event: ClipboardEvent): void {
  const file = [...(event.clipboardData?.files ?? [])].find((f) => f.type.startsWith('image/'));
  accept(file);
}

onMounted(() => document.addEventListener('paste', onPaste));
onBeforeUnmount(() => document.removeEventListener('paste', onPaste));
</script>
