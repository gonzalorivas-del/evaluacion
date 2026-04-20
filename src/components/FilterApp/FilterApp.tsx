import { useState } from 'react';
import styles from './FilterApp.module.css';

/* ─── Icons ──────────────────────────────────────────────────────────────── */

/** Icono de filtro/ajuste — 24×24. Reproduce Icon/System/Filter de Figma. */
function IconFilter() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6"  cy="5"  r="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="10" r="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9"  cy="15" r="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Chevron pequeño para el campo de filtro — reproduce Icon/System/Select down. */
function IconSelectDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10.5L12 14.5L17 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface FilterField {
  /** Identificador único del campo */
  key: string;
  /** Etiqueta visible del campo */
  label: string;
  /** Valor actualmente seleccionado (opcional) */
  value?: string;
}

export interface FilterAppProps {
  /** Etiqueta del trigger en estado colapsado. Default: 'Filtro' */
  label?: string;
  /** Título del panel expandido. Default: 'Filtrar por' */
  title?: string;
  /** Campos de filtro mostrados en el panel */
  fields?: FilterField[];
  /** Estado expandido en modo controlado */
  expanded?: boolean;
  /** Estado expandido inicial en modo no controlado */
  defaultExpanded?: boolean;
  /** Callback al alternar el panel */
  onToggle?: () => void;
  /** Callback al hacer clic en un campo de filtro */
  onFieldClick?: (key: string, field: FilterField) => void;
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * FilterApp del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma WgljvPA598MTRm4p5tREGr · nodo 11680:4031.
 *
 * Variante Default: trigger compacto con icono de filtro.
 * Variante Expanded: panel con título y campos de filtro desplegables.
 * Sombra: effects.elevation-3 → 0px 4px 16px rgba(0,0,0,0.15).
 */
export function FilterApp({
  label = 'Filtro',
  title = 'Filtrar por',
  fields = [
    { key: 'empresa',         label: 'Empresa'        },
    { key: 'centro-de-costo', label: 'Centro de costo' },
    { key: 'por-tipo',        label: 'Por tipo'        },
  ],
  expanded,
  defaultExpanded = false,
  onToggle,
  onFieldClick,
  className,
}: FilterAppProps) {
  const isControlled = expanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = isControlled ? expanded : internalExpanded;

  function handleToggle() {
    if (!isControlled) setInternalExpanded((prev) => !prev);
    onToggle?.();
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        className={[styles.trigger, className].filter(Boolean).join(' ')}
        onClick={handleToggle}
        aria-expanded={false}
        aria-label={label}
      >
        <span className={styles.triggerLabel}>{label}</span>
        <span className={styles.triggerIcon}>
          <IconFilter />
        </span>
      </button>
    );
  }

  return (
    <div className={[styles.panel, className].filter(Boolean).join(' ')}>
      <p className={styles.panelTitle}>{title}</p>

      <ul className={styles.fieldList} role="list">
        {fields.map((field) => (
          <li key={field.key}>
            <button
              type="button"
              className={styles.filterField}
              onClick={() => onFieldClick?.(field.key, field)}
              aria-label={field.label}
            >
              <span className={styles.filterFieldLabel}>
                {field.value ?? field.label}
              </span>
              <span className={styles.filterFieldIcon} aria-hidden="true">
                <IconSelectDown />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
