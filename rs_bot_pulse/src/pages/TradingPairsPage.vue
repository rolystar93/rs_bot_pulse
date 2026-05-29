<template>
    <q-page class="dashboard-page">

        <!-- HEADER -->

        <div class="page-header">

            <div>

                <h1 class="page-title">
                    Pares de Trading
                </h1>

                <p class="page-subtitle">
                    Gestiona los activos monitoreados por el bot
                </p>

            </div>

            <q-btn color="primary" icon="add" label="Nuevo Par" unelevated @click="showDialog = true" />

        </div>

        <!-- FILTERS -->

        <q-card class="dashboard-card q-mt-lg">

            <q-card-section>

                <q-input v-model="search" outlined dense clearable placeholder="Buscar par...">
                    <template #prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>

            </q-card-section>

        </q-card>

        <!-- TABLE -->

        <!-- <q-card class="dashboard-card q-mt-lg">

            <q-card-section>

                <div class="table-placeholder">

                    <q-icon name="candlestick_chart" size="64px" />

                    <div class="placeholder-title">
                        No hay pares registrados
                    </div>

                    <div class="placeholder-subtitle">
                        Agrega tu primer activo para comenzar
                    </div>

                </div>

            </q-card-section>

        </q-card> -->
        <TradingPairsTable class="q-mt-lg" :rows="rows" :columns="columns" />
        <TradingPairDialog v-model="showDialog" mode="create" @save="createPair" />

    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TradingPairsTable from 'src/components/tables/TradingPairsTable.vue';
import TradingPairDialog from 'src/components/dialogs/TradingPairDialog.vue';
import type { QTableColumn } from 'quasar'

const search = ref('')
const showDialog = ref(false)
const rows = [
    {
        id: 1,
        symbol: 'EUR/USD',
        flag1: 'eu',
        flag2: 'us',
        timeframe: 'H1',
        capital: 500,
        risk: 2,
        active: true
    },

    {
        id: 2,
        symbol: 'GBP/USD',
        flag1: 'gb',
        flag2: 'us',
        timeframe: 'H1',
        capital: 400,
        risk: 1.5,
        active: true
    },
    {
        id: 3,
        symbol: 'USD/JPY',
        flag1: 'us',
        flag2: 'jp',
        timeframe: 'H1',
        capital: 400,
        risk: 1.5,
        active: true
    }
]
const columns: QTableColumn[] = [
    {
        name: 'pair',
        label: 'Par',
        field: 'symbol',
        align: 'left'
    },

    {
        name: 'timeframe',
        label: 'TF',
        field: 'timeframe',
        align: 'center'
    },

    {
        name: 'capital',
        label: 'Capital',
        field: 'capital',
        align: 'center'
    },

    {
        name: 'risk',
        label: 'Riesgo',
        field: 'risk',
        align: 'center'
    },

    {
        name: 'status',
        label: 'Estado',
        field: 'active',
        align: 'center'
    },

    {
        name: 'actions',
        label: 'Acciones',
        field: 'id',
        align: 'right'
    }
]

// funciones
function createPair(data: unknown) {
    console.log(data)
}


</script>