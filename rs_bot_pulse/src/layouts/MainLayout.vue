<template>
  <q-layout view="lHh Lpr lFf" class="app-shell">
    <q-drawer model-value behavior="desktop" :width="260" class="app-sidebar">
      <div class="app-sidebar__layout">
        <div class="app-sidebar__brand">
          <div class="app-sidebar__logo"><q-icon name="bolt" size="24px" /></div>
          <span>{{ APP_NAME }}</span>
        </div>

        <nav>
          <NavLink v-for="item in NAV_ITEMS" :key="item.to" :item="item" />
        </nav>

        <nav class="app-sidebar__footer">
          <NavLink v-for="item in FOOTER_NAV_ITEMS" :key="item.to" :item="item" />
        </nav>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NavLink from 'components/layout/NavLink.vue';
import { APP_NAME } from 'src/constants/app';
import { FOOTER_NAV_ITEMS, NAV_ITEMS } from 'src/constants/navigation';
</script>
