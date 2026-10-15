<template>
  <q-input v-model="model" borderless class="app-field" v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotProps" :key="name">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const model = defineModel<string | number | null>();
</script>
