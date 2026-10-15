export interface NavItem {
  label: string;
  icon: string;
  to: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', to: '/' },
  { label: 'Operaciones', icon: 'receipt_long', to: '/trades' },
  { label: 'Pares', icon: 'currency_exchange', to: '/pairs' },
  { label: 'Catálogos', icon: 'tune', to: '/catalogs' },
];

export const FOOTER_NAV_ITEMS: NavItem[] = [
  { label: 'Configuración', icon: 'settings', to: '/settings' },
];
