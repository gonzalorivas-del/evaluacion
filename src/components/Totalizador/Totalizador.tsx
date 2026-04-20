import React from 'react';
import styles from './Totalizador.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface TotalizadorProps {
  /**
   * Suma total de los porcentajes de las secciones activas (0 – 100).
   * - `total === 100` → variante éxito: borde `#6C7E01`, número verde, ícono check.
   * - Cualquier otro valor → variante error: borde `#E24C4C`, número rojo, ícono alerta.
   *
   * Default: 0
   */
  total?: number;
  className?: string;
}

/* ─── Íconos inline SVG ──────────────────────────────────────────────────── */

/** Triángulo de alerta con "!" — error (16×16) */
function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M7.13 2.5L1 13.5h12.26L7.13 2.5Z"
        fill="#E24C4C"
      />
      <path
        d="M7.13 7v3"
        stroke="#ffffff"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="7.13" cy="11.2" r="0.65" fill="#ffffff" />
    </svg>
  );
}

/** Círculo relleno con check blanco — éxito (16×16) */
function CheckFillIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#ACCA54" />
      <path
        d="M5 8l2.2 2.5L11 5.5"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * Totalizador del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1196:18821.
 *
 * Muestra la suma total de los porcentajes de las secciones de evaluación.
 * Cambia automáticamente de variante según si el total es exactamente 100.
 *
 * Variantes de Figma:
 * - **Totalizador-default** (`total ≠ 100`): borde rojo, texto "Total: N% – Deben sumar 100%",
 *   número rojo con ícono de alerta.
 * - **Totalizador-100%** (`total === 100`): borde verde oscuro, texto "Total:",
 *   número verde con ícono check relleno.
 *
 * @example
 * <Totalizador total={70} />   // variante error
 * <Totalizador total={100} />  // variante éxito
 */
export const Totalizador = React.forwardRef<HTMLDivElement, TotalizadorProps>(
  function Totalizador({ total = 0, className }, ref) {
    const isComplete = total === 100;

    const rootClass = [
      styles.container,
      isComplete ? styles.success : styles.error,
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={rootClass}>
        {/* Texto principal */}
        <p className={styles.label}>
          {isComplete ? 'Total:' : `Total: ${total}% - Deben sumar 100%`}
        </p>

        {/* Número + ícono */}
        <div className={styles.numberGroup}>
          {isComplete ? <CheckFillIcon /> : <AlertIcon />}
          <span className={styles.number}>{total}%</span>
        </div>
      </div>
    );
  },
);
