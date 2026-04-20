import { useEffect } from 'react';

/*
 * Tokens Zafiro usados:
 *   primario:    #1E5591  — título
 *   auxiliar:    #B6CEE7  — borde separador
 *   panel:       #5780AD  — botón cerrar
 *   elevation-2: 0px 5px 8px 0px rgba(0,0,0,0.15)
 */

const sizeMap = {
  sm:  '480px',
  md:  '672px',
  lg:  '896px',
  xl: '1120px',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md', hideClose = false }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.45)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: sizeMap[size] || sizeMap.md,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid #B6CEE7',
        }}>
          <h2 style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '1.3',
            color: '#1E5591',
            margin: 0,
          }}>
            {title}
          </h2>
          {!hideClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5780AD',
                fontSize: '22px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Cuerpo */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
