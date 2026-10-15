import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { CatalogItem } from 'src/types';
import { generateId } from 'src/utils/id';

/**
 * Fábrica de stores para catálogos simples (solo nombre), p. ej. brokers o tipos de operación.
 */
export function defineCatalogStore(id: string) {
  return defineStore(
    id,
    () => {
      const items = ref<CatalogItem[]>([]);

      const sorted = computed(() => [...items.value].sort((a, b) => a.name.localeCompare(b.name)));
      const options = computed(() => sorted.value.map((i) => ({ label: i.name, value: i.id })));

      function nameOf(itemId: string): string {
        return items.value.find((i) => i.id === itemId)?.name ?? '—';
      }

      function exists(name: string): boolean {
        const normalized = name.trim().toLowerCase();
        return items.value.some((i) => i.name.toLowerCase() === normalized);
      }

      /** Devuelve `false` si el nombre está vacío o ya existe. */
      function add(name: string, description = ''): boolean {
        const clean = name.trim();
        if (!clean || exists(clean)) return false;

        const note = description.trim();
        items.value.push({ id: generateId(), name: clean, ...(note && { description: note }) });
        return true;
      }

      function remove(itemId: string): void {
        items.value = items.value.filter((i) => i.id !== itemId);
      }

      function descriptionOf(itemId: string): string {
        return items.value.find((i) => i.id === itemId)?.description ?? '';
      }

      function replaceAll(list: CatalogItem[]): void {
        items.value = list;
      }

      return { items, sorted, options, nameOf, descriptionOf, exists, add, remove, replaceAll };
    },
    { persist: true },
  );
}
