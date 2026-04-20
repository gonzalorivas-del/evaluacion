import React, { useId, useRef, useEffect } from 'react';
import styles from './Checkbox.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CheckboxProps {
  /** Texto visible junto al checkbox */
  label: React.ReactNode;
  /** Nombre del grupo / campo de formulario (HTML name) */
  name?: string;
  /** Estado marcado (modo controlado) */
  checked?: boolean;
  /** Estado inicial marcado (modo no controlado) */
  defaultChecked?: boolean;
  /**
   * Estado indeterminado — muestra un guión en lugar del check.
   * Útil para el patrón "seleccionar todos" cuando solo algunos
   * ítems están seleccionados. Solo funciona en modo controlado.
   */
  indeterminate?: boolean;
  /** Deshabilita el componente. Default: false */
  disabled?: boolean;
  /**
   * Callback al cambiar estado. Recibe el nuevo valor `checked`.
   */
  onChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * Checkbox del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1214:20428.
 *
 * Estructura: caja SVG (24×24, 2px padding → caja 20×20, border-radius 4px)
 * + etiqueta de texto (14px Roboto).
 * Usa `<input type="checkbox">` nativo oculto para accesibilidad completa.
 * Los estados visuales (checked, indeterminate, disabled, focus, hover)
 * son gestionados vía CSS con selectores de hermano adyacente sobre el
 * input nativo.
 *
 * @example
 * // Modo controlado
 * const [checked, setChecked] = useState(false);
 * <Checkbox label="Incluir evaluación de potencial"
 *   checked={checked} onChange={setChecked} />
 *
 * @example
 * // Estado indeterminado (seleccionar todos)
 * <Checkbox label="Seleccionar todos" indeterminate checked={false}
 *   onChange={handleSelectAll} />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      name,
      checked,
      defaultChecked,
      indeterminate = false,
      disabled = false,
      onChange,
      id: externalId,
      className,
    },
    ref,
  ) {
    const autoId = useId();
    const id = externalId ?? autoId;

    /* Ref interno para poder mutar .indeterminate (no es atributo HTML) */
    const innerRef = useRef<HTMLInputElement>(null);

    /* Fusión de ref externo + ref interno mediante callback ref */
    function setInputRef(el: HTMLInputElement | null) {
      (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      if (!ref) return;
      if (typeof ref === 'function') ref(el);
      else (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    }

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const rootClass = [
      styles.root,
      disabled ? styles.isDisabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      onChange?.(e.target.checked);
    }

    return (
      <label htmlFor={id} className={rootClass}>
        {/* Input nativo — oculto visualmente pero accesible */}
        <input
          ref={setInputRef}
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          className={styles.input}
        />

        {/* Caja visual (24×24 wrapper → 20×20 caja con border-radius 4px) */}
        <span className={styles.checkWrap} aria-hidden="true">
          <span className={styles.box}>
            {/* Ícono check (estado checked) */}
            <svg
              className={styles.checkIcon}
              width="12"
              height="9"
              viewBox="0 0 12 9"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1.5 4.5L4.5 7.5L10.5 1.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Ícono dash (estado indeterminate) */}
            <span className={styles.dashIcon} />
          </span>
        </span>

        {/* Etiqueta */}
        <span className={styles.labelText}>{label}</span>
      </label>
    );
  },
);
