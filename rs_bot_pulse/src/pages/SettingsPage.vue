<template>
  <q-page class="app-page">
    <PageHeader title="Configuración" subtitle="Copias de seguridad y gestión de datos" />

    <div class="column q-gutter-y-md">
      <AppCard>
        <div class="settings-action">
          <div class="settings-action__text">
            <div class="settings-action__title">Guardar copia de seguridad</div>
            <div class="settings-action__description">
              Descarga un archivo con tus operaciones, brokers, tipos, pares personalizados y capturas.
            </div>
          </div>
          <AppButton variant="primary" icon="download" label="Guardar copia" :loading="busy" @click="exportBackup" />
        </div>
      </AppCard>

      <AppCard>
        <div class="settings-action">
          <div class="settings-action__text">
            <div class="settings-action__title">Importar copia de seguridad</div>
            <div class="settings-action__description">
              Reemplaza operaciones, brokers, tipos y capturas con los del archivo. Los pares personalizados se combinan.
            </div>
          </div>
          <AppButton icon="upload" label="Importar copia" :loading="busy" @click="fileInput?.click()" />
          <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="importBackup" />
        </div>
      </AppCard>

      <AppCard class="app-card--danger">
        <div class="settings-action">
          <div class="settings-action__text">
            <div class="settings-action__title text-negative">Zona roja</div>
            <div class="settings-action__description">
              Borra operaciones, brokers, tipos y capturas. Los pares (predeterminados y personalizados) se conservan.
            </div>
          </div>
          <AppButton variant="danger" icon="delete_forever" label="Borrar datos" :loading="busy" @click="clearData" />
        </div>
      </AppCard>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppButton from 'components/ui/AppButton.vue';
import AppCard from 'components/ui/AppCard.vue';
import PageHeader from 'components/ui/PageHeader.vue';
import { useFeedback } from 'src/composables/use-feedback';
import { downloadBackup, parseBackup, resetAppData, restoreBackup } from 'src/services/backup';

const { confirm, notify } = useFeedback();

const busy = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

async function run(task: () => Promise<void>, errorMessage: string): Promise<void> {
  busy.value = true;
  try {
    await task();
  } catch (error) {
    notify(error instanceof Error ? error.message : errorMessage, 'negative');
  } finally {
    busy.value = false;
  }
}

const exportBackup = () =>
  run(async () => {
    const name = await downloadBackup();
    notify(`Copia guardada: ${name}`);
  }, 'No se pudo crear la copia');

async function importBackup(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  await run(async () => {
    const backup = parseBackup(await file.text());
    const accepted = await confirm({
      title: 'Importar copia',
      message: 'Se reemplazarán las operaciones, brokers, tipos y capturas actuales.',
      okLabel: 'Importar',
    });
    if (!accepted) return;

    await restoreBackup(backup);
    notify('Copia importada correctamente');
  }, 'No se pudo importar la copia');
}

const clearData = () =>
  run(async () => {
    const accepted = await confirm({
      title: 'Borrar todos los datos',
      message: 'Se eliminarán operaciones, brokers, tipos y capturas. Los pares se conservarán.',
      okLabel: 'Borrar',
      requireText: 'BORRAR',
    });
    if (!accepted) return;

    await resetAppData();
    notify('Datos borrados');
  }, 'No se pudo borrar los datos');
</script>
