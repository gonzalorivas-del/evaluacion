import React, { useId, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Selector.module.css';

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

/* ─── Chevron icons (32×32 icon slot) ───────────────────────────────────── */
function ChevronDown() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M10 13.5L16 19.5L22 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M10 18.5L16 12.5L22 18.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type SelectorFieldState = 'default' | 'success' | 'alert' | 'error' | 'disabled';

export interface SelectorOption {
  /** Valor único de la opción */
  value: string;
  /** Texto a mostrar */
  label: string;
}

export interface SelectorProps {
  /** Etiqueta del campo */
  label: string;
  /** Texto de apoyo bajo el campo */
  supportingText?: string;
  /** Estado de validación externo. Default: 'default' */
  fieldState?: SelectorFieldState;
  /** Opciones del desplegable */
  options?: SelectorOption[];
  /** Valor seleccionado (modo controlado) */
  value?: string;
  /** Valor inicial (modo no controlado) */
  defaultValue?: string;
  /** Callback al seleccionar una opción */
  onChange?: (value: string) => void;
  /** Texto de placeholder cuando no hay selección */
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Selector del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma WgljvPA598MTRm4p5tREGr · nodo 1:1429.
 *
 * Estructura: label (12px) → [valor + chevron] → separador (1px) → supporting text (12px).
 * Estado Expanded: lista de opciones con fondo blanco y border-radius 16px.
 */
export function Selector({
  label,
  supportingText,
  fieldState = 'default',
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = 'Seleccionar',
  className,
  style,
  id: externalId,
}: SelectorProps) {
  const autoId = useId();
  const id = externalId ?? autoId;
  const listId = `${id}-list`;
  const supportId = `${id}-support`;

  const isDisabled = fieldState === 'disabled';

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const selectedValue = isControlled ? (value ?? '') : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const wrapperRef = useRef<HTMLDivElement>(null);

  function updateDropdownPosition() {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }

  // Cierra al hacer clic fuera
  useEffect(() => {
    if (!isOpen) return;
    updateDropdownPosition();
    function onPointerDown(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function onScrollOrResize() {
      updateDropdownPosition();
    }
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === selectedValue);
  const hasValue = !!selectedOption;
  const displayText = selectedOption?.label ?? placeholder;

  function handleToggle() {
    if (isDisabled) return;
    setIsOpen((prev) => !prev);
  }

  function handleSelect(optValue: string) {
    if (!isControlled) setInternalValue(optValue);
    onChange?.(optValue);
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  }

  // Estado visual
  let visualState: string;
  if (isDisabled) {
    visualState = 'disabled';
  } else if (isOpen) {
    visualState = 'expanded';
  } else if (fieldState !== 'default') {
    visualState = fieldState;
  } else if (hasValue) {
    visualState = 'active';
  } else {
    visualState = 'default';
  }

  const wrapperClass = [styles.wrapper, styles[visualState], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={wrapperRef} className={wrapperClass} style={style}>
      <button
        type="button"
        id={id}
        className={styles.trigger}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-describedby={supportingText ? supportId : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.label}><RequiredLabel text={label} /></span>

        <div className={styles.content}>
          <div className={styles.placeholderRow}>
            <span
              className={[styles.displayText, hasValue ? styles.hasValue : '']
                .filter(Boolean)
                .join(' ')}
            >
              {displayText}
            </span>
            <span className={styles.chevron}>
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </span>
          </div>
          <div className={styles.separator} aria-hidden="true" />
        </div>

        {supportingText && (
          <span
            id={supportId}
            className={styles.supportingText}
            role={fieldState === 'error' ? 'alert' : undefined}
          >
            {supportingText}
          </span>
        )}
      </button>

      {isOpen && options.length > 0 && createPortal(
        <ul
          id={listId}
          role="listbox"
          className={styles.dropdown}
          aria-label={label.replace(/\s*\*$/, '')}
          style={dropdownStyle}
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === selectedValue}
              className={styles.item}
              onPointerDown={(e) => {
                // Evita pérdida de foco en el trigger antes del click
                e.preventDefault();
                handleSelect(option.value);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </div>
  );
}
