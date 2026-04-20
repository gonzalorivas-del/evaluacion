import React, { useId, useState } from 'react';
import styles from './InputField.module.css';

/**
 * Estados externos controlados por el padre.
 * default, success, alert, error, disabled, blocked.
 * Los estados activated / filled / focus son internos (interacción).
 */
export type InputFieldState = 'default' | 'success' | 'alert' | 'error' | 'disabled' | 'blocked';

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** Etiqueta del campo — aparece encima cuando está activo o tiene valor */
  label: string;
  /** Texto de ayuda/contexto bajo el campo */
  supportingText?: string;
  /** Estado externo. Default: 'default' */
  fieldState?: InputFieldState;
  /** Ícono derecho. Default: ícono info del sistema Zafiro */
  icon?: React.ReactNode;
  /** Ocultar el ícono derecho */
  hideIcon?: boolean;
  id?: string;
}

/* ─── Label con asterisco requerido ─────────────────────────────────────── */
function RequiredLabel({ text }: { text: string }) {
  if (!text.endsWith('*')) return <>{text}</>;
  return (
    <>
      {text.slice(0, -1).trimEnd()}
      {' '}
      <span style={{ color: '#E24C4C' }} aria-hidden="true">*</span>
    </>
  );
}

/* ─── Default icon: Info (Figma Zafiro) ────────────────────────────────── */
function IconInfo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 11.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */

/**
 * InputField del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma WgljvPA598MTRm4p5tREGr · nodo 267:7946.
 *
 * Estructura: label (12px) → input row (16px + icon 24px) → separador (1px) → supporting text (12px)
 * Estados: default · activated · filled · success · alert · error · disabled · blocked.
 */
export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      label,
      supportingText,
      fieldState = 'default',
      icon,
      hideIcon = false,
      id: externalId,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
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
    const hasValue = currentValue.length > 0;

    // Interaction state
    const [isFocused, setIsFocused] = useState(false);

    // Label is visible when focused OR has value (and not pure default+empty)
    const showLabel = isFocused || hasValue;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    }
    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      setIsFocused(true);
      onFocus?.(e);
    }
    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      setIsFocused(false);
      onBlur?.(e);
    }

    // Compute the CSS state modifier
    // External states take priority over interaction states for coloring
    const hasExternalState =
      fieldState === 'success' ||
      fieldState === 'alert' ||
      fieldState === 'error';

    const interactionMod = !hasExternalState
      ? isFocused && !hasValue
        ? 'activated'    // focused, no value → cyan colors
        : hasValue
          ? 'filled'     // has value → gray colors
          : 'default'    // empty, not focused
      : fieldState;

    const wrapperClass = [
      styles.wrapper,
      styles[interactionMod],
      showLabel ? styles.showLabel : '',
      isDisabled ? styles.isDisabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClass}>
        {/* Label — siempre en DOM para reservar espacio, opacity 0→1 */}
        <label htmlFor={inputId} className={styles.label}>
          <RequiredLabel text={label} />
        </label>

        {/* Input base */}
        <div className={styles.inputBase}>
          <div className={styles.inputRow}>
            <input
              ref={ref}
              id={inputId}
              className={styles.input}
              value={isControlled ? value : internalValue}
              placeholder={showLabel ? '' : label.replace(/\s*\*$/, '')}
              disabled={isDisabled}
              aria-invalid={fieldState === 'error' || undefined}
              aria-describedby={supportingText ? supportId : undefined}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...rest}
            />
            {!hideIcon && (
              <span className={styles.icon} aria-hidden="true">
                {icon ?? <IconInfo />}
              </span>
            )}
          </div>
          <div className={styles.separator} aria-hidden="true" />
        </div>

        {/* Supporting text */}
        {supportingText && (
          <span
            id={supportId}
            className={styles.supportingText}
            role={fieldState === 'error' ? 'alert' : undefined}
          >
            {supportingText}
          </span>
        )}
      </div>
    );
  },
);
