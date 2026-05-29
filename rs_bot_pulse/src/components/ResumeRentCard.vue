<template>
    <q-card class="dashboard-card roi-card">

        <div class="roi-header">

            <div class="roi-icon" :class="roiClass">
                <q-icon :name="roiIcon" size="22px" />
            </div>

            <span>
                {{ roi >= 0 ? 'Rentable' : 'No Rentable' }}
            </span>

        </div>

        <div class="roi-value" :class="roi >= 0
            ? 'status-profit'
            : 'status-loss'">
            {{ roi.toFixed(0) }}%
        </div>

        <div class="roi-details">

            <div class="roi-row">

                <span>Inversión</span>

                <span>
                    R$ {{ investment }}
                </span>

            </div>

            <div class="roi-row">

                <span>Ganancia</span>

                <span>
                    R$ {{ profit }}
                </span>

            </div>

            <div class="roi-row net-result">

                <span>Beneficio Neto</span>

                <span>
                    R$ {{ netProfit }}
                </span>

            </div>

        </div>

    </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const investment = 500
const profit = 1240

const netProfit = profit - investment

const roi = (netProfit / investment) * 100

const roiIcon = computed(() =>
    roi >= 0
        ? 'trending_up'
        : 'trending_down'
)

const roiClass = computed(() =>
    roi >= 0
        ? 'status-profit'
        : 'status-loss'
)
</script>