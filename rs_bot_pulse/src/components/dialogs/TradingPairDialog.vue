<template>

    <q-dialog v-model="dialog">

        <q-card class="dashboard-card" style="width: 500px; max-width: 90vw;">

            <!-- HEADER -->

            <q-card-section>

                <div class="dialog-title">

                    <q-icon name="candlestick_chart" size="28px" />

                    <span>
                        {{ mode === 'create'
                            ? 'Nuevo Par'
                            : 'Editar Par' }}
                    </span>

                </div>

            </q-card-section>

            <!-- FORM -->

            <q-card-section>

                <div class="row q-col-gutter-md">

                    <div class="col-12 col-md-6">

                        <q-select v-model="form.par" :options="pares" option-label="label" option-value="value"
                            emit-value map-options outlined dark label="Par" class="trading-input"
                            popup-content-class="dark-select-menu">
                            <template #prepend>
                                <q-icon name="currency_exchange" />
                            </template>

                            <template #selected-item="scope">
                                <div class="row items-center no-wrap">
                                    <div class="flags-container q-mr-sm">
                                        <img :src="scope.opt.flag1" class="flag-icon" />
                                        <img :src="scope.opt.flag2" class="flag-icon overlap" />
                                    </div>

                                    <span class="text-weight-medium">
                                        {{ scope.opt.label }}
                                    </span>
                                </div>
                            </template>

                            <template #option="scope">
                                <q-item v-bind="scope.itemProps">
                                    <q-item-section avatar>
                                        <div class="row items-center">
                                            <span :class="`fi fi-${scope.opt.flag1}`"></span>
                                            <span :class="`fi fi-${scope.opt.flag2}`" style="margin-left:-6px"></span>
                                        </div>
                                    </q-item-section>

                                    <q-item-section>
                                        {{ scope.opt.label }}
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>

                    </div>

                    <div class="col-12 col-md-6">

                        <!-- <q-select v-model="form.timeframe" :options="timeframes" label="Timeframe" outlined /> -->
                        <q-select v-model="form.timeframe" :options="timeframes" label="Timeframe" outlined dark
                            popup-content-class="dark-select-menu" class="trading-input">
                            <template #prepend>
                                <q-icon name="schedule" />
                            </template>
                        </q-select>

                    </div>

                    <div class="col-12 col-md-6">

                        <q-input v-model.number="form.capital" inputmode="numeric" pattern="[0-9]*" label="Capital"
                            prefix="R$" dark outlined class="trading-input">
                            <template #prepend>
                                <q-icon name="account_balance_wallet" />
                            </template>
                        </q-input>

                    </div>

                    <div class="col-12 col-md-6">

                        <q-input v-model.number="form.risk" inputmode="numeric" pattern="[0-9]*" label="Riesgo (%)"
                            suffix="%" outlined dark class="trading-input">
                            <template #prepend>
                                <q-icon name="shield" />
                            </template>
                        </q-input>
                        <!-- <q-select outlined v-model="form.risk" :options="options" label="Riesgo (%)" suffix="%" dark /> -->

                    </div>

                    <div class="col-12">

                        <q-toggle v-model="form.active" label="Par Activo" color="positive" />

                    </div>

                </div>

            </q-card-section>

            <!-- ACTIONS -->

            <q-card-actions align="right" class="card-actions">

                <q-btn flat label="Cancelar" v-close-popup />

                <q-btn color="primary" icon="save" label="Guardar" @click="save" />

            </q-card-actions>

        </q-card>

    </q-dialog>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    mode: {
        type: String,
        default: 'create'
    }
})

const pares = [
    {
        label: 'EUR/USD',
        value: 'EURUSD',
        flag1: 'eu',
        flag2: 'us'
    },
    {
        label: 'GBP/USD',
        value: 'GBPUSD',
        flag1: 'gb',
        flag2: 'us'
    },
    {
        label: 'USD/JPY',
        value: 'USDJPY',
        flag1: 'us',
        flag2: 'jp'
    },
    {
        label: 'AUD/USD',
        value: 'AUDUSD',
        flag1: 'au',
        flag2: 'us'
    },
    {
        label: 'USD/CAD',
        value: 'USDCAD',
        flag1: 'us',
        flag2: 'cad'
    }
]

// const options = [
//     { label: '1%', value: 1 },
//     { label: '2%', value: 2 },
//     { label: '3%', value: 3 },
//     { label: '4%', value: 4 },
//     { label: '5%', value: 5 }
// ]

const emit = defineEmits([
    'update:modelValue',
    'save'
])

const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value)
})

const form = ref({
    par: null,
    symbol: '',
    timeframe: 'H1',
    capital: 500,
    risk: 2,
    active: true
})

const timeframes = [
    'M5',
    'M15',
    'M30',
    'H1',
    'H4',
    'D1'
]

function save() {
    console.log('🇪🇺 🇺🇸')
    emit('save', form.value)

    dialog.value = false
}
</script>