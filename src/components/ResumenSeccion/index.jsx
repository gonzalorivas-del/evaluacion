import { EditIcon } from '../../assets/icons/EditIcon';
import { EyeIcon } from '../../assets/icons/EyeIcon';
import { TrashIcon } from '../../assets/icons/TrashIcon';

/*
 * Tokens Zafiro usados (src/tokens/tokens.json):
 *   panel:       #5780AD  — título y subtítulo
 *   importante:  #00B4FF  — botones de acción (editar, vista previa)
 *   error:       #E24C4C  — botón eliminar
 *   blanco:      #FFFFFF  — fondo tarjeta
 *   elevation-2: 0px 5px 8px 0px rgba(0,0,0,0.15)
 */

const actionBtnBase = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: '14px',
  padding: 0,
  lineHeight: 1,
};

/**
 * ResumenSeccion — tarjeta de sección para la vista "Resumen y activación".
 *
 * Proporciona el contenedor externo (blanco, elevation-2) y la cabecera
 * con título, subtítulo opcional y botones de acción (Vista previa, Editar,
 * Eliminar). El contenido interno queda a cargo del componente hijo.
 *
 * @param {string}   title         Título de la sección (color panel #5780AD)
 * @param {string}   [subtitle]    Subtítulo debajo del título
 * @param {Function} [onEdit]      Muestra botón "Editar" con ícono lápiz
 * @param {Function} [onPreview]   Muestra botón "Vista previa" con ícono ojo
 * @param {Function} [onDelete]    Muestra botón de eliminación con ícono papelera
 * @param {string}   [deleteLabel] Etiqueta del botón eliminar (default: "Eliminar")
 * @param {ReactNode} children     Contenido de la sección
 */
export function ResumenSeccion({
  title,
  subtitle,
  onEdit,
  onPreview,
  onDelete,
  deleteLabel = 'Eliminar',
  children,
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Cabecera ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        {/* Título + subtítulo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <p
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              color: '#5780AD',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {title}
          </p>
          {subtitle && (
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                color: '#5780AD',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              style={{ ...actionBtnBase, color: '#00B4FF' }}
            >
              <EyeIcon size={16} color="#00B4FF" />
              <span>Vista previa</span>
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              style={{ ...actionBtnBase, color: '#00B4FF' }}
            >
              <EditIcon size={16} color="#00B4FF" />
              <span>Editar</span>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              style={{ ...actionBtnBase, color: '#E24C4C' }}
            >
              <TrashIcon size={16} color="#E24C4C" />
              <span>{deleteLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Contenido ── */}
      {children}
    </div>
  );
}

/**
 * ResumenSeccionContent — contenedor interno con borde auxiliar.
 * Usar dentro de <ResumenSeccion> cuando el contenido es una grilla
 * de campos clave-valor (Datos del proceso, Estructura, Formulario).
 *
 * @param {ReactNode} children Contenido (grilla de campos)
 */
export function ResumenSeccionContent({ children }) {
  return (
    <div
      style={{
        border: '1px solid #B6CEE7',
        borderRadius: '8px',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}

/**
 * ResumenCampo — par etiqueta/valor para mostrar dentro de ResumenSeccionContent.
 *
 * @param {string}    label    Etiqueta pequeña gris
 * @param {ReactNode} children Valor (texto, chip, lista, etc.)
 */
export function ResumenCampo({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: '12px',
          color: '#999999',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      <div
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          color: '#333333',
          lineHeight: 1.3,
        }}
      >
        {children}
      </div>
    </div>
  );
}
