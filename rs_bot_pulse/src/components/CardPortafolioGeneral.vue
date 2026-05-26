<template>
  <div class="col-12 col-md-3">

    <q-card class="dashboard-card kpi-card fade-up">

      <div class="pair-title">
        <div class="pair-icon">
          <q-icon :name=props.icon size="18px" />
        </div>
        <span>
          {{ props.title }}
        </span>




      </div>

      <div class="kpi-value">
        <!-- +$12,480 -->
        {{ props.average }}
      </div>

      <div class="kpi-footer">

        <div class="kpi-badge-positive">
          <!-- +12% -->
          {{ props.gp }}
        </div>

        <div class="text-grey">
          <!-- vs last month -->
          {{ props.lastmount }}
        </div>

      </div>

    </q-card>

  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: String,
  average: String,
  gp: String,
  lastmount: String,
  icon: String
})
</script>
