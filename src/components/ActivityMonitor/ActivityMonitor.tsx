import styles from './ActivityMonitor.module.css';

// ─── Icon SVG ────────────────────────────────────────────────────────────────
// Alert triangle con exclamación — mismo shape para todos los estados.
// El color se hereda de la clase .state_* del contenedor vía currentColor.
function AlertIcon() {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d="M9.27 1.27a2 2 0 013.46 0l8.47 14.67A2 2 0 0119.47 19H2.53a2 2 0 01-1.73-3.06L9.27 1.27z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11 8v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="11" cy="15.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type ActivityMonitorState =
  | 'Default'
  | 'Success'
  | 'Alert'
  | 'Error'
  | 'Important'
  | 'Intermediate';

export interface ActivityMonitorProps {
  /** Texto de la etiqueta. Default: 'Label text' */
  labelText?: string;
  /** Número o métrica principal. Default: '00' */
  number?: string;
  /** Estado semántico que define el color del ícono. Default: 'Default' */
  state?: ActivityMonitorState;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ActivityMonitor — Tarjeta de monitoreo de actividad del sistema Zafiro (Rex+).
 *
 * Muestra un indicador de estado semántico (ícono + label) y una métrica
 * numérica principal. Seis estados disponibles: Default, Success, Alert,
 * Error, Important, Intermediate.
 */
export function ActivityMonitor({
  labelText = 'Label text',
  number = '00',
  state = 'Default',
  className,
}: ActivityMonitorProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      {/* Title row: icon + label */}
      <div className={[styles.titleRow, styles[`state_${state}`]].join(' ')}>
        <div className={styles.icon} aria-hidden="true">
          <AlertIcon />
        </div>
        <p className={styles.label}>{labelText}</p>
      </div>

      {/* Main metric */}
      <p className={styles.number}>{number}</p>
    </div>
  );
}
