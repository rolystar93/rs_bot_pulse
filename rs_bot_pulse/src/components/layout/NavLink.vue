<template>
  <router-link v-slot="{ href,   navigate, isExactActive }" :to="item.to" custom>
      <a :href="href" :class="['nav-link', { 'nav-link--active': isExactActive }]" @click="navigate">
      <q-icon :name="item.icon" size="22px" />
      <span>{{ item.label }}</span>
    </a>
  </router-link>
</template>

<script setup lang="ts">
import type { NavItem } from 'src/constants/navigation';

defineProps<{ item: NavItem }>();
</script>
