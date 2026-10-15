<template>
  <q-select
    v-model="model"
    borderless
    emit-value
    map-options
    class="app-field"
    popup-content-class="app-menu"
    v-bind="$attrs"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps" :key="name">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const model = defineModel<unknown>();
</script>
