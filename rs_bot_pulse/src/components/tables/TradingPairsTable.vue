<template>

    <q-card class="dashboard-card">

        <q-table flat :rows="rows" :columns="columns" row-key="id" hide-pagination>

            <template #body-cell-pair="props">

                <q-td :props="props">

                    <div class="pair-cell">

                        <div class="pair-flags">

                            <span :class="`fi fi-${props.row.flag1} pair-flag`"></span>

                            <span :class="`fi fi-${props.row.flag2} pair-flag`"></span>

                        </div>

                        {{ props.row.symbol }}

                    </div>

                </q-td>

            </template>

            <template #body-cell-status="props">

                <q-td :props="props">

                    <q-badge :color="props.row.active
                        ? 'positive'
                        : 'negative'">
                        {{ props.row.active
                            ? 'Activo'
                            : 'Inactivo' }}
                    </q-badge>

                </q-td>

            </template>

            <template #body-cell-actions="props">

                <q-td :props="props">

                    <q-btn flat round icon="edit" />

                    <q-btn flat round color="negative" icon="delete" />

                </q-td>

            </template>

        </q-table>

    </q-card>

</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar'

defineProps<{
    rows: unknown[]
    columns: QTableColumn[]
}>()

</script>