<template>
  <q-layout
    view="hHh lpR fFf"
    class="dashboard-layout"
  >

    <!-- HEADER -->
    <q-header
      elevated
      class="dashboard-header"
    >
      <q-toolbar class="q-px-lg q-py-sm">

        <!-- MENU BUTTON -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <!-- TITLE -->
        <q-toolbar-title class="text-weight-bold">
          RS Bot Pulse
        </q-toolbar-title>

        <!-- SEARCH -->
        <div class="search-box row items-center q-mr-md">
          <q-icon
            name="search"
            size="18px"
            class="q-mr-sm"
          />

          <span>Search...</span>
        </div>

        <!-- SETTINGS -->
        <q-btn
          flat
          round
          icon="notifications"
          class="q-mr-sm"
        />

        <q-btn
          flat
          round
          icon="settings"
        />

      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <LeftDrawer v-model="leftDrawerOpen" />

    <!-- PAGE -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LeftDrawer from 'src/components/LeftDrawer.vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>