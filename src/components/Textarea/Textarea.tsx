import React, { useId, useState } from 'react';
import styles from './Textarea.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

/**
 * Estados externos controlados por el padre.
 * Los estados focused / filled son internos (interacción).
 */
export type TextareaFieldState =
  | 'default'
  | 'success'
  | 'alert'
  | 'error'
  | 'disabled'
  | 'blocked';

export interface TextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'id' | 'onChange' | 'value' | 'defaultValue'
  > {
  /** Etiqueta visible encima del campo */
  label?: string;
  /** Texto de placeholder. Default: 'Escribe aquí' */
  placeholder?: string;
  /** Texto de apoyo mostrado debajo del campo */
  supportingText?: string;
  /** Estado externo de validación. Default: 'default' */
  fieldState?: TextareaFieldState;
  /** Valor controlado */
  value?: string;
  /** Valor inicial (modo no controlado) */
  defaultValue?: string;
  /** Callback al cambiar el valor */
  onChange?: (value: string) => void;
  /**
   * Límite máximo de caracteres. Si se provee, muestra el contador "n/max".
   * Si no se provee, no muestra contador.
   */
  maxLength?: number;
  /** Oculta el contador aunque se haya definido maxLength. Default: false */
  hideCounter?: boolean;
  id?: string;
  className?: string;
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * Textarea del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1194:6707.
 *
 * Estructura: label (14px) → área editable (fondo bg, border-radius 16px) →
 * footer con supporting text a la izquierda y contador de caracteres a la derecha.
 *
 * Estados: default · success · alert · error · disabled · blocked.
 * Estado activo (click): borde 1.5px #00B4FF (importante).
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      placeholder = 'Escribe aquí',
      supportingText,
      fieldState = 'default',
      value,
      defaultValue,
      onChange,
      maxLength,
      hideCounter = false,
      id: externalId,
      className,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = externalId ?? autoId;
    const supportId = `${inputId}-support`;

    const isDisabled = fieldState === 'disabled' || fieldState === 'blocked';

    // Controlled / uncontrolled value tracking
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(
      defaultValue !== undefined ? String(defaultValue) : '',
    );
    const currentValue = isControlled ? String(value ?? '') : internalValue;

    // Active state (click)
    const [isActive, setIsActive] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e.target.value);
    }

    function handleFocus(e: React.FocusEvent<HTMLTextAreaElement>) {
      setIsActive(true);
      rest.onFocus?.(e);
    }

    function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
      setIsActive(false);
      rest.onBlur?.(e);
    }

    // Estado visual del campo
    const hasExternalState =
      fieldState === 'success' ||
      fieldState === 'alert' ||
      fieldState === 'error';

    const fieldStateClass = isDisabled
      ? fieldState === 'disabled'
        ? styles.stateDisabled
        : styles.stateBlocked
      : hasExternalState
        ? styles[`state${fieldState.charAt(0).toUpperCase() + fieldState.slice(1)}`]
        : isActive
          ? styles.stateActive
          : '';

    // Contador de caracteres
    const charCount = currentValue.length;
    const showCounter = maxLength !== undefined && !hideCounter;
    const isOverLimit = maxLength !== undefined && charCount > maxLength;

    return (
      <div
        className={[
          styles.wrapper,
          fieldStateClass,
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        {/* Área del textarea */}
        <div className={`${styles.field} ${fieldStateClass}`}>
          <textarea
            ref={ref}
            id={inputId}
            className={styles.textarea}
            value={isControlled ? value : internalValue}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={fieldState === 'blocked'}
            maxLength={maxLength}
            aria-invalid={fieldState === 'error' || undefined}
            aria-describedby={supportingText ? supportId : undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
        </div>

        {/* Footer: supporting text + contador */}
        {(supportingText || showCounter) && (
          <div className={styles.footer}>
            {supportingText ? (
              <p
                id={supportId}
                className={styles.supportingText}
                role={fieldState === 'error' ? 'alert' : undefined}
              >
                {supportingText}
              </p>
            ) : (
              <span /> /* spacer para empujar el contador a la derecha */
            )}

            {showCounter && (
              <p
                className={[
                  styles.counter,
                  isOverLimit ? styles.overLimit : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-live="polite"
                aria-label={`${charCount} de ${maxLength} caracteres`}
              >
                {charCount}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);
