import { onScopeDispose, ref, watch, type Ref } from 'vue';
import { imageStore } from 'src/services/image-store';

/** Devuelve una object URL reactiva para la captura indicada (se libera automáticamente). */
export function useScreenshotUrl(id: Ref<string | null | undefined>) {
  const url = ref<string | null>(null);
  let token = 0;

  function revoke(): void {
    if (url.value) URL.revokeObjectURL(url.value);
    url.value = null;
  }

  watch(
    id,
    async (value) => {
      const current = ++token;
      revoke();
      if (!value) return;

      const blob = await imageStore.get(value);
      if (current !== token) return;
      url.value = blob ? URL.createObjectURL(blob) : null;
    },
    { immediate: true },
  );

  onScopeDispose(() => {
    token++;
    revoke();
  });

  return url;
}
