import { useState } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import Tooltip from '../../ui/Tooltip';
import {
  MOCK_FUNCTIONAL_COMPETENCIES,
  MOCK_TRANSVERSAL_COMPETENCIES,
  MOCK_POTENTIAL_QUESTIONS,
  SCALE_OPTIONS,
  DIRECTION_LABELS,
} from '../../../data/constants';

const DIRECTION_KEYS = ['descendente', 'autoEvaluacion', 'ascendente', 'pares', 'autodiseno', 'descendenteDiseno'];

export default function Step3Form() {
  const { currentEval, updateCurrentEval, saveCurrentEval, setActiveStep, addToast } = useEvaluation();
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState(null);

  if (!currentEval) return null;
  const ev = currentEval;

  const isMultiple = ev.formType === 'multiple';
  const activeDirectionKeys = DIRECTION_KEYS.filter(k => ev.directions[k]?.active);

  // Init active form tab if needed
  const currentFormTab = isMultiple ? (activeFormTab || activeDirectionKeys[0]) : null;

  const validate = () => {
    const errs = {};
    if (!ev.formName.trim()) errs.formName = 'El formulario necesita un nombre.';
    if (ev.weighting.competencies > 0) {
      const totalComp = ev.selectedTransversalCompetencies?.length || 0;
      if (totalComp === 0 && ev.transversalPercentage > 0) errs.competencies = 'Selecciona al menos una competencia transversal.';
      const pct = (ev.functionalPercentage || 0) + (ev.transversalPercentage || 0);
      if (pct !== 100) errs.compPercentage = `Las competencias deben sumar 100%. Actualmente: ${pct}%.`;
    }
    return errs;
  };

  const handleSaveAndContinue = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    saveCurrentEval(3);
    // Navigate through pending conditional steps before reaching the Summary
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

  const toggleFunctionalComp = (comp) => {
    updateCurrentEval(prev => {
      const exists = prev.selectedFunctionalCompetencies.find(c => c.id === comp.id);
      return {
        ...prev,
        selectedFunctionalCompetencies: exists
          ? prev.selectedFunctionalCompetencies.filter(c => c.id !== comp.id)
          : [...prev.selectedFunctionalCompetencies, { ...comp, percentage: 0, scale: prev.scale }]
      };
    });
    setErrors(e => ({ ...e, competencies: undefined }));
  };

  const toggleTransversalComp = (comp) => {
    updateCurrentEval(prev => {
      const exists = prev.selectedTransversalCompetencies.find(c => c.id === comp.id);
      return {
        ...prev,
        selectedTransversalCompetencies: exists
          ? prev.selectedTransversalCompetencies.filter(c => c.id !== comp.id)
          : [...prev.selectedTransversalCompetencies, { ...comp, percentage: 0, scale: prev.scale }]
      };
    });
    setErrors(e => ({ ...e, competencies: undefined }));
  };

  const togglePotentialQuestion = (q) => {
    updateCurrentEval(prev => {
      const exists = prev.potentialQuestions.find(pq => pq.id === q.id);
      return {
        ...prev,
        potentialQuestions: exists
          ? prev.potentialQuestions.filter(pq => pq.id !== q.id)
          : [...prev.potentialQuestions, { ...q, scale: prev.scale }]
      };
    });
  };

  const updateCompScale = (type, compId, scale) => {
    const field = type === 'functional' ? 'selectedFunctionalCompetencies' : 'selectedTransversalCompetencies';
    updateCurrentEval(prev => ({
      ...prev,
      [field]: prev[field].map(c => c.id === compId ? { ...c, scale } : c)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Multiple form tabs */}
      {isMultiple && activeDirectionKeys.length > 0 && (
        <div className="border border-gray-300 p-3 bg-gray-50">
          <p className="text-xs text-gray-600 mb-2 font-medium">Formulario múltiple — Configurando para:</p>
          <div className="flex gap-2 flex-wrap">
            {activeDirectionKeys.map(k => (
              <button
                key={k}
                onClick={() => setActiveFormTab(k)}
                className={`px-3 py-1.5 text-xs border ${
                  currentFormTab === k ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:bg-white'
                }`}
              >
                {DIRECTION_LABELS[k]}
              </button>
            ))}
          </div>
          {currentFormTab && (
            <p className="text-xs text-gray-500 mt-2">Configurando formulario para: <strong>{DIRECTION_LABELS[currentFormTab]}</strong></p>
          )}
        </div>
      )}

      {/* Section 1: Form info */}
      <section className="border border-gray-300 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">1. Información del formulario</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Nombre del formulario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ev.formName}
              onChange={e => { updateCurrentEval({ formName: e.target.value }); setErrors(er => ({ ...er, formName: undefined })); }}
              className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.formName ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.formName && <p className="text-xs text-red-600 mt-1">{errors.formName}</p>}
            <p className="text-xs text-gray-400 mt-1">Identifica el instrumento internamente.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Descripción del formulario
              <span className="text-gray-400 font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              value={ev.formDescription}
              onChange={e => updateCurrentEval({ formDescription: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none resize-none"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Competencies (conditional) */}
      {ev.weighting.competencies > 0 && (
        <section className="border border-gray-300 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">2. Competencias a evaluar</h3>

          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-gray-700">Justificación por competencia:</label>
            <select
              value={ev.competencyJustification}
              onChange={e => updateCurrentEval({ competencyJustification: e.target.value })}
              className="border border-gray-300 px-3 py-1.5 text-sm focus:outline-none"
            >
              <option value="none">No requerida</option>
              <option value="always">Requerida siempre</option>
              <option value="low">Solo si calificación es baja</option>
            </select>
          </div>

          {/* Distribution */}
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-900 mb-3">Distribución por tipo</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">
                  Funcionales
                  <Tooltip text="Competencias específicas del cargo o rol." />
                </label>
                <input
                  type="number" min="0" max="100"
                  value={ev.functionalPercentage}
                  onChange={e => {
                    updateCurrentEval({ functionalPercentage: Number(e.target.value) });
                    setErrors(er => ({ ...er, compPercentage: undefined }));
                  }}
                  className="w-20 border border-gray-300 px-2 py-1 text-sm"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">
                  Transversales
                  <Tooltip text="Competencias generales para todos los colaboradores." />
                </label>
                <input
                  type="number" min="0" max="100"
                  value={ev.transversalPercentage}
                  onChange={e => {
                    updateCurrentEval({ transversalPercentage: Number(e.target.value) });
                    setErrors(er => ({ ...er, compPercentage: undefined }));
                  }}
                  className="w-20 border border-gray-300 px-2 py-1 text-sm"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
              <span className={`text-xs ${(ev.functionalPercentage + ev.transversalPercentage) === 100 ? 'text-gray-700' : 'text-red-600'}`}>
                Total: {ev.functionalPercentage + ev.transversalPercentage}%
                {(ev.functionalPercentage + ev.transversalPercentage) === 100 ? ' ✅' : ''}
              </span>
            </div>
            {errors.compPercentage && <p className="text-xs text-red-600 mt-1">{errors.compPercentage}</p>}
          </div>

          {/* Transversal competencies dual panel */}
          <CompetencyPanel
            title="Competencias Transversales"
            available={MOCK_TRANSVERSAL_COMPETENCIES}
            selected={ev.selectedTransversalCompetencies}
            onToggle={toggleTransversalComp}
            onUpdateScale={(id, scale) => updateCompScale('transversal', id, scale)}
            scaleOptions={SCALE_OPTIONS}
            currentScale={ev.scale}
          />

          {errors.competencies && (
            <p className="text-xs text-red-600 border border-red-200 bg-red-50 px-3 py-2 mt-3">{errors.competencies}</p>
          )}
        </section>
      )}

      {/* Section 3: Objectives (conditional) */}
      {ev.weighting.objectives > 0 && (
        <section className="border border-gray-300 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            3. Objetivos del período {ev.objectivesPeriod ? `— ${ev.objectivesPeriod.name}` : ''}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700">Justificación por objetivos:</label>
              <select
                value={ev.objectiveJustification}
                onChange={e => updateCurrentEval({ objectiveJustification: e.target.value })}
                className="border border-gray-300 px-3 py-1.5 text-sm"
              >
                <option value="none">No requerida</option>
                <option value="always">Requerida siempre</option>
                <option value="low">Solo si calificación es baja</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700">Peso objetivos individuales</label>
              <input
                type="number" min="0" max="100"
                value={ev.individualObjectivesWeight}
                onChange={e => updateCurrentEval({ individualObjectivesWeight: Number(e.target.value) })}
                className="w-20 border border-gray-300 px-2 py-1 text-sm"
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-400">Si solo tienes objetivos individuales, deja en 100%.</p>
          </div>
        </section>
      )}

      {/* Section 4: Potential (conditional) */}
      {ev.hasPotential && (
        <section className="border border-gray-300 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">4. Evaluación de potencial</h3>
          <p className="text-xs text-gray-500 mb-4">Selecciona las preguntas de potencial a incluir en el formulario.</p>
          <CompetencyPanel
            title="Preguntas de potencial"
            available={MOCK_POTENTIAL_QUESTIONS}
            selected={ev.potentialQuestions}
            onToggle={togglePotentialQuestion}
            onUpdateScale={(id, scale) => updateCurrentEval(prev => ({
              ...prev,
              potentialQuestions: prev.potentialQuestions.map(q => q.id === id ? { ...q, scale } : q)
            }))}
            scaleOptions={SCALE_OPTIONS}
            currentScale={ev.scale}
            nameKey="text"
            descKey={null}
          />
        </section>
      )}

      {/* Section 5: Additional text fields (collapsible) */}
      <CollapsibleTextFields ev={ev} updateCurrentEval={updateCurrentEval} />

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={handleSaveDraft} className="px-4 py-2 text-sm border border-gray-400 text-gray-700 hover:bg-gray-50">
            Guardar borrador
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 text-sm border border-gray-400 text-gray-700 hover:bg-gray-50"
          >
            Vista previa del formulario
          </button>
        </div>
        <button onClick={handleSaveAndContinue} className="px-5 py-2 text-sm font-medium bg-gray-900 text-white border border-gray-900 hover:bg-gray-700">
          Guardar y continuar →
        </button>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white border border-gray-400 max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
              <h3 className="font-semibold text-gray-900">Vista previa: {ev.formName || 'Formulario'}</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-900 text-xl">×</button>
            </div>
            <div className="px-6 py-5 space-y-5">
              {ev.weighting.competencies > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Competencias ({ev.weighting.competencies}%)</p>
                  {[...ev.selectedFunctionalCompetencies, ...ev.selectedTransversalCompetencies].map(c => (
                    <div key={c.id} className="border border-gray-200 p-3 mb-2">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.description}</p>
                      <div className="mt-2 flex gap-1">
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="w-8 h-8 border border-gray-300 flex items-center justify-center text-xs text-gray-500">{n}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {ev.weighting.objectives > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Objetivos ({ev.weighting.objectives}%)</p>
                  <div className="border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">Los objetivos del período "{ev.objectivesPeriod?.name}" serán listados aquí.</p>
                  </div>
                </div>
              )}
              {ev.hasPotential && ev.potentialQuestions.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Potencial</p>
                  {ev.potentialQuestions.map(q => (
                    <div key={q.id} className="border border-gray-200 p-3 mb-2">
                      <p className="text-sm text-gray-800">{q.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {ev.textFields.strengths && (
                <div className="border border-gray-200 p-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Fortalezas</p>
                  <div className="h-16 border border-gray-200 bg-gray-50 text-xs text-gray-400 flex items-center justify-center">Campo de texto libre</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompetencyPanel({ title, available, selected, onToggle, onUpdateScale, scaleOptions, currentScale, nameKey = 'name', descKey = 'description' }) {
  const [search, setSearch] = useState('');
  const filteredAvailable = available.filter(c =>
    !selected.find(s => s.id === c.id) &&
    (!search || (c[nameKey] || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mb-5">
      <p className="text-sm font-medium text-gray-800 mb-3">{title}</p>
      <div className="grid grid-cols-2 gap-4">
        {/* Available */}
        <div className="border border-gray-300">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-300">
            <p className="text-xs font-medium text-gray-700 mb-1">Disponibles ({filteredAvailable.length})</p>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full border border-gray-300 px-2 py-1 text-xs"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredAvailable.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">Sin resultados</p>
            )}
            {filteredAvailable.map(c => (
              <div key={c.id} className="flex items-start gap-2 px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={false}
                  onChange={() => onToggle(c)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{c[nameKey]}</p>
                  {descKey && c[descKey] && <p className="text-xs text-gray-500 truncate">{c[descKey]}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected */}
        <div className="border border-gray-300">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-300">
            <p className="text-xs font-medium text-gray-700">Seleccionadas ({selected.length})</p>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {selected.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">Ninguna seleccionada</p>
            )}
            {selected.map(c => (
              <div key={c.id} className="px-3 py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-gray-900 truncate flex-1">{c[nameKey]}</p>
                  <button onClick={() => onToggle(c)} className="text-gray-400 hover:text-red-500 text-xs ml-2">✕</button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min="0" max="100"
                    value={c.percentage || 0}
                    onChange={e => onUpdateScale(c.id, e.target.value)}
                    placeholder="%"
                    className="w-14 border border-gray-300 px-1 py-0.5 text-xs"
                    title="Porcentaje de esta competencia"
                  />
                  <span className="text-xs text-gray-400">%</span>
                  <select
                    value={c.scale || currentScale}
                    onChange={e => onUpdateScale(c.id, e.target.value)}
                    className="flex-1 border border-gray-300 px-1 py-0.5 text-xs"
                    title="Escala"
                  >
                    {scaleOptions.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsibleTextFields({ ev, updateCurrentEval }) {
  const [expanded, setExpanded] = useState(
    () => new URLSearchParams(window.location.search).get('fields') === 'open'
  );
  const fields = [
    { key: 'strengths', label: 'Fortalezas', desc: 'El evaluador registra las principales fortalezas.' },
    { key: 'improvements', label: 'Oportunidades de mejora', desc: 'Áreas de crecimiento.' },
    { key: 'achievements', label: 'Logros del período', desc: 'Logros más destacados.' },
    { key: 'trainingNeeds', label: 'Necesidades de capacitación', desc: 'Necesidades de desarrollo.' },
  ];

  return (
    <section className="border border-gray-300">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
      >
        <div>
          <p className="text-sm font-semibold text-gray-900">5. ¿Quieres incluir campos adicionales? (opcional)</p>
          {!expanded && <p className="text-xs text-gray-500 mt-0.5">Campos de texto libre para el evaluador.</p>}
        </div>
        <span className="text-gray-500 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-200">
          <div className="pt-4 space-y-3">
            {fields.map(f => (
              <label key={f.key} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ev.textFields[f.key]}
                  onChange={e => updateCurrentEval(prev => ({
                    ...prev,
                    textFields: { ...prev.textFields, [f.key]: e.target.checked }
                  }))}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
