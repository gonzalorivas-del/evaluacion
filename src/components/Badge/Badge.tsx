import styles from './Badge.module.css';

export type BadgeVariant = 'solid-success' | 'solid-error' | 'solid-alert' | 'solid-primary';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  /** Variante de color del badge */
  variant: BadgeVariant;
  /** Texto visible del badge */
  label: string;
  /** Tamaño. Default: 'md' */
  size?: BadgeSize;
}

const ARIA_LABELS: Record<BadgeVariant, string> = {
  'solid-success': 'éxito',
  'solid-error': 'error',
  'solid-alert': 'alerta',
  'solid-primary': 'activo',
};

export function Badge({ variant, label, size = 'md' }: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[variant], styles[`size-${size}`]].join(' ')}
      role="status"
      aria-label={`Estado ${ARIA_LABELS[variant]}: ${label}`}
    >
      {label}
    </span>
  );
}
