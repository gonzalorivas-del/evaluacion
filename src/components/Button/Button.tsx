import styles from './Button.module.css';

/** Variantes visuales del botón Zafiro */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link' | 'ia';

/** Tamaños disponibles. Los botones lg y la variante 'ia' usan border-radius pill. */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual. Default: 'primary' */
  variant?: ButtonVariant;
  /** Tamaño del botón. Default: 'md' */
  size?: ButtonSize;
  /** Muestra spinner y bloquea interacción */
  loading?: boolean;
  /** Ícono opcional (SVG, imagen o elemento) */
  icon?: React.ReactNode;
  /** Posición del ícono respecto al texto. Default: 'left' */
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

function Spinner() {
  return <span className={styles.spinner} aria-hidden="true" />;
}

/**
 * Botón del sistema de diseño Zafiro (Rex+).
 * Soporta 5 variantes, 3 tamaños e íconos con posición configurable.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isPill = size === 'lg' || variant === 'ia';

  const classNames = [
    styles.button,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    isPill ? styles.pill : styles.rounded,
    isDisabled ? styles.disabled : '',
    loading ? styles.loading : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={classNames}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {!loading && icon && iconPosition === 'left' && (
        <span className={styles.iconLeft} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.iconRight} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
}
