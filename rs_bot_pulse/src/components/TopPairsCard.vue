<template>
  <q-card class="dashboard-card top-pairs-card">

    <!-- HEADER -->
    <div class="top-card-header">

      <div class="top-card-title">
        Top Winning Pairs
      </div>

      <!-- <div class="top-card-link">
        View All
      </div> -->

    </div>

    <!-- ITEM -->
    <div v-for="pair in pairs" :key="pair.name" class="pair-ranking-item">

      <!-- FLAGS -->
      <div class="pair-ranking-left">

        <div class="pair-flags">

          <span :class="`fi fi-${pair.flag1} pair-flag`"></span>

          <span :class="`fi fi-${pair.flag2} pair-flag`"></span>

        </div>

      </div>

      <!-- INFO -->
      <div class="pair-ranking-content">

        <div class="pair-ranking-name">
          {{ pair.name }}
        </div>

        <div class="pair-ranking-subtitle">
          {{ pair.operations }} operations
        </div>

      </div>

      <!-- WINRATE -->
      <div class="pair-ranking-profit" :class="pair.positive
        ? 'status-profit'
        : 'status-loss'">
        {{ pair.winrate }}
      </div>

    </div>

  </q-card>
</template>

<script setup lang="ts">

const pairs = [
  {
    name: 'EUR/USD',
    flag1: 'eu',
    flag2: 'us',
    operations: 142,
    winrate: '+82%',
    positive: true
  },

  {
    name: 'GBP/USD',
    flag1: 'gb',
    flag2: 'us',
    operations: 98,
    winrate: '+74%',
    positive: true
  },

  {
    name: 'USD/JPY',
    flag1: 'us',
    flag2: 'jp',
    operations: 76,
    winrate: '+61%',
    positive: true
  }
]

</script>