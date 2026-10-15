import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { imageStore } from 'src/services/image-store';
import type { ScreenshotChange, Trade, TradeInput } from 'src/types';
import { generateId } from 'src/utils/id';
import { summarize } from 'src/utils/stats';

export const useTradesStore = defineStore(
  'trades',
  () => {
    const trades = ref<Trade[]>([]);

    /** Más recientes primero */
    const sorted = computed(() =>
      [...trades.value].sort((a, b) => Date.parse(b.openedAt) - Date.parse(a.openedAt)),
    );

    const summary = computed(() => summarize(trades.value));

    async function add(input: TradeInput, screenshot?: File | null): Promise<void> {
      let screenshotId: string | null = null;

      if (screenshot) {
        screenshotId = generateId();
        await imageStore.put(screenshotId, screenshot);
      }

      trades.value.push({ id: generateId(), ...input, screenshotId });
    }

    async function update(id: string, input: TradeInput, change: ScreenshotChange): Promise<void> {
      const index = trades.value.findIndex((t) => t.id === id);
      const current = trades.value[index];
      if (!current) return;

      let screenshotId = current.screenshotId ?? null;

      if (change.action !== 'keep' && screenshotId) {
        await imageStore.remove(screenshotId);
        screenshotId = null;
      }

      if (change.action === 'set') {
        screenshotId = generateId();
        await imageStore.put(screenshotId, change.file);
      }

      trades.value[index] = { id, ...input, screenshotId };
    }

    async function remove(id: string): Promise<void> {
      const trade = trades.value.find((t) => t.id === id);
      if (trade?.screenshotId) await imageStore.remove(trade.screenshotId);
      trades.value = trades.value.filter((t) => t.id !== id);
    }

    function countBy(
      field: 'brokerId' | 'operationTypeId' | 'strategyId' | 'pairId',
      value: string,
    ): number {
      return trades.value.filter((t) => t[field] === value).length;
    }

    function replaceAll(list: Trade[]): void {
      trades.value = list;
    }

    function reassignPair(fromId: string, toId: string): void {
      trades.value = trades.value.map((t) => (t.pairId === fromId ? { ...t, pairId: toId } : t));
    }

    return { trades, sorted, summary, add, update, remove, countBy, replaceAll, reassignPair };
  },
  { persist: true },
);
