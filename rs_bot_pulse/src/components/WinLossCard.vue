<template>
  <q-card class="dashboard-card winloss-card">

    <div class="card-title">
      Win / Loss Ratio
    </div>

    <div class="ratio-section">

      <div class="ratio-header">
        <span>Wins</span>
        <span class="status-profit">78%</span>
      </div>

      <q-linear-progress :value="0.78" rounded size="14px" color="positive" />

    </div>

    <div class="ratio-section">

      <div class="ratio-header">
        <span>Losses</span>
        <span class="status-loss">22%</span>
      </div>

      <q-linear-progress :value="0.22" rounded size="14px" color="negative" />

    </div>

    <div class="trade-summary">

      <div class="summary-number">
        316
      </div>

      <div class="summary-label">
        Total Trades
      </div>

    </div>

  </q-card>
</template>

<script setup lang="ts">
//
</script>
