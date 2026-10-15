import { Dialog, Notify } from 'quasar';
import ConfirmDialog from 'components/ui/ConfirmDialog.vue';

interface ConfirmOptions {
  title: string;
  message: string;
  okLabel?: string;
  cancelLabel?: string;
  /** Si se indica, el usuario debe escribir este texto para habilitar la confirmación */
  requireText?: string;
}

export function useFeedback() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      Dialog.create({ component: ConfirmDialog, componentProps: { ...options } })
        .onOk(() => resolve(true))
        .onDismiss(() => resolve(false));
    });
  }

  /** Advertencia estándar al cancelar un formulario con cambios sin guardar. */
  function confirmDiscard(): Promise<boolean> {
    return confirm({
      title: 'Descartar cambios',
      message: 'Si cancelas, se perderá la información ingresada. ¿Deseas continuar?',
      okLabel: 'Descartar',
      cancelLabel: 'Seguir editando',
    });
  }

  function notify(message: string, type: 'positive' | 'negative' = 'positive'): void {
    Notify.create({ message, type });
  }

  return { confirm, confirmDiscard, notify };
}
