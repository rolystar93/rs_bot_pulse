<template>
  <q-card class="dashboard-card chart-card">

    <div class="chart-header">

      <div class="chart-title">
        Resumen de operaciones
      </div>

      <div class="chart-subtitle">
        últimos 30 días
      </div>

    </div>

    <ApexChart type="area" height="300" :options="chartOptions" :series="series" />

  </q-card>
</template>

<script setup lang="ts">

const series = [
  {
    name: 'Profit',
    data: [92, 90, 84, 76, 65, 63, 64, 60, 45, 47, 58, 62, 61, 58]
  }
]

const chartOptions = {
  chart: {
    toolbar: {
      show: false
    },

    background: 'transparent',

    zoom: {
      enabled: false
    }
  },

  theme: {
    mode: 'dark'
  },

  dataLabels: {
    enabled: false
  },

  stroke: {
    curve: 'smooth',
    width: 4
  },

  colors: ['#4F8CFF'],

  fill: {
    type: 'gradient',

    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.02,
      stops: [0, 90, 100]
    }
  },

  grid: {
    borderColor: 'rgba(255,255,255,0.06)',

    strokeDashArray: 6
  },

  xaxis: {
    categories: [
      '00',
      '02',
      '04',
      '06',
      '08',
      '10',
      '12',
      '14',
      '16',
      '18',
      '20',
      '22',
      '24'
    ],

    labels: {
      style: {
        colors: '#94A3B8'
      }
    }
  },

  yaxis: {
    labels: {
      style: {
        colors: '#94A3B8'
      }
    }
  },

  tooltip: {
    theme: 'dark'
  },

  legend: {
    show: false
  }
}

</script>