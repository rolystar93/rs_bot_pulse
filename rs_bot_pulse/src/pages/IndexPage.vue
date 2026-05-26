<template>
  <q-page class="q-pa-lg">

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

  </q-page>
</template>

<script setup lang="ts">
import CardActivosAveraje from 'src/components/CardActivosAveraje.vue';
import CardPortafolioGeneral from 'src/components/CardPortafolioGeneral.vue';
</script>