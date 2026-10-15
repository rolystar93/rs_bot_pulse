import type { ApexOptions } from 'apexcharts';

/** Opciones base de ApexCharts alineadas con los design tokens. */
export function baseChartOptions(): ApexOptions {
  return {
    chart: { toolbar: { show: false }, background: 'transparent', zoom: { enabled: false } },
    theme: { mode: 'dark' },
    dataLabels: { enabled: false },
    grid: { borderColor: 'rgba(120, 135, 175, 0.18)', strokeDashArray: 6 },
    tooltip: { theme: 'dark' },
    legend: { show: false },
    xaxis: { labels: { style: { colors: '#9aa4bd' } } },
    yaxis: { labels: { style: { colors: '#9aa4bd' } } },
  };
}
