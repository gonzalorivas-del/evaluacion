import { useState } from 'react';
import { InputField } from '../InputField';
import { Selector } from '../Selector';
import { Checkbox } from '../Checkbox';
import { TrashIcon } from '../../assets/icons/TrashIcon';
import styles from './BloquesSeleccion.module.css';

/* ─── Search icon ────────────────────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15.5 15.5L19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Percent icon ───────────────────────────────────────────────────────── */
function PercentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="8.5" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="15.5" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * BloquesSeleccion — componente de selección dual del sistema de diseño Zafiro.
 *
 * Panel izquierdo: listado de competencias disponibles con buscador y checkboxes.
 * Panel derecho:   competencias seleccionadas, cada una en una sola fila con:
 *                  [Icono eliminar] [Selector de escala] [Input nombre competencia]
 *
 * @param {Array}    available       - Competencias disponibles {id, name, description}
 * @param {Array}    selected        - Competencias seleccionadas {id, name, scale}
 * @param {Function} onToggle        - Agrega o elimina una competencia
 * @param {Function} onUpdateScale       - Actualiza la escala de una competencia seleccionada
 * @param {Function} onUpdatePercentage  - Actualiza el porcentaje de una competencia seleccionada
 * @param {Array}    scaleOptions        - Opciones de escala {value, label}
 * @param {string}   currentScale        - Escala por defecto
 */
export function BloquesSeleccion({
  available = [],
  selected = [],
  onToggle,
  onUpdateScale,
  onUpdatePercentage,
  scaleOptions = [],
  currentScale = 'likert1-5',
}) {
  const [search, setSearch] = useState('');

  const filteredAvailable = available.filter(
    c =>
      !selected.find(s => s.id === c.id) &&
      (!search || c.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className={styles.container}>
      {/* ── Left panel: Available ── */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            Disponibles ({filteredAvailable.length})
          </span>
          <div className={styles.searchWrap}>
            <InputField
              label="Buscar"
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<SearchIcon />}
            />
          </div>
        </div>

        <div className={styles.list} role="list" aria-label="Competencias disponibles">
          {filteredAvailable.length === 0 && (
            <p className={styles.empty}>Sin resultados</p>
          )}
          {filteredAvailable.map(c => (
            <div key={c.id} className={styles.availableItem} role="listitem">
              <Checkbox
                label={<span className={styles.itemName}>{c.name}</span>}
                checked={false}
                onChange={() => onToggle(c)}
              />
              {c.description && (
                <p className={styles.itemDesc}>{c.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel: Selected ── */}
      <div className={`${styles.panel} ${styles.panelRight}`}>
        <div className={styles.panelHeaderRight}>
          <span className={styles.panelTitle}>
            Seleccionadas ({selected.length})
          </span>
        </div>

        <div className={styles.selectedList} role="list" aria-label="Competencias seleccionadas">
          {selected.length === 0 ? (
            <p className={styles.empty}>Ninguna competencia seleccionada</p>
          ) : (
            selected.map(c => (
              <div key={c.id} className={styles.selectedItem} role="listitem">
                {/* Input porcentaje — primero (izquierda), label = nombre competencia */}
                <div className={styles.inputWrap} style={{ width: 85 }}>
                  <InputField
                    label={c.name}
                    value={c.percentage !== undefined ? String(c.percentage) : ''}
                    onChange={e => onUpdatePercentage?.(c.id, Number(e.target.value) || 0)}
                    type="number"
                    min="0"
                    max="100"
                    icon={<PercentIcon />}
                  />
                </div>

                {/* Selector de escala — segundo, ocupa el espacio restante */}
                <div className={styles.selectorWrap} style={{ flex: 1 }}>
                  <Selector
                    label="Escala"
                    options={scaleOptions}
                    value={c.scale || currentScale}
                    onChange={scale => onUpdateScale(c.id, scale)}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Trash — eliminar, último (derecha) */}
                <button
                  type="button"
                  onClick={() => onToggle(c)}
                  className={styles.trashBtn}
                  aria-label={`Eliminar ${c.name}`}
                >
                  <TrashIcon color="#E24C4C" size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
