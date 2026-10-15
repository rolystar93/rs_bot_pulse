import { date } from 'quasar';
import { FORMAT } from 'src/constants/app';

const amountFormatter = new Intl.NumberFormat(FORMAT.locale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Importes sin símbolo de moneda: la app es agnóstica a la divisa. */
export function formatAmount(value: number): string {
  return amountFormatter.format(value);
}

export function formatSignedAmount(value: number): string {
  return `${value > 0 ? '+' : ''}${formatAmount(value)}`;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toLocaleString(FORMAT.locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}

export function formatDateTime(iso: string): string {
  return date.formatDate(iso, FORMAT.dateTime);
}

/** ISO -> valor aceptado por `<input type="datetime-local">` */
export function toLocalInput(iso: string): string {
  return date.formatDate(iso, 'YYYY-MM-DDTHH:mm');
}

/** Valor de `<input type="datetime-local">` -> ISO */
export function fromLocalInput(value: string): string {
  return new Date(value).toISOString();
}

export function nowLocalInput(): string {
  return date.formatDate(Date.now(), 'YYYY-MM-DDTHH:mm');
}

export function formatDuration(openedAt: string, closedAt: string): string {
  const totalSeconds = Math.max(0, Math.round((Date.parse(closedAt) - Date.parse(openedAt)) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours && `${hours} h`, minutes && `${minutes} min`, (seconds || !totalSeconds) && `${seconds} s`]
    .filter(Boolean)
    .join(' ');
}
