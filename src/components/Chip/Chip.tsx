import styles from './Chip.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type ChipVariant = 'default' | 'active';

export interface ChipProps {
  /** Etiqueta principal del chip */
  label: string;
  /**
   * Contador opcional mostrado en negrita entre paréntesis al final del label.
   * Ej.: `count={50}` → "(50)"
   */
  count?: number | string;
  /**
   * Estado activo / filtro aplicado.
   * Usa el color `importante` (#00B4FF).
   */
  active?: boolean;
  /**
   * Invierte el ícono chevron hacia arriba.
   * Útil cuando el panel/dropdown asociado está abierto.
   */
  expanded?: boolean;
  /** Deshabilita la interacción. Default: false */
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

/* ─── Chevron icon ────────────────────────────────────────────────────────── */

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      aria-hidden="true"
      className={styles.chevron}
    >
      <path
        d="M1 1L6 6L11 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * Chip (filtro pill) del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1214:20435.
 *
 * Pill interactivo de altura fija 24px con etiqueta, contador opcional
 * y chevron que indica la presencia de un desplegable.
 *
 * @example
 * // Filtro inactivo
 * <Chip label="Ver colaboradores incluidos" count={50} onClick={openPanel} />
 *
 * @example
 * // Filtro activo (con valor aplicado)
 * <Chip label="Empresa" count={3} active onClick={openPanel} />
 *
 * @example
 * // Dropdown abierto
 * <Chip label="Tipo" expanded onClick={closePanel} />
 */
export function Chip({
  label,
  count,
  active = false,
  expanded = false,
  disabled = false,
  onClick,
  className,
}: ChipProps) {
  const rootClass = [
    styles.chip,
    active ? styles.active : '',
    expanded ? styles.expanded : '',
    disabled ? styles.isDisabled : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={rootClass}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-expanded={expanded}
    >
      <span className={styles.labelText}>
        {label}
        {count !== undefined && (
          <>
            {' '}
            <strong className={styles.count}>({count})</strong>
          </>
        )}
      </span>

      {/* Contenedor 24×24 para el chevron (fiel al Figma) */}
      <span className={styles.iconWrap} aria-hidden="true">
        <ChevronIcon />
      </span>
    </button>
  );
}
