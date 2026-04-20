import styles from './Breadcrumb.module.css';

/* ─── Ícono Home (Icon/Home — Figma Zafiro, 16×16) ──────────────────────── */
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 6.5L8 1.5L14.5 6.5V14H10.5V10H5.5V14H1.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Ícono Arrow Left (Icon/Arrow left — Figma Zafiro, 24×24) ───────────── */
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19 12H5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 5L5 12L12 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface BreadcrumbProps {
  /**
   * Ruta de navegación mostrada sobre el título.
   * Ej: "/ Evaluaciones /"
   */
  breadcrumb?: string;
  /**
   * Título principal de la página.
   * Tipografía H5 — Roboto Medium 25px, color primario-oscuro.
   */
  title: string;
  /**
   * Texto del badge de estado junto al título.
   * Ej: "Borrador", "Activo", "Finalizado"
   * Renderiza con borde importante (#00B4FF) y texto importante-oscuro (#019BE5).
   */
  badge?: string;
  /**
   * Información secundaria bajo el título.
   * Ej: "04/01/2026 → 31/01/2026  - Evaluación 180°"
   * Soporta espacios pre-formateados (white-space: pre).
   */
  subhead?: string;
  /**
   * Callback al hacer clic en la flecha de volver.
   * Si no se provee, la flecha no se renderiza.
   */
  onBack?: () => void;
  /** Etiqueta accesible del botón volver. Default: "Volver" */
  backLabel?: string;
  className?: string;
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * Breadcrumb — Encabezado de página del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1221:20488.
 *
 * Estructura:
 *   [🏠] / ruta /          ← Roboto Regular 10px, gris-oscuro
 *   [←] Título  [Badge]    ← Roboto Medium  25px, primario-oscuro
 *        Subtítulo          ← Roboto Regular 14px, gris-textos
 */
export function Breadcrumb({
  breadcrumb,
  title,
  badge,
  subhead,
  onBack,
  backLabel = 'Volver',
  className,
}: BreadcrumbProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.inner}>

        {/* Fila 1 — Ruta de migas */}
        {breadcrumb && (
          <div className={styles.path}>
            <HomeIcon className={styles.homeIcon} />
            <p className={styles.pathText}>{breadcrumb}</p>
          </div>
        )}

        {/* Fila 2 — Flecha + Título + Badge */}
        <div className={styles.titleRow}>
          <div className={styles.comebackGroup} style={!onBack ? { paddingLeft: '32px' } : undefined}>
            {onBack && (
              <button
                type="button"
                className={styles.backButton}
                onClick={onBack}
                aria-label={backLabel}
              >
                <ArrowLeftIcon />
              </button>
            )}
            <h1 className={styles.title}>{title}</h1>
          </div>

          {badge && (
            <div className={styles.badge}>
              <span className={styles.badgeText}>{badge}</span>
            </div>
          )}
        </div>

        {/* Fila 3 — Subtítulo */}
        {subhead && (
          <div className={styles.subhead}>
            <p className={styles.subheadText}>{subhead}</p>
          </div>
        )}

      </div>
    </div>
  );
}
