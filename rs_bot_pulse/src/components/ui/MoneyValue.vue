<template>
  <span :class="['tabular', value > 0 && 'text-profit', value < 0 && 'text-loss']">
    {{ formatSignedAmount(value) }}
  </span>
</template>

<script setup lang="ts">
import { formatSignedAmount } from 'src/utils/format';

defineProps<{ value: number }>();
</script>
