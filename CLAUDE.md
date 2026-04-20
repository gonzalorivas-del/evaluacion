# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

React 19 + TypeScript + Vite project implementing the **Zafiro design system** (Rex+).

- `src/tokens/tokens.json` — single source of truth for all design tokens (colors, typography, spacing, border-radius). Exported from Figma Design System - Rex+.
- `src/components/[ComponentName]/` — one component per folder; each folder contains `index.jsx` and optionally `[Name].stories.jsx`.
- `manifest.json` — catálogo de componentes disponibles: props, variantes y estados de cada componente Zafiro. Revisar antes de crear cualquier componente nuevo.


## Design System Rules (from PROMPT_RULES.md)

### Tokens
- **Never hardcode** design values (colors, sizes, spacing). Always import and use `tokens.json`.
- Token structure: `tokens.colors.*`, `tokens.typography.*`, `tokens.zafiro.*`
- Zafiro spacing tokens support size modes: `S | M | L | XL`

### Typography
- Primary font: **Roboto**
- Secondary font: **Montserrat** (high-level headings only)
- Never use Arial or generic sans-serif

### Components
- Check if a component already exists before creating one
- PascalCase component names, camelCase props
- Use `ZafiroX` prefix only when disambiguation is needed
- All components must be accessible: `aria-*`, `role`, `label`
- Props documented with JSDoc; TypeScript types exported

### Colors (semantic names from tokens.json)
`primario`, `primario-oscuro`, `panel`, `fondo`, `importante`, `exito`, `alerta`, `error`, `gris-*`, `negro-textos`, `blanco`
