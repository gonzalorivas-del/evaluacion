import { useEffect, useRef } from 'react';
import styles from './Snackbar.module.css';

export type SnackbarVariant = 'primary' | 'success' | 'alert' | 'error' | 'important';

export interface SnackbarProps {
  /** Variante visual. Define colores del ícono y fondo. */
  variant: SnackbarVariant;
  /** Texto del mensaje */
  message: string;
  /**
   * Duración en ms antes de cerrarse automáticamente.
   * 0 = persistente (no se cierra solo). Default: 4000
   */
  duration?: number;
  /** Callback al cerrarse (botón × o auto-close) */
  onClose?: () => void;
  /** Acción opcional con texto y callback */
  action?: { label: string; onClick: () => void };
  className?: string;
}

/* ─── Inline SVG icons — idénticos a los del diseño Figma ──────────────── */

function IconInfo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 11.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 12l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const ICONS: Record<SnackbarVariant, React.ReactNode> = {
  primary:   <IconInfo />,
  error:     <IconInfo />,
  important: <IconInfo />,
  success:   <IconCheck />,
  alert:     <IconAlert />,
};

const ARIA_ROLES: Record<SnackbarVariant, 'status' | 'alert'> = {
  primary:   'status',
  success:   'status',
  important: 'status',
  alert:     'alert',
  error:     'alert',
};

/* ─── Component ─────────────────────────────────────────────────────────── */

/**
 * Snackbar del sistema de diseño Zafiro (Rex+).
 * Variantes: primary, success, alert, error, important.
 * Idéntico al diseño Figma: WgljvPA598MTRm4p5tREGr node 1:2076.
 */
export function Snackbar({
  variant,
  message,
  duration = 4000,
  onClose,
  action,
  className,
}: SnackbarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (duration > 0 && onClose) {
      timerRef.current = setTimeout(onClose, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, onClose]);

  return (
    <div
      className={[styles.snackbar, styles[variant], className ?? ''].filter(Boolean).join(' ')}
      role={ARIA_ROLES[variant]}
      aria-live={ARIA_ROLES[variant] === 'alert' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {/* Icon container — izquierda, fondo sólido */}
      <div className={styles.iconContainer} aria-hidden="true">
        {ICONS[variant]}
      </div>

      {/* Mensaje */}
      <span className={styles.message}>{message}</span>

      {/* Acción opcional */}
      {action && (
        <button
          type="button"
          className={styles.actionBtn}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}

      {/* Botón cerrar */}
      {onClose && (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Cerrar notificación"
        >
          <IconClose />
        </button>
      )}
    </div>
  );
}
