import { useState } from 'react';

/*
 * Tokens Zafiro usados (src/tokens/tokens.json):
 *   panel:        #5780AD  — título del grupo y headers de tabla
 *   fondo:        #F6F9FA  — fondo del acordeón
 *   blanco:       #FFFFFF  — fondo de bloques de tabla
 *   negro-textos: #333333  — texto de celdas
 *   gris-textos:  #999999  — etiqueta Competencias/Objetivos y total
 *   gris-sec:     #E5E5E5  — separadores de filas
 */

/* ── Chevron ─────────────────────────────────────────────────────────────── */

function ChevronIcon({ direction = 'down', color = '#5780AD', size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{
        transform: direction === 'up' ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.2s ease',
        flexShrink: 0,
      }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Bloque tabla ─────────────────────────────────────────────────────────── */

const thStyle = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '13px',
  color: '#333333',
  padding: '10px 12px',
  textAlign: 'left',
  borderBottom: '1px solid #E5E5E5',
};

const tdStyle = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: '13px',
  color: '#333333',
  padding: '10px 12px',
};

function TablaBloque({ label, items = [] }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Etiqueta: "Competencias: X%" */}
      <p
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: '12px',
          color: '#999999',
          margin: 0,
        }}
      >
        {label}
      </p>

      {/* Tarjeta blanca con tabla */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Ponderado</th>
              <th style={thStyle}>Justificación</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={i}
                style={{ borderTop: i > 0 ? '1px solid #E5E5E5' : undefined }}
              >
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.weight}</td>
                <td style={tdStyle}>{item.justification ?? 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <p
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            color: '#999999',
            margin: 0,
            padding: '8px 12px',
            borderTop: '1px solid #E5E5E5',
          }}
        >
          Total: ({items.length})
        </p>
      </div>
    </div>
  );
}

/* ── GrupoEvaluacion ──────────────────────────────────────────────────────── */

/**
 * GrupoEvaluacion — acordeón de grupo de evaluación para formularios múltiples.
 *
 * Muestra un header colapsable con el título del grupo y un chevron.
 * Al expandirse, presenta dos columnas: competencias y objetivos,
 * cada una con su tabla de ítems ponderados y justificación.
 *
 * @param {string}   title             Ej.: "Grupo evaluación 1"
 * @param {Array}    competencias      Items de competencia: { name, weight, justification? }
 * @param {number}   competencyWeight  Peso total de competencias (%)
 * @param {Array}    objetivos         Items de objetivos: { name, weight, justification? }
 * @param {number}   objectiveWeight   Peso total de objetivos (%)
 * @param {boolean}  defaultExpanded   Si inicia expandido. Default: true
 */
export function GrupoEvaluacion({
  title = 'Grupo evaluación 1',
  competencias = [],
  competencyWeight = 0,
  objetivos = [],
  objectiveWeight = 0,
  defaultExpanded = true,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const showCompetencias = competencias.length > 0;
  const showObjetivos = objetivos.length > 0;

  return (
    <div
      style={{
        background: '#F6F9FA',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* ── Header colapsable ── */}
      <button
        type="button"
        onClick={() => setExpanded(prev => !prev)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        aria-expanded={expanded}
      >
        <span
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '16px',
            color: '#5780AD',
          }}
        >
          {title}
        </span>
        <ChevronIcon direction={expanded ? 'up' : 'down'} />
      </button>

      {/* ── Contenido expandido ── */}
      {expanded && (
        <div
          style={{
            padding: '0 16px 16px',
            display: 'flex',
            gap: '16px',
          }}
        >
          {showCompetencias && (
            <TablaBloque
              label={`Competencias: ${competencyWeight}%`}
              items={competencias}
            />
          )}
          {showObjetivos && (
            <TablaBloque
              label={`Objetivos: ${objectiveWeight}%`}
              items={objetivos}
            />
          )}
        </div>
      )}
    </div>
  );
}
