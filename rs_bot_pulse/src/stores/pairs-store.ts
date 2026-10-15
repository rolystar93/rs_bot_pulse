import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { TRADING_PAIRS } from 'src/data/trading-pairs';
import type { TradingPair } from 'src/types';

/** Pares predeterminados + pares personalizados del usuario (estos últimos se persisten). */
export const usePairsStore = defineStore(
  'pairs',
  () => {
    const customPairs = ref<TradingPair[]>([]);

    const pairs = computed<TradingPair[]>(() => [...TRADING_PAIRS, ...customPairs.value]);

    const options = computed(() =>
      pairs.value.map((pair) => ({ label: pair.symbol, value: pair.id, pair })),
    );

    function getById(pairId: string): TradingPair | undefined {
      return pairs.value.find((pair) => pair.id === pairId);
    }

    function exists(pairId: string): boolean {
      return pairs.value.some((pair) => pair.id === pairId);
    }

    /** Devuelve `false` si el par ya existe. */
    function addCustom(pair: TradingPair): boolean {
      if (exists(pair.id)) return false;
      customPairs.value.push({ ...pair, category: 'custom' });
      return true;
    }

    /** Reemplaza un par personalizado; falla si el nuevo id choca con otro par. */
    function updateCustom(pairId: string, pair: TradingPair): boolean {
      const index = customPairs.value.findIndex((p) => p.id === pairId);
      if (index < 0 || (pair.id !== pairId && exists(pair.id))) return false;
      customPairs.value[index] = { ...pair, category: 'custom' };
      return true;
    }

    function removeCustom(pairId: string): void {
      customPairs.value = customPairs.value.filter((pair) => pair.id !== pairId);
    }

    /** Une pares importados sin duplicar ni pisar los existentes. */
    function mergeCustom(imported: TradingPair[]): void {
      imported.forEach(addCustom);
    }

    return { customPairs, pairs, options, getById, exists, addCustom, updateCustom, removeCustom, mergeCustom };
  },
  { persist: true },
);
