<template>

    <q-dialog v-model="dialog">

        <q-card class="dashboard-card" style="width: 700px; max-width: 90vw;">

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

                        <q-input v-model="form.symbol" label="Par" outlined />

                    </div>

                    <div class="col-12 col-md-6">

                        <q-select v-model="form.timeframe" :options="timeframes" label="Timeframe" outlined />

                    </div>

                    <div class="col-12 col-md-6">

                        <q-input v-model.number="form.capital" type="number" label="Capital" prefix="R$" outlined />

                    </div>

                    <div class="col-12 col-md-6">

                        <q-input v-model.number="form.risk" type="number" label="Riesgo (%)" suffix="%" outlined />

                    </div>

                    <div class="col-12">

                        <q-toggle v-model="form.active" label="Par Activo" color="positive" />

                    </div>

                </div>

            </q-card-section>

            <!-- ACTIONS -->

            <q-card-actions align="right">

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

const emit = defineEmits([
    'update:modelValue',
    'save'
])

const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value)
})

const form = ref({
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
    emit('save', form.value)

    dialog.value = false
}
</script>