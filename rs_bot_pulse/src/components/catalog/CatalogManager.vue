<template>
  <AppCard :title="title" :subtitle="subtitle">
    <form class="q-mb-md" novalidate @submit.prevent="submit">
      <div class="row no-wrap items-start q-gutter-x-sm">
        <AppInput
          v-model="name"
          dense
          class="col"
          :label="inputLabel"
          :error="!!error"
          :error-message="error"
          @update:model-value="error = ''"
        />
        <AppButton type="submit" variant="primary" icon="add" label="Agregar" />
      </div>

      <AppInput
        v-if="withDescription"
        v-model="description"
        dense
        autogrow
        type="textarea"
        class="q-mt-sm"
        label="Descripción (opcional)"
      />
    </form>

    <EmptyState v-if="!items.length" :icon="icon" :title="emptyTitle" />

    <ul v-else class="q-pa-none q-ma-none" style="list-style: none">
      <li v-for="item in items" :key="item.id" class="catalog-item">
        <div>
          <div class="text-weight-medium">{{ item.name }}</div>
          <div v-if="item.description" class="text-soft text-caption">{{ item.description }}</div>
          <div v-if="usage" class="text-muted text-caption">
            {{ usageLabel(usage(item.id)) }}
          </div>
        </div>

        <AppButton
          round
          dense
          variant="danger"
          icon="delete_outline"
          :disable="!!usage?.(item.id)"
          @click="emit('remove', item)"
        >
          <q-tooltip v-if="usage?.(item.id)">En uso: no se puede eliminar</q-tooltip>
        </AppButton>
      </li>
    </ul>
  </AppCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CatalogItem } from 'src/types';
import AppButton from 'components/ui/AppButton.vue';
import AppCard from 'components/ui/AppCard.vue';
import AppInput from 'components/ui/AppInput.vue';
import EmptyState from 'components/ui/EmptyState.vue';

const props = defineProps<{
  title: string;
  subtitle?: string;
  icon: string;
  inputLabel: string;
  emptyTitle: string;
  items: CatalogItem[];
  /** Cantidad de operaciones que usan el elemento; si es > 0 no se puede eliminar */
  usage?: (id: string) => number;
  /** Muestra el campo de descripción opcional */
  withDescription?: boolean;
}>();

const emit = defineEmits<{
  add: [name: string, description: string];
  remove: [item: CatalogItem];
}>();

const name = ref('');
const description = ref('');
const error = ref('');

function usageLabel(count: number): string {
  return count === 1 ? '1 operación' : `${count} operaciones`;
}

function submit(): void {
  const clean = (name.value ?? '').toString().trim();

  if (!clean) {
    error.value = 'Ingresa un nombre';
    return;
  }

  if (props.items.some((item) => item.name.toLowerCase() === clean.toLowerCase())) {
    error.value = 'Ya existe un elemento con ese nombre';
    return;
  }

  emit('add', clean, (description.value ?? '').toString().trim());
  name.value = '';
  description.value = '';
}
</script>
