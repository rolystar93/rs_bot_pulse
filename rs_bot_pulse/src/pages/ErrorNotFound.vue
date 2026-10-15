<template>
  <q-page class="app-page">
    <EmptyState icon="sentiment_dissatisfied" title="Página no encontrada">
      <AppButton variant="primary" icon="home" label="Volver al inicio" to="/" class="q-mt-md" />
    </EmptyState>
  </q-page>
</template>

<script setup lang="ts">
import AppButton from 'components/ui/AppButton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
</script>
