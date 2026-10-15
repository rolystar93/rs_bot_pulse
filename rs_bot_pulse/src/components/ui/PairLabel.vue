<template>
  <span class="pair-label">
    <span v-if="pair && (pair.baseFlag || pair.quoteFlag)" class="pair-label__flags">
      <span v-if="pair.baseFlag" :class="`fi fi-${pair.baseFlag}`" />
      <span v-if="pair.quoteFlag" :class="`fi fi-${pair.quoteFlag}`" />
    </span>
    <span>{{ pair?.symbol ?? '—' }}</span>
  </span>
</template>

<script setup lang="ts">
import type { TradingPair } from 'src/types';

defineProps<{ pair?: TradingPair | undefined }>();
</script>
