<template>
  <q-drawer v-model="leftDrawerOpen" class="dashboard-drawer" :width="260" :breakpoint="400">
    <q-scroll-area style="
            height: calc(100% - 150px);
            margin-top: 150px;
            /* border-right: 1px solid #ddd; */
          ">
      <q-list padding>
        <q-item v-for="item in menuItems" :key="item.title" clickable v-ripple :to="item.route"
          active-class="menu-active">

          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>
            {{ item.title }}
          </q-item-section>

        </q-item>
      </q-list>
    </q-scroll-area>

    <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
      <div class="absolute-bottom bg-transparent">
        <q-avatar size="56px" class="q-mb-sm">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <div class="text-weight-bold">Razvan Stoenescu</div>
        <div>@rstoenescu</div>
      </div>
    </q-img>
  </q-drawer>

</template>

<script setup lang="ts">
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
const menuItems = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/'
  },

  {
    title: 'Pares de Trading',
    icon: 'candlestick_chart',
    route: '/trading-pairs'
  },
  {
    title: 'Operaciones',
    icon: 'trading',
    route: '/'
  },
  {
    title: 'Inversiones',
    icon: 'trading',
    route: '/'
  },
  {
    title: 'Configuración',
    icon: 'setting',
    route: '/'
  },
]
</script>
