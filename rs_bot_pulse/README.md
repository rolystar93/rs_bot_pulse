# RS Bot Pulse

App de escritorio (Quasar + Vite + Electron) para registrar y analizar operaciones de trading. Sin servidor: todo se guarda localmente mediante stores de Pinia persistidos en `localStorage`.

## Scripts

```bash
npm install
npm run dev            # navegador
npm run dev:desktop    # Electron
npm run build:desktop  # empaquetado de escritorio (dist/electron)
npm run lint
```

> Si el binario de Electron no se descarga tras `npm install` (scripts bloqueados), ejecuta `node node_modules/electron/install.js`.

## Funcionalidades

- Operaciones con captura de pantalla opcional (archivo, arrastrar o pegar con Ctrl+V); clic en una fila para ver el detalle y ampliar la imagen.
- Pares predeterminados más pares personalizados (desde la página *Pares* o el formulario de operación).
- *Configuración*: copia de seguridad (JSON), importación y zona roja que borra operaciones, brokers, tipos y capturas conservando todos los pares.
- Metadatos en localStorage; capturas en IndexedDB.

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/css` | Sistema de estilos centralizado: `abstracts` (tokens + mixins neumórficos), `base`, `components`, `layout` |
| `src/components/ui` | Componentes genéricos reutilizables (`AppCard`, `AppButton`, `AppInput`, `AppSelect`, `AppDialog`, `StatCard`, `PairLabel`...) |
| `src/components/{catalog,trades,dashboard}` | Componentes de dominio |
| `src/stores` | `trades`, `brokers`, `operation-types` (persistidos) y `pairs` (catálogo estático con banderas). `factories/catalog-store.ts` genera los catálogos de solo nombre |
| `src/data/trading-pairs.ts` | Catálogo de pares (majors, cruces, exóticos) |
| `src/utils` | Formato (importes/fecha) y estadísticas puras |
| `src/constants` | Configuración de la app, navegación, tema de gráficos |

Los importes se muestran sin símbolo de moneda (la app es agnóstica a la divisa). Para cambiar el formato numérico/fecha edita `src/constants/app.ts`.
