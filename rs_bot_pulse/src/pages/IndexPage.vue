<template>
  <q-page class="q-pa-lg dashboard-page">

    <div class="row q-col-gutter-lg">

      <!-- CARDs -->
      <card-activos-averaje title="EURUSD" average="R$ 12 400" gp="+12%" lastmount="vs last month"
        flag1="fi fi-eu pair-flag" flag2="fi fi-us pair-flag" />
      <card-activos-averaje title="GBPUSD" average="R$ 12 400" gp="+12%" lastmount="vs last month"
        flag1="fi fi-gb pair-flag" flag2="fi fi-us pair-flag" />
      <card-activos-averaje title="USDJPY" average="R$ 12 400" gp="+12%" lastmount="vs last month"
        flag1="fi fi-us pair-flag" flag2="fi fi-jp pair-flag" />
      <card-portafolio-general title="TOTAL" average="R$ 12 400" gp="+12%" lastmount="vs last month"
        icon="show_chart" />
    </div>

    <!-- CHART + TOP PAIRS -->
    <div class="row q-col-gutter-lg q-mt-md">

      <!-- CHART -->
      <div class="col col-md-8">
        <trading-chart />
      </div>

      <!-- TOP PAIRS -->
      <div class="col col-md-4">
        <TopPairsCard />
      </div>

    </div>
    <!-- WIN/LOSS Y MEJORES HORARIOS -->
    <div class="row dashboard-grid q-col-gutter-lg q-mt-lg">

      <div class="col col-md-4 chart-wrapper">
        <WinLossCard />
      </div>

      <div class="col col-md-4 pairs-wrapper">
        <BestHoursCard />
      </div>

      <div class="col col-md-4 pairs-wrapper">
        <ResumeRentCard />
      </div>

    </div>

  </q-page>
</template>

<script setup lang="ts">

import BestHoursCard from 'src/components/BestHoursCard.vue';
import CardActivosAveraje from 'src/components/CardActivosAveraje.vue';
import CardPortafolioGeneral from 'src/components/CardPortafolioGeneral.vue';
import ResumeRentCard from 'src/components/ResumeRentCard.vue';
import TopPairsCard from 'src/components/TopPairsCard.vue';
import TradingChart from 'src/components/TradingChart.vue';
import WinLossCard from 'src/components/WinLossCard.vue';
</script>