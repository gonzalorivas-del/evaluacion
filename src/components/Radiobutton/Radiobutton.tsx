import React, { useId } from 'react';
import styles from './Radiobutton.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface RadiobuttonProps {
  /** Texto visible junto al radio button */
  label: React.ReactNode;
  /** Valor del radio button — usado en grupos con `name` */
  value?: string;
  /** Nombre del grupo de radio buttons (HTML name) */
  name?: string;
  /** Estado seleccionado (modo controlado) */
  checked?: boolean;
  /** Estado inicial seleccionado (modo no controlado) */
  defaultChecked?: boolean;
  /** Deshabilita el componente. Default: false */
  disabled?: boolean;
  /**
   * Callback al seleccionar. Recibe el `value` del radio button.
   * En modo no controlado, el navegador gestiona el estado.
   */
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * Radiobutton del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1194:6715.
 *
 * Estructura: círculo SVG (24×24, 2px padding) + etiqueta de texto (14px).
 * Usa `<input type="radio">` nativo oculto para accesibilidad completa.
 * Los estados visuales (checked, disabled, focus, hover) son gestionados
 * vía CSS con selectores de hermano adyacente sobre el input nativo.
 *
 * Para grupos de radio, comparte el mismo `name` entre instancias:
 * @example
 * const [val, setVal] = useState('org');
 * <>
 *   <Radiobutton name="alcance" value="org" label="Toda la organización"
 *     checked={val === 'org'} onChange={setVal} />
 *   <Radiobutton name="alcance" value="area" label="Área específica"
 *     checked={val === 'area'} onChange={setVal} />
 * </>
 */
export const Radiobutton = React.forwardRef<HTMLInputElement, RadiobuttonProps>(
  function Radiobutton(
    {
      label,
      value,
      name,
      checked,
      defaultChecked,
      disabled = false,
      onChange,
      id: externalId,
      className,
    },
    ref,
  ) {
    const autoId = useId();
    const id = externalId ?? autoId;

    const rootClass = [
      styles.root,
      disabled ? styles.isDisabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (e.target.checked) onChange?.(e.target.value ?? '');
    }

    return (
      <label htmlFor={id} className={rootClass}>
        {/* Input nativo — oculto visualmente pero accesible */}
        <input
          ref={ref}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          className={styles.input}
        />

        {/* Círculo visual (fiel al Figma: 24×24, padding 2px → círculo 20×20) */}
        <span className={styles.radioWrap} aria-hidden="true">
          <span className={styles.circle} />
        </span>

        {/* Etiqueta */}
        <span className={styles.labelText}>{label}</span>
      </label>
    );
  },
);
