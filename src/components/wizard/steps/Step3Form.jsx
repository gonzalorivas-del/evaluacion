import { useState } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import { InputField } from '../../InputField';
import { Selector } from '../../Selector';
import { Checkbox } from '../../Checkbox';
import { Button } from '../../Button';
import { Textarea } from '../../Textarea';
import { BloquesSeleccion } from '../../BloquesSeleccion';
import { ArrowRightIcon } from '../../../assets/icons/ArrowRightIcon';
import { TrashIcon } from '../../../assets/icons/TrashIcon';
import {
  MOCK_TRANSVERSAL_COMPETENCIES,
  MOCK_POTENTIAL_QUESTIONS,
  SCALE_OPTIONS,
  DIRECTION_LABELS,
} from '../../../data/constants';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const DIRECTION_KEYS = [
  'descendente',
  'autoEvaluacion',
  'ascendente',
  'pares',
  'autodiseno',
  'descendenteDiseno',
];

const JUSTIFICATION_OPTIONS = [
  { value: 'none', label: 'No requerida' },
  { value: 'always', label: 'Requerida siempre' },
  { value: 'low', label: 'Solo si calificación es baja' },
];

/* ─── Shared styles ──────────────────────────────────────────────────────── */

const sectionCard = {
  background: '#FFFFFF',
  borderRadius: '16px',
  boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const sectionTitle = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '16px',
  color: '#5780AD',
  margin: 0,
};

const groupTitle = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '16px',
  color: '#333333',
  margin: 0,
};

/* ─── Icons ──────────────────────────────────────────────────────────────── */

function PercentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="8.5" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="15.5" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Step 3: Formulario ─────────────────────────────────────────────────── */

export default function Step3Form() {
  const { currentEval, updateCurrentEval, saveCurrentEval, setActiveStep, addToast } =
    useEvaluation();

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState(null);

  if (!currentEval) return null;
  const ev = currentEval;

  const isMultiple = ev.formType === 'multiple';
  const activeDirectionKeys = DIRECTION_KEYS.filter(k => ev.directions[k]?.active);
  const currentFormTab = isMultiple ? activeFormTab || activeDirectionKeys[0] : null;
  const compTotal = (ev.functionalPercentage || 0) + (ev.transversalPercentage || 0);

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!ev.formName.trim()) errs.formName = 'El formulario necesita un nombre.';
    if (ev.weighting.competencies > 0) {
      if (
        ev.selectedTransversalCompetencies.length === 0 &&
        ev.transversalPercentage > 0
      ) {
        errs.competencies = 'Selecciona al menos una competencia transversal.';
      }
      if (compTotal !== 100) {
        errs.compPercentage = `Las competencias deben sumar 100%. Actualmente: ${compTotal}%.`;
      }
    }
    return errs;
  };

  /* ── Handlers ── */
  const handleSaveAndContinue = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    saveCurrentEval(3);
    if (ev.hasCalibration && ev.tabStates?.step5 !== 'complete') {
      setActiveStep(5);
    } else if (ev.hasFeedback && ev.tabStates?.step6 !== 'complete') {
      setActiveStep(6);
    } else if (ev.tabStates?.step7 !== 'complete') {
      setActiveStep(7);
    } else {
      setActiveStep(4);
    }
  };

  const handleSaveDraft = () => {
    saveCurrentEval(3);
    addToast('Borrador guardado correctamente.');
  };

  const toggleTransversalComp = (comp) => {
    updateCurrentEval(prev => {
      const exists = prev.selectedTransversalCompetencies.find(c => c.id === comp.id);
      return {
        ...prev,
        selectedTransversalCompetencies: exists
          ? prev.selectedTransversalCompetencies.filter(c => c.id !== comp.id)
          : [
              ...prev.selectedTransversalCompetencies,
              { ...comp, scale: prev.scale || 'likert1-5', percentage: 0 },
            ],
      };
    });
    setErrors(e => ({ ...e, competencies: undefined }));
  };

  const updateTransversalScale = (compId, scale) => {
    updateCurrentEval(prev => ({
      ...prev,
      selectedTransversalCompetencies: prev.selectedTransversalCompetencies.map(
        c => (c.id === compId ? { ...c, scale } : c),
      ),
    }));
  };

  const updateTransversalPercentage = (compId, percentage) => {
    updateCurrentEval(prev => ({
      ...prev,
      selectedTransversalCompetencies: prev.selectedTransversalCompetencies.map(
        c => (c.id === compId ? { ...c, percentage } : c),
      ),
    }));
  };

  const togglePotentialQuestion = (q) => {
    updateCurrentEval(prev => {
      const exists = prev.potentialQuestions.find(pq => pq.id === q.id);
      return {
        ...prev,
        potentialQuestions: exists
          ? prev.potentialQuestions.filter(pq => pq.id !== q.id)
          : [...prev.potentialQuestions, { ...q, scale: prev.scale }],
      };
    });
  };

  /* ── Render ── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Multiple form tabs ── */}
      {isMultiple && activeDirectionKeys.length > 0 && (
        <div style={{
          border: '1px solid #CCCCCC',
          padding: '12px',
          background: '#FAFAFA',
          borderRadius: '8px',
        }}>
          <p style={{ fontSize: '12px', color: '#666666', marginBottom: '8px', fontWeight: 500, margin: '0 0 8px 0' }}>
            Formulario múltiple — Configurando para:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            {activeDirectionKeys.map(k => (
              <button
                key={k}
                type="button"
                onClick={() => setActiveFormTab(k)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  border: '1px solid',
                  borderColor: currentFormTab === k ? '#1E5591' : '#CCCCCC',
                  background: currentFormTab === k ? '#1E5591' : 'transparent',
                  color: currentFormTab === k ? '#FFFFFF' : '#666666',
                  borderRadius: '24px',
                  cursor: 'pointer',
                }}
              >
                {DIRECTION_LABELS[k]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Sección 1: Información del formulario
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={sectionCard}>
        <p style={sectionTitle}>1. Información del formulario</p>

        <InputField
          label="Nombre del formulario *"
          value={ev.formName}
          onChange={e => {
            updateCurrentEval({ formName: e.target.value });
            setErrors(er => ({ ...er, formName: undefined }));
          }}
          fieldState={errors.formName ? 'error' : 'default'}
          supportingText={errors.formName || 'Identifica el instrumento internamente.'}
          hideIcon
        />

        <Textarea
          label="Descripción del formulario - (Opcional)"
          value={ev.formDescription}
          onChange={val => updateCurrentEval({ formDescription: val })}
          placeholder="Describe el formulario aquí"
          maxLength={100}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          Sección 2: Competencias a evaluar
      ══════════════════════════════════════════════════════════════════════ */}
      {ev.weighting.competencies > 0 && (
        <section style={sectionCard}>
          <p style={sectionTitle}>2. Competencias a evaluar</p>

          {/* Justificación por competencia */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={groupTitle}>Justificación por competencia</p>
            <Selector
              label="Justificación por competencia"
              options={JUSTIFICATION_OPTIONS}
              style={{ width: '100%' }}
              value={ev.competencyJustification}
              onChange={val => updateCurrentEval({ competencyJustification: val })}
            />
          </div>

          {/* Cuanto ponderan las competencias en total */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={groupTitle}>Cuanto ponderan las competencias en total</p>
            <div style={{ width: '310px' }}>
              <InputField
                label="Ponderación total"
                value={String(ev.weighting.competencies)}
                onChange={e =>
                  updateCurrentEval({
                    weighting: {
                      ...ev.weighting,
                      competencies: Number(e.target.value) || 0,
                    },
                  })
                }
                type="number"
                min="0"
                max="100"
                icon={<PercentIcon />}
              />
            </div>
          </div>

          {/* Distribución por tipo + Competencias Transversales */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>

            <p style={groupTitle}>Distribución por tipo</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Inputs Funcionales / Transversales + totalizador */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '24px',
                  paddingLeft: '0',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ width: '140px' }}>
                    <InputField
                      label="Funcionales"
                      value={String(ev.functionalPercentage)}
                      onChange={e => {
                        updateCurrentEval({ functionalPercentage: Number(e.target.value) || 0 });
                        setErrors(er => ({ ...er, compPercentage: undefined }));
                      }}
                      type="number"
                      min="0"
                      max="100"
                      icon={<PercentIcon />}
                    />
                  </div>
                  <div style={{ width: '140px' }}>
                    <InputField
                      label="Transversales"
                      value={String(ev.transversalPercentage)}
                      onChange={e => {
                        updateCurrentEval({ transversalPercentage: Number(e.target.value) || 0 });
                        setErrors(er => ({ ...er, compPercentage: undefined }));
                      }}
                      type="number"
                      min="0"
                      max="100"
                      icon={<PercentIcon />}
                    />
                  </div>
                  {/* Total indicator */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    alignSelf: 'center',
                  }}>
                    <p style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: compTotal === 100 ? '#6C7E01' : '#E24C4C',
                      margin: 0,
                      whiteSpace: 'nowrap',
                    }}>
                      {compTotal === 100
                        ? `Total: ${compTotal}% ✓`
                        : `Total: ${compTotal}% — Deben sumar 100%`}
                    </p>
                  </div>
                </div>

                {errors.compPercentage && (
                  <p style={{ fontSize: '12px', color: '#E24C4C', margin: 0 }}>
                    {errors.compPercentage}
                  </p>
                )}

                {/* Competencias Transversales */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', borderRadius: '16px' }}>
                  <p style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#0A396C',
                    margin: 0,
                  }}>
                    Competencias Transversales
                  </p>
                  <BloquesSeleccion
                    available={MOCK_TRANSVERSAL_COMPETENCIES}
                    selected={ev.selectedTransversalCompetencies}
                    onToggle={toggleTransversalComp}
                    onUpdateScale={updateTransversalScale}
                    onUpdatePercentage={updateTransversalPercentage}
                    scaleOptions={SCALE_OPTIONS}
                    currentScale={ev.scale || 'likert1-5'}
                  />
                </div>
            </div>
          </div>

          {errors.competencies && (
            <p style={{
              fontSize: '12px',
              color: '#E24C4C',
              border: '1px solid rgba(226,76,76,0.3)',
              background: 'rgba(226,76,76,0.05)',
              padding: '8px 12px',
              borderRadius: '8px',
              margin: 0,
            }}>
              {errors.competencies}
            </p>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Sección 3: Objetivos del período
      ══════════════════════════════════════════════════════════════════════ */}
      {ev.weighting.objectives > 0 && (
        <section style={sectionCard}>
          <p style={sectionTitle}>
            {'3. Objetivos del período: '}
            {ev.objectivesPeriod && (
              <span style={{ color: '#1E5591' }}>{ev.objectivesPeriod.name}</span>
            )}
          </p>

          {/* Justificación por objetivos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={groupTitle}>Justificación por objetivos</p>
            <Selector
              label="Seleccionar"
              options={JUSTIFICATION_OPTIONS}
              value={ev.objectiveJustification}
              onChange={val => updateCurrentEval({ objectiveJustification: val })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Cuanto ponderan los objetivos en total */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={groupTitle}>Cuanto ponderan los objetivos en total</p>
            <div style={{ width: '310px' }}>
              <InputField
                label="Ponderación total"
                value={String(ev.weighting.objectives)}
                onChange={e =>
                  updateCurrentEval({
                    weighting: {
                      ...ev.weighting,
                      objectives: Number(e.target.value) || 0,
                    },
                  })
                }
                type="number"
                min="0"
                max="100"
                icon={<PercentIcon />}
              />
            </div>
          </div>

          {/* Peso objetivos individuales */}
          <div style={{ width: '310px' }}>
            <InputField
              label="Peso objetivos individuales"
              value={String(ev.individualObjectivesWeight)}
              onChange={e =>
                updateCurrentEval({
                  individualObjectivesWeight: Number(e.target.value) || 0,
                })
              }
              type="number"
              min="0"
              max="100"
              icon={<PercentIcon />}
              supportingText="Si solo tienes objetivos individuales, deja en 100%."
            />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Sección 4: Evaluación de potencial (condicional)
      ══════════════════════════════════════════════════════════════════════ */}
      {ev.hasPotential && (
        <section style={sectionCard}>
          <p style={sectionTitle}>4. Evaluación de potencial</p>
          <p style={{ fontSize: '12px', color: '#999999', margin: 0 }}>
            Selecciona las preguntas de potencial a incluir en el formulario.
          </p>
          <PotentialPanel
            available={MOCK_POTENTIAL_QUESTIONS}
            selected={ev.potentialQuestions}
            onToggle={togglePotentialQuestion}
            onUpdateScale={(id, scale) =>
              updateCurrentEval(prev => ({
                ...prev,
                potentialQuestions: prev.potentialQuestions.map(q =>
                  q.id === id ? { ...q, scale } : q,
                ),
              }))
            }
            scaleOptions={SCALE_OPTIONS}
            currentScale={ev.scale}
          />
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Sección 5: Campos adicionales (colapsable)
      ══════════════════════════════════════════════════════════════════════ */}
      <CollapsibleTextFields ev={ev} updateCurrentEval={updateCurrentEval} />

      {/* ── Botones de acción ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '56px',
        paddingTop: '16px',
      }}>
        {/* Grupo izquierdo: Guardar borrador + Vista previa */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Button variant="secondary" size="md" onClick={handleSaveDraft}>
            Guardar borrador
          </Button>
          <Button variant="secondary" size="md" onClick={() => setShowPreview(true)}>
            Vista previa formulario
          </Button>
        </div>

        {/* Guardar y continuar — icono 16px color auxiliar */}
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveAndContinue}
          icon={<ArrowRightIcon size={16} color="#B6CEE7" />}
          iconPosition="right"
        >
          Guardar y continuar
        </Button>
      </div>

      {/* ── Modal: Vista previa ── */}
      {showPreview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '672px',
            width: '100%',
            margin: '16px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid #E5E5E5',
            }}>
              <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#1E5591', margin: 0 }}>
                Vista previa: {ev.formName || 'Formulario'}
              </h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666666', lineHeight: 1 }}
                aria-label="Cerrar vista previa"
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {ev.weighting.competencies > 0 && (
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E5591', margin: '0 0 12px 0' }}>
                    Competencias ({ev.weighting.competencies}%)
                  </p>
                  {[...ev.selectedFunctionalCompetencies, ...ev.selectedTransversalCompetencies].map(c => (
                    <div key={c.id} style={{
                      border: '1px solid #E5E5E5',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '8px',
                    }}>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E5591', margin: '0 0 4px 0' }}>{c.name}</p>
                      <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>{c.description}</p>
                    </div>
                  ))}
                </div>
              )}
              {ev.weighting.objectives > 0 && (
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E5591', margin: '0 0 8px 0' }}>
                    Objetivos ({ev.weighting.objectives}%)
                  </p>
                  <div style={{ border: '1px solid #E5E5E5', borderRadius: '8px', padding: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>
                      Los objetivos del período "{ev.objectivesPeriod?.name}" serán listados aquí.
                    </p>
                  </div>
                </div>
              )}
              {ev.hasPotential && ev.potentialQuestions.length > 0 && (
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E5591', margin: '0 0 8px 0' }}>Potencial</p>
                  {ev.potentialQuestions.map(q => (
                    <div key={q.id} style={{ border: '1px solid #E5E5E5', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                      <p style={{ fontSize: '14px', color: '#333333', margin: 0 }}>{q.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {ev.textFields.strengths && (
                <div style={{ border: '1px solid #E5E5E5', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#333333', margin: '0 0 8px 0' }}>Fortalezas</p>
                  <div style={{ height: '64px', border: '1px solid #E5E5E5', borderRadius: '8px', background: '#F6F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#999999' }}>Campo de texto libre</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PotentialPanel ─────────────────────────────────────────────────────── */
/* Panel simple para preguntas de potencial (sin BloquesSeleccion).          */

function PotentialPanel({ available, selected, onToggle, onUpdateScale, scaleOptions, currentScale }) {
  const [search, setSearch] = useState('');

  const filteredAvailable = available.filter(
    q =>
      !selected.find(s => s.id === q.id) &&
      (!search || q.text.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      {/* Disponibles */}
      <div style={{ border: '1px solid #B6CEE7', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px', background: '#F6F9FA', borderBottom: '1px solid #B6CEE7' }}>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#666666', margin: '0 0 4px 0' }}>
            Disponibles ({filteredAvailable.length})
          </p>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            style={{
              width: '100%',
              border: '1px solid #CCCCCC',
              padding: '4px 8px',
              fontSize: '12px',
              borderRadius: '4px',
              fontFamily: 'Roboto, sans-serif',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ maxHeight: '192px', overflowY: 'auto' }}>
          {filteredAvailable.length === 0 && (
            <p style={{ fontSize: '12px', color: '#999999', textAlign: 'center', padding: '16px', margin: 0 }}>Sin resultados</p>
          )}
          {filteredAvailable.map(q => (
            <label
              key={q.id}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 12px', borderBottom: '1px solid #F0F0F0', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={false}
                onChange={() => onToggle(q)}
                style={{ marginTop: '2px', flexShrink: 0 }}
              />
              <p style={{ fontSize: '12px', color: '#333333', margin: 0 }}>{q.text}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Seleccionadas */}
      <div style={{ border: '1px solid #B6CEE7', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px', background: '#F6F9FA', borderBottom: '1px solid #B6CEE7' }}>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#666666', margin: 0 }}>
            Seleccionadas ({selected.length})
          </p>
        </div>
        <div style={{ maxHeight: '192px', overflowY: 'auto' }}>
          {selected.length === 0 && (
            <p style={{ fontSize: '12px', color: '#999999', textAlign: 'center', padding: '16px', margin: 0 }}>Ninguna seleccionada</p>
          )}
          {selected.map(q => (
            <div key={q.id} style={{ padding: '8px 12px', borderBottom: '1px solid #F0F0F0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                <p style={{ fontSize: '12px', color: '#333333', margin: 0, flex: 1 }}>{q.text}</p>
                <button
                  type="button"
                  onClick={() => onToggle(q)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                  aria-label="Eliminar pregunta"
                >
                  <TrashIcon color="#E24C4C" size={16} />
                </button>
              </div>
              <select
                value={q.scale || currentScale}
                onChange={e => onUpdateScale(q.id, e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #CCCCCC',
                  padding: '2px 4px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {scaleOptions.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CollapsibleTextFields ──────────────────────────────────────────────── */

function CollapsibleTextFields({ ev, updateCurrentEval }) {
  const [expanded, setExpanded] = useState(false);

  const fields = [
    { key: 'strengths', label: 'Fortalezas', desc: 'El evaluador registra las principales fortalezas.' },
    { key: 'improvements', label: 'Oportunidades de mejora', desc: 'Áreas de crecimiento.' },
    { key: 'achievements', label: 'Logros del período', desc: 'Logros más destacados.' },
    { key: 'trainingNeeds', label: 'Necesidades de capacitación', desc: 'Necesidades de desarrollo.' },
  ];

  return (
    <section style={{ ...sectionCard, padding: 0, gap: 0 }}>
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          borderRadius: '16px',
        }}
      >
        <div>
          <p style={{ ...sectionTitle, marginBottom: expanded ? 0 : '4px' }}>
            5. ¿Quieres incluir campos adicionales? (opcional)
          </p>
          {!expanded && (
            <p style={{ fontSize: '14px', color: '#5780AD', margin: 0, lineHeight: '20px' }}>
              Campos de texto libre para el evaluador.
            </p>
          )}
        </div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path
            d={expanded ? 'M10 19.5L16 13.5L22 19.5' : 'M10 13.5L16 19.5L22 13.5'}
            stroke="#5780AD"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid #E5E5E5' }}>
          <div style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {fields.map(f => (
              <Checkbox
                key={f.key}
                checked={ev.textFields[f.key]}
                onChange={checked =>
                  updateCurrentEval(prev => ({
                    ...prev,
                    textFields: { ...prev.textFields, [f.key]: checked },
                  }))
                }
                label={
                  <span>
                    <span style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      color: '#333333',
                      display: 'block',
                      lineHeight: '1.3',
                    }}>
                      {f.label}
                    </span>
                    <span style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#666666',
                      display: 'block',
                      lineHeight: '1.3',
                    }}>
                      {f.desc}
                    </span>
                  </span>
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
