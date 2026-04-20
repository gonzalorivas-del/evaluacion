import React, { useId } from 'react';
import { Checkbox } from '../Checkbox';
import { Switch } from '../Switch';
import styles from './Section.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SectionProps {
  /** Título del encabezado. Default: "Descendente" */
  title?: string;
  /** Descripción debajo del título. Default: "El jefe directo evalúa al colaborador." */
  description?: string;
  /**
   * Estado del acordeón. `true` = abierto (switch ON · contenido expandido).
   * Default: false.
   */
  open?: boolean;
  /** Callback al hacer clic en el toggle. Recibe el nuevo estado `open`. */
  onToggle?: (open: boolean) => void;
  /** Valor del campo Porcentaje (%). Cadena libre para permitir decimales. */
  percentage?: string;
  /** Callback al editar el campo Porcentaje. */
  onPercentageChange?: (value: string) => void;
  /** Estado del checkbox "Privada". Default: false */
  isPrivate?: boolean;
  /** Callback al cambiar el checkbox "Privada". */
  onPrivateChange?: (checked: boolean) => void;
  /** Callback al hacer clic en el ícono de información (ⓘ). */
  onInfoClick?: () => void;
  /** Callback al hacer clic en "Programar apertura". */
  onScheduleOpen?: () => void;
  /** Deshabilita toda interacción. Default: false */
  disabled?: boolean;
  className?: string;
}

/* ─── Íconos inline SVG ──────────────────────────────────────────────────── */

/** Ícono de información — círculo con "i" (24×24) */
function InfoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#5780AD" strokeWidth="1.5" />
      <path d="M12 11v5" stroke="#5780AD" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.8" fill="#5780AD" />
    </svg>
  );
}

/** Ícono de reloj — programar apertura (24×24) */
function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#00B4FF" strokeWidth="1.5" />
      <path
        d="M12 7.5V12l3 1.8"
        stroke="#00B4FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * Section del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1196:18742.
 *
 * Tarjeta acordeón que representa una dirección de evaluación
 * (ej. Descendente, Autoevaluación, Par). El toggle controla si
 * la dirección está activa y expande los controles de configuración
 * (porcentaje, privacidad y programación de apertura).
 *
 * Variantes de Figma:
 * - **Section-accordion-up**: switch OFF, solo encabezado.
 * - **Section-accordion-down**: switch ON, encabezado + campos de configuración.
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <Section
 *   title="Descendente"
 *   description="El jefe directo evalúa al colaborador."
 *   open={open}
 *   onToggle={setOpen}
 *   percentage={pct}
 *   onPercentageChange={setPct}
 *   isPrivate={priv}
 *   onPrivateChange={setPriv}
 *   onScheduleOpen={() => openScheduleModal()}
 * />
 */
export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  function Section(
    {
      title = 'Descendente',
      description = 'El jefe directo evalúa al colaborador.',
      open = false,
      onToggle,
      percentage = '',
      onPercentageChange,
      isPrivate = false,
      onPrivateChange,
      onInfoClick,
      onScheduleOpen,
      disabled = false,
      className,
    },
    ref,
  ) {
    const switchId = useId();

    const rootClass = [
      styles.card,
      open ? styles.isOpen : '',
      disabled ? styles.isDisabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={rootClass}>
        {/* ── Encabezado ── */}
        <div className={styles.header}>
          {/* Fila título + toggle */}
          <div className={styles.titleRow}>
            <Switch
              id={switchId}
              checked={open}
              onChange={(val) => !disabled && onToggle?.(val)}
              disabled={disabled}
              aria-label={`${title}: ${open ? 'activo' : 'inactivo'}`}
            />

            <span className={styles.title}>{title}</span>
          </div>

          {/* Bajada / descripción */}
          <div className={styles.descriptionRow}>
            <p className={styles.description}>{description}</p>
          </div>
        </div>

        {/* ── Contenido expandido (solo cuando open) ── */}
        {open && (
          <div className={styles.expandedContent}>
            {/* Porcentaje (%) */}
            <div className={styles.percentageInput}>
              <label className={styles.inputLabel} htmlFor={`${switchId}-pct`}>
                Porcentaje (%)
              </label>
              <div className={styles.inputBody}>
                <input
                  id={`${switchId}-pct`}
                  type="text"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={percentage}
                  onChange={(e) => onPercentageChange?.(e.target.value)}
                  disabled={disabled}
                  aria-label="Porcentaje"
                />
                <div className={styles.inputUnderline} />
              </div>
            </div>

            {/* Privada checkbox + info */}
            <div className={styles.privateGroup}>
              <Checkbox
                label="Privada"
                checked={isPrivate}
                onChange={onPrivateChange}
                disabled={disabled}
              />
              <button
                type="button"
                className={styles.infoBtn}
                onClick={onInfoClick}
                disabled={disabled}
                aria-label="Más información sobre evaluación privada"
              >
                <InfoIcon />
              </button>
            </div>

            {/* Programar apertura */}
            <button
              type="button"
              className={styles.scheduleBtn}
              onClick={onScheduleOpen}
              disabled={disabled}
            >
              <ClockIcon />
              <span>Programar apertura</span>
            </button>
          </div>
        )}
      </div>
    );
  },
);
