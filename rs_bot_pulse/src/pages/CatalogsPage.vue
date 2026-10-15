<template>
  <q-page class="app-page">
    <PageHeader
      title="Brokers, tipos y estrategias"
      subtitle="Administra los catálogos que usas al registrar operaciones"
    />

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6 col-lg-4">
        <CatalogManager
          title="Brokers"
          subtitle="Plataformas donde operas"
          icon="account_balance"
          input-label="Nombre del broker"
          empty-title="Sin brokers registrados"
          :items="brokersStore.sorted"
          :usage="(id) => tradesStore.countBy('brokerId', id)"
          @add="addBroker"
          @remove="removeBroker"
        />
      </div>

      <div class="col-12 col-md-6 col-lg-4">
        <CatalogManager
          title="Tipos de operación"
          subtitle="Modalidades de operación"
          icon="swap_vert"
          input-label="Nombre del tipo"
          empty-title="Sin tipos registrados"
          :items="operationTypesStore.sorted"
          :usage="(id) => tradesStore.countBy('operationTypeId', id)"
          @add="addOperationType"
          @remove="removeOperationType"
        />
      </div>

      <div class="col-12 col-md-6 col-lg-4">
        <CatalogManager
          title="Estrategias"
          subtitle="Los métodos con los que operas"
          icon="psychology"
          input-label="Nombre de la estrategia"
          empty-title="Sin estrategias registradas"
          with-description
          :items="strategiesStore.sorted"
          :usage="(id) => tradesStore.countBy('strategyId', id)"
          @add="addStrategy"
          @remove="removeStrategy"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CatalogManager from 'components/catalog/CatalogManager.vue';
import PageHeader from 'components/ui/PageHeader.vue';
import { useFeedback } from 'src/composables/use-feedback';
import { useBrokersStore } from 'src/stores/brokers-store';
import { useOperationTypesStore } from 'src/stores/operation-types-store';
import { useStrategiesStore } from 'src/stores/strategies-store';
import { useTradesStore } from 'src/stores/trades-store';
import type { CatalogItem } from 'src/types';

const brokersStore = useBrokersStore();
const operationTypesStore = useOperationTypesStore();
const strategiesStore = useStrategiesStore();
const tradesStore = useTradesStore();
const { confirm, notify } = useFeedback();

function addBroker(name: string): void {
  if (brokersStore.add(name)) notify('Broker agregado');
}

function addOperationType(name: string): void {
  if (operationTypesStore.add(name)) notify('Tipo de operación agregado');
}

function addStrategy(name: string, description: string): void {
  if (strategiesStore.add(name, description)) notify('Estrategia agregada');
}

async function removeBroker(item: CatalogItem): Promise<void> {
  if (await confirm({ title: 'Eliminar broker', message: `¿Eliminar "${item.name}"?` })) {
    brokersStore.remove(item.id);
  }
}

async function removeOperationType(item: CatalogItem): Promise<void> {
  if (await confirm({ title: 'Eliminar tipo', message: `¿Eliminar "${item.name}"?` })) {
    operationTypesStore.remove(item.id);
  }
}

async function removeStrategy(item: CatalogItem): Promise<void> {
  if (await confirm({ title: 'Eliminar estrategia', message: `¿Eliminar "${item.name}"?` })) {
    strategiesStore.remove(item.id);
  }
}
</script>
