import React from 'react';
import styles from './Switch.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SwitchProps {
  /** Estado activo del switch. Default: false */
  checked?: boolean;
  /** Callback al cambiar el estado. Recibe el nuevo valor booleano. */
  onChange?: (checked: boolean) => void;
  /** Deshabilita la interacción. Default: false */
  disabled?: boolean;
  /** Etiqueta accesible (aria-label). */
  'aria-label'?: string;
  /** id HTML del botón (útil para asociar con label). */
  id?: string;
  className?: string;
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * Switch (toggle pill) del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma Dqb9zzAic5hpI5KVoPEZ5Y · nodo 1:1223.
 *
 * Pill interactivo de 40×24px con dos estados:
 * - **OFF**: track gris (#CCCCCC) · thumb a la izquierda.
 * - **ON**:  track verde (#ACCA54) · thumb a la derecha.
 *
 * @example
 * const [on, setOn] = useState(false);
 * <Switch checked={on} onChange={setOn} aria-label="Activar evaluación privada" />
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(
    {
      checked = false,
      onChange,
      disabled = false,
      'aria-label': ariaLabel,
      id,
      className,
    },
    ref,
  ) {
    const rootClass = [
      styles.switch,
      checked ? styles.on : styles.off,
      disabled ? styles.isDisabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={rootClass}
      >
        <span className={styles.thumb} />
      </button>
    );
  },
);
