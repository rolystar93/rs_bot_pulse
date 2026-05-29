<template>
    <q-card class="dashboard-card best-hours-card">

        <div class="card-title">
            Mejores horarios
        </div>

        <div v-for="hour in hours" :key="hour.range" class="hour-item">

            <div>

                <div class="hour-range">
                    {{ hour.range }}
                </div>

                <div class="hour-trades">
                    {{ hour.trades }} trades
                </div>

            </div>

            <div class="hour-winrate">
                {{ hour.winrate }}
            </div>

        </div>

    </q-card>
</template>

<script setup lang="ts">

const hours = [
    {
        range: '08:00 - 10:00',
        trades: 82,
        winrate: '87%'
    },

    {
        range: '10:00 - 12:00',
        trades: 74,
        winrate: '81%'
    },

    {
        range: '14:00 - 16:00',
        trades: 63,
        winrate: '76%'
    }
]

</script>