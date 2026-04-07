import { useState } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import Toggle from '../../ui/Toggle';
import Tooltip from '../../ui/Tooltip';
import ScheduleModal, { ScheduleAllModal } from '../../modals/ScheduleModal';
import AddSectionModal from '../../modals/AddSectionModal';
import { DIRECTION_LABELS, DIRECTION_DESCRIPTIONS, SCALE_OPTIONS, MOCK_PERIODS, TEMPLATE_CONFIGS } from '../../../data/constants';

const DIRECTION_KEYS = ['descendente', 'autoEvaluacion', 'ascendente', 'pares', 'autodiseno', 'descendenteDiseno'];
const HAS_EVALUATORS = ['ascendente', 'pares'];

export default function Step2Structure() {
  const { currentEval, updateCurrentEval, saveCurrentEval, setActiveStep, addToast } = useEvaluation();
  const [errors, setErrors] = useState({});
  const [scheduleModal, setScheduleModal] = useState(null); // directionKey
  const [scheduleAllModal, setScheduleAllModal] = useState(
    () => new URLSearchParams(window.location.search).get('scheduleModal') === 'open'
  );
  const [addSectionModal, setAddSectionModal] = useState(false);
  const _expandAll = new URLSearchParams(window.location.search).get('expand') === 'all';
  const [expandedSections, setExpandedSections] = useState({ D: _expandAll, E: _expandAll, F: _expandAll });
  const [competenciesEnabled, setCompetenciesEnabled] = useState(() => currentEval?.weighting?.competencies > 0);
  const [objectivesEnabled, setObjectivesEnabled] = useState(() => currentEval?.weighting?.objectives > 0);
  const [disableCalibrationWarning, setDisableCalibrationWarning] = useState(null);
  const [disableFeedbackWarning, setDisableFeedbackWarning] = useState(null);

  if (!currentEval) return null;
  const ev = currentEval;

  const totalPercentage = DIRECTION_KEYS.reduce((s, k) => {
    return s + (ev.directions[k]?.active ? Number(ev.directions[k]?.percentage || 0) : 0);
  }, 0);

  const totalWeighting = ev.weighting.competencies + ev.weighting.objectives +
    (ev.weighting.additionalSections || []).reduce((s, sec) => s + (sec.percentage || 0), 0);

  const activeDirections = DIRECTION_KEYS.filter(k => ev.directions[k]?.active && ev.directions[k]?.percentage > 0);

  const updateDirection = (key, field, value) => {
    updateCurrentEval(prev => ({
      ...prev,
      directions: { ...prev.directions, [key]: { ...prev.directions[key], [field]: value } }
    }));
    setErrors(e => ({ ...e, directions: undefined }));
  };

  const toggleDirection = (key, active) => {
    updateCurrentEval(prev => ({
      ...prev,
      directions: { ...prev.directions, [key]: { ...prev.directions[key], active, percentage: active ? prev.directions[key].percentage : 0 } }
    }));
    setErrors(e => ({ ...e, directions: undefined }));
  };

  const updateWeighting = (field, value) => {
    updateCurrentEval(prev => ({ ...prev, weighting: { ...prev.weighting, [field]: Number(value) } }));
    setErrors(e => ({ ...e, weighting: undefined, period: undefined }));
    if (field === 'objectives' && Number(value) === 0) {
      updateCurrentEval(prev => ({ ...prev, objectivesPeriod: null }));
    }
  };

  const handleCalibrationToggle = (val) => {
    if (!val && ev.hasCalibration) {
      setDisableCalibrationWarning(true);
    } else {
      updateCurrentEval({ hasCalibration: val });
    }
  };

  const handleFeedbackToggle = (val) => {
    if (!val && ev.hasFeedback) {
      setDisableFeedbackWarning(true);
    } else {
      updateCurrentEval({ hasFeedback: val });
    }
  };

  const validate = () => {
    const errs = {};
    const activeCount = DIRECTION_KEYS.filter(k => ev.directions[k]?.active).length;
    if (activeCount === 0) errs.directions = 'Activa al menos un tipo de evaluación.';
    if (totalPercentage !== 100) errs.directions = `Los porcentajes deben sumar 100%. Actualmente: ${totalPercentage}%.`;
    if (totalWeighting !== 100) errs.weighting = `Las ponderaciones deben sumar 100%. Actualmente: ${totalWeighting}%.`;
    if (ev.weighting.objectives > 0 && !ev.objectivesPeriod) errs.period = 'Debes seleccionar un período de objetivos.';
    if (!ev.scale) errs.scale = 'Selecciona una escala de calificación.';
    return errs;
  };

  const handleSaveAndContinue = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    saveCurrentEval(2);
    setActiveStep(3);
  };

  const handleSaveDraft = () => {
    saveCurrentEval(2);
    addToast('Borrador guardado correctamente.');
  };

  const handleScheduleSave = (directionKey, schedule) => {
    updateDirection(directionKey, 'scheduled', schedule);
    addToast('Programación de apertura guardada.');
  };

  const addSection = (section) => {
    updateCurrentEval(prev => ({
      ...prev,
      weighting: { ...prev.weighting, additionalSections: [...(prev.weighting.additionalSections || []), section] }
    }));
    addToast(`Sección '${section.name}' agregada.`);
  };

  const removeSection = (id) => {
    updateCurrentEval(prev => ({
      ...prev,
      weighting: { ...prev.weighting, additionalSections: prev.weighting.additionalSections.filter(s => s.id !== id) }
    }));
  };

  const templateInfo = ev.template && TEMPLATE_CONFIGS[ev.template];

  return (
    <div className="space-y-6">
      {/* Template banner */}
      {templateInfo && ev.template !== 'custom' && (
        <div className="border border-gray-300 bg-gray-50 px-4 py-3 flex items-center justify-between text-sm">
          <span className="text-gray-700">
            Configuración aplicada desde <strong>"{templateInfo.label}{templateInfo.subtitle ? ` — ${templateInfo.subtitle}` : ''}"</strong>. Puedes ajustar cualquier valor.
          </span>
        </div>
      )}

      {/* Warnings */}
      {disableCalibrationWarning && (
        <ConfirmDisableModal
          title="Desactivar calibración"
          message="Desactivar esta etapa eliminará la configuración guardada. ¿Continuar?"
          onConfirm={() => { updateCurrentEval({ hasCalibration: false }); setDisableCalibrationWarning(false); }}
          onCancel={() => setDisableCalibrationWarning(false)}
        />
      )}
      {disableFeedbackWarning && (
        <ConfirmDisableModal
          title="Desactivar retroalimentación"
          message="Desactivar esta etapa eliminará la configuración guardada. ¿Continuar?"
          onConfirm={() => { updateCurrentEval({ hasFeedback: false }); setDisableFeedbackWarning(false); }}
          onCancel={() => setDisableFeedbackWarning(false)}
        />
      )}

      {/* Section A: Who evaluates */}
      <section className="border border-gray-300 p-5">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">A. ¿Quién evalúa a quién?</h3>
            <Tooltip text="Cada tipo define quién evalúa a quién. Puedes combinar varios y asignarles un peso en el resultado final." />
          </div>
          {activeDirections.length > 0 && (
            <button
              onClick={() => setScheduleAllModal(true)}
              className="text-xs border border-gray-400 px-3 py-1 text-gray-700 hover:bg-gray-50"
            >
              ⏱ Programar publicación
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Activa los tipos de evaluación e indícales un peso. Los porcentajes deben sumar exactamente 100%.
        </p>

        {/* Total indicator */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-sm mb-4 ${
          totalPercentage === 100 ? 'border-gray-900 bg-gray-50 text-gray-900' : 'border-red-400 bg-red-50 text-red-700'
        }`}>
          {totalPercentage === 100 ? '✅' : '⚠️'}
          <span>Total: <strong>{totalPercentage}%</strong></span>
          {totalPercentage !== 100 && <span>— deben sumar 100%</span>}
        </div>

        <div className="space-y-3">
          {DIRECTION_KEYS.map(key => {
            const dir = ev.directions[key];
            return (
              <div key={key} className={`border p-4 ${dir.active ? 'border-gray-900' : 'border-gray-300'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <Toggle checked={dir.active} onChange={val => toggleDirection(key, val)} />
                    <span className="text-sm font-medium text-gray-900">{DIRECTION_LABELS[key]}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-13 pl-11 mb-3">{DIRECTION_DESCRIPTIONS[key]}</p>

                {dir.active && (
                  <div className="ml-11 space-y-3">
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600">Porcentaje (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={dir.percentage}
                          onChange={e => updateDirection(key, 'percentage', Number(e.target.value))}
                          className="w-20 border border-gray-300 px-2 py-1 text-sm focus:outline-none"
                        />
                        <span className="text-xs text-gray-500">%</span>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <Toggle
                          checked={dir.isPrivate}
                          onChange={val => updateDirection(key, 'isPrivate', val)}
                        />
                        <span className="text-xs text-gray-700">Privada</span>
                        <Tooltip text="El colaborador no verá los resultados de este tipo de evaluación en su reporte." />
                      </label>

                      <button
                        onClick={() => setScheduleModal(key)}
                        className="text-xs text-gray-600 border-b border-gray-400 hover:text-gray-900"
                      >
                        ⏱ Programar apertura
                      </button>

                      {dir.scheduled && (
                        <span className="text-xs border border-gray-300 px-2 py-0.5 text-gray-600">
                          ⏱ Programada: {dir.scheduled.date} {dir.scheduled.time}
                        </span>
                      )}
                    </div>

                    {HAS_EVALUATORS.includes(key) && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">Mín. evaluadores</label>
                          <input
                            type="number"
                            min="1"
                            value={dir.minEval}
                            onChange={e => updateDirection(key, 'minEval', e.target.value)}
                            placeholder="—"
                            className="w-16 border border-gray-300 px-2 py-1 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">Máx. evaluadores</label>
                          <input
                            type="number"
                            min="1"
                            value={dir.maxEval}
                            onChange={e => updateDirection(key, 'maxEval', e.target.value)}
                            placeholder="—"
                            className="w-16 border border-gray-300 px-2 py-1 text-sm focus:outline-none"
                          />
                        </div>
                        {dir.minEval && dir.maxEval && Number(dir.maxEval) < Number(dir.minEval) && (
                          <p className="text-xs text-red-600">El máximo debe ser mayor o igual al mínimo.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {errors.directions && (
          <p className="text-xs text-red-600 mt-3 border border-red-200 bg-red-50 px-3 py-2">{errors.directions}</p>
        )}
      </section>

      {/* Section B: Result calculation */}
      <section className="border border-gray-300 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">B. ¿Cómo se calcula el resultado?</h3>

        <div className="space-y-5">
          {/* Scale */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-900">
                Escala de calificación final <span className="text-red-500">*</span>
              </label>
              <Tooltip text="Define cómo se expresará el resultado en los reportes." />
            </div>
            <select
              value={ev.scale}
              onChange={e => { updateCurrentEval({ scale: e.target.value }); setErrors(er => ({ ...er, scale: undefined })); }}
              className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.scale ? 'border-red-400' : 'border-gray-300'}`}
            >
              <option value="">Selecciona una escala...</option>
              {SCALE_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label} — {s.description}</option>
              ))}
            </select>
            {errors.scale && <p className="text-xs text-red-600 mt-1">{errors.scale}</p>}
          </div>

          {/* Weighting — switch cards */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Peso de cada dimensión en el resultado</p>
            <p className="text-xs text-gray-500 mb-3">Activa las dimensiones que incluirá el proceso. Los porcentajes deben sumar 100%.</p>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-sm mb-4 ${
              totalWeighting === 100 ? 'border-gray-900 bg-gray-50' : 'border-red-400 bg-red-50 text-red-700'
            }`}>
              {totalWeighting === 100 ? '✅ Total: 100%' : `⚠️ Deben sumar 100%. Actualmente: ${totalWeighting}%.`}
            </div>

            <div className="space-y-3">

              {/* Competencias card */}
              <div className={`border p-4 ${competenciesEnabled ? 'border-gray-900' : 'border-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={competenciesEnabled}
                    onChange={val => {
                      setCompetenciesEnabled(val);
                      if (!val) updateWeighting('competencies', 0);
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Competencias</p>
                    <p className="text-xs text-gray-500">Evalúa competencias conductuales y funcionales.</p>
                  </div>
                </div>

                {competenciesEnabled && (
                  <div className="mt-4 ml-11 space-y-5 border-t border-gray-100 pt-4">
                    {/* % input */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600">Porcentaje (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ev.weighting.competencies}
                        onChange={e => updateWeighting('competencies', e.target.value)}
                        className="w-20 border border-gray-300 px-2 py-1 text-sm focus:outline-none"
                      />
                      <span className="text-xs text-gray-500">%</span>
                    </div>

                    {/* Origen competencias */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-medium text-gray-900">
                          Origen competencias funcionales <span className="text-red-500">*</span>
                        </label>
                        <Tooltip text="Cómo el sistema obtiene las competencias de cada colaborador." />
                      </div>
                      <div className="space-y-2">
                        {[
                          { value: 'cargo',   label: 'Según el cargo que ocupa',              desc: 'Competencias del cargo asignado en el sistema.', badge: 'Recomendado' },
                          { value: 'familia', label: 'Según la familia de cargos',             desc: 'Competencias de la familia del cargo.' },
                          { value: 'manual',  label: 'Asignación manual (Perfil personalizado)', desc: 'Se asignan individualmente a cada colaborador.' },
                        ].map(opt => (
                          <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="competencyOrigin"
                              value={opt.value}
                              checked={ev.competencyOrigin === opt.value}
                              onChange={() => updateCurrentEval({ competencyOrigin: opt.value })}
                              className="mt-0.5"
                            />
                            <div>
                              <span className="text-sm text-gray-900">{opt.label}</span>
                              {opt.badge && <span className="ml-2 text-xs border border-gray-400 px-1.5 py-0.5 text-gray-600">{opt.badge}</span>}
                              <p className="text-xs text-gray-500">{opt.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Objetivos card */}
              <div className={`border p-4 ${objectivesEnabled ? 'border-gray-900' : 'border-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={objectivesEnabled}
                    onChange={val => {
                      setObjectivesEnabled(val);
                      if (!val) { updateWeighting('objectives', 0); updateCurrentEval({ objectivesPeriod: null }); }
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Objetivos</p>
                    <p className="text-xs text-gray-500">Evalúa el cumplimiento de metas individuales.</p>
                  </div>
                </div>

                {objectivesEnabled && (
                  <div className="mt-4 ml-11 space-y-5 border-t border-gray-100 pt-4">
                    {/* % input */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600">Porcentaje (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ev.weighting.objectives}
                        onChange={e => updateWeighting('objectives', e.target.value)}
                        className="w-20 border border-gray-300 px-2 py-1 text-sm focus:outline-none"
                      />
                      <span className="text-xs text-gray-500">%</span>
                    </div>

                    {/* Período */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <label className="text-sm font-medium text-gray-900">
                          Período de objetivos <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">¿Qué período de objetivos se evaluará? Debe existir previamente en el sistema.</p>
                      {ev.objectivesPeriod ? (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">{ev.objectivesPeriod.name}</span>
                          <button
                            onClick={() => updateCurrentEval({ objectivesPeriod: null })}
                            className="text-xs text-gray-500 border-b border-gray-400"
                          >
                            Cambiar
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {MOCK_PERIODS.map(p => (
                            <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="period"
                                value={p.id}
                                checked={ev.objectivesPeriod?.id === p.id}
                                onChange={() => { updateCurrentEval({ objectivesPeriod: p }); setErrors(er => ({ ...er, period: undefined })); }}
                              />
                              <span className="text-sm text-gray-700">{p.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {errors.period && <p className="text-xs text-red-600 mt-1">{errors.period}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional sections */}
              {(ev.weighting.additionalSections || []).map(sec => (
                <div key={sec.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-40 truncate">{sec.name}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={sec.percentage}
                    onChange={e => updateCurrentEval(prev => ({
                      ...prev,
                      weighting: {
                        ...prev.weighting,
                        additionalSections: prev.weighting.additionalSections.map(s =>
                          s.id === sec.id ? { ...s, percentage: Number(e.target.value) } : s
                        )
                      }
                    }))}
                    className="w-20 border border-gray-300 px-2 py-1 text-sm"
                  />
                  <span className="text-xs text-gray-500">%</span>
                  <button onClick={() => removeSection(sec.id)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
                </div>
              ))}

              <button
                onClick={() => setAddSectionModal(true)}
                className="text-xs text-gray-600 border-b border-gray-400 hover:text-gray-900"
              >
                + Añadir sección
              </button>
            </div>

            {errors.weighting && <p className="text-xs text-red-600 mt-2">{errors.weighting}</p>}
          </div>
        </div>
      </section>

      {/* Section C: Form type */}
      <section className="border border-gray-300 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">C. Tipo de formulario</h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="formType"
              value="single"
              checked={ev.formType === 'single'}
              onChange={() => updateCurrentEval({ formType: 'single', multipleFormCriteria: null })}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Formulario único <span className="text-xs text-gray-500 font-normal ml-1">— Recomendado</span></p>
              <p className="text-xs text-gray-500">Todos responden el mismo instrumento.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="formType"
              value="multiple"
              checked={ev.formType === 'multiple'}
              onChange={() => updateCurrentEval({ formType: 'multiple' })}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Formulario múltiple</p>
              <p className="text-xs text-gray-500">Cada tipo de evaluador puede tener un formulario distinto.</p>
            </div>
          </label>

          {ev.formType === 'multiple' && (
            <div className="ml-6 border border-gray-200 p-4 space-y-3">
              <p className="text-xs font-medium text-gray-700">¿Cómo se diferencian los formularios?</p>
              {[
                { value: 'unique',   label: 'Formulario único',          desc: 'Un formulario diferente por cada tipo de evaluador.' },
                { value: 'cargo',    label: 'Por cargo',                 desc: 'El formulario varía según el cargo del colaborador evaluado.' },
                { value: 'familia',  label: 'Por familia de cargos',     desc: 'El formulario varía según la familia de cargos del colaborador.' },
                { value: 'perfil',   label: 'Por perfil personalizado',  desc: 'El formulario se asigna individualmente a cada colaborador.' },
              ].map(opt => (
                <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="multipleFormCriteria"
                    value={opt.value}
                    checked={ev.multipleFormCriteria === opt.value}
                    onChange={() => updateCurrentEval({ multipleFormCriteria: opt.value })}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section D: Additional stages (collapsible) */}
      <CollapsibleSection
        label="D. Etapas adicionales después de la evaluación (opcional)"
        description="Agrega etapas de revisión o feedback."
        isExpanded={expandedSections.D}
        onToggle={() => setExpandedSections(s => ({ ...s, D: !s.D }))}
      >
        <div className="space-y-4">
          <ToggleRow
            label="Calibración"
            description="Revisión y ajuste colectivo de resultados antes de publicarlos."
            tooltip="Etapa post-evaluación. Al activar, aparece el tab Calibración en este wizard para configurar el tipo y participantes."
            checked={ev.hasCalibration}
            onChange={handleCalibrationToggle}
          />
          <ToggleRow
            label="Retroalimentación"
            description="El evaluador entrega feedback formal al colaborador una vez cerrados los resultados."
            tooltip="Última etapa del proceso. Al activar, aparece el tab Retroalimentación en este wizard."
            checked={ev.hasFeedback}
            onChange={handleFeedbackToggle}
          />
        </div>
      </CollapsibleSection>

      {/* Section E: Potential (collapsible) */}
      <CollapsibleSection
        label="E. Evaluación de potencial (opcional)"
        isExpanded={expandedSections.E}
        onToggle={() => setExpandedSections(s => ({ ...s, E: !s.E }))}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ev.hasPotential}
            onChange={e => updateCurrentEval({ hasPotential: e.target.checked })}
            className="mt-0.5"
          />
          <div>
            <p className="text-sm text-gray-900">Incluir evaluación de potencial</p>
            <p className="text-xs text-gray-500">Evalúa el potencial de desarrollo, separado del desempeño.</p>
          </div>
        </label>
      </CollapsibleSection>

      {/* Section F: Advanced options (collapsible) */}
      <CollapsibleSection
        label="F. Opciones avanzadas (opcional)"
        description="La configuración predeterminada funciona bien para la mayoría de los procesos."
        isExpanded={expandedSections.F}
        onToggle={() => setExpandedSections(s => ({ ...s, F: !s.F }))}
      >
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Visibilidad de resultados</p>
            {[
              { key: 'participantCanSeePartialResults', label: 'El colaborador puede ver resultados parciales durante el proceso.' },
              { key: 'evaluatorSeesAccumulatedScore', label: 'El evaluador ve el puntaje acumulado mientras responde.' },
            ].map(opt => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={ev.advancedOptions[opt.key]}
                  onChange={e => updateCurrentEval(prev => ({
                    ...prev,
                    advancedOptions: { ...prev.advancedOptions, [opt.key]: e.target.checked }
                  }))}
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Configuración reporte PDF</p>
            {[
              { key: 'hideQualitativeFromPDF', label: 'No mostrar respuestas cualitativas del evaluador al colaborador en el PDF.' },
              { key: 'showOnlyAggregateResult', label: 'Mostrar solo resultado agregado, sin desglose de indicadores.' },
              ...(ev.hasPotential ? [{ key: 'hidePotentialFromPDF', label: 'No incluir la sección de potencial en el PDF.' }] : []),
            ].map(opt => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={ev.advancedOptions[opt.key]}
                  onChange={e => updateCurrentEval(prev => ({
                    ...prev,
                    advancedOptions: { ...prev.advancedOptions, [opt.key]: e.target.checked }
                  }))}
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button onClick={handleSaveDraft} className="px-4 py-2 text-sm border border-gray-400 text-gray-700 hover:bg-gray-50">
          Guardar borrador
        </button>
        <button onClick={handleSaveAndContinue} className="px-5 py-2 text-sm font-medium bg-gray-900 text-white border border-gray-900 hover:bg-gray-700">
          Guardar y continuar →
        </button>
      </div>

      {/* Modals */}
      {scheduleModal && (
        <ScheduleModal
          isOpen={!!scheduleModal}
          onClose={() => setScheduleModal(null)}
          directionKey={scheduleModal}
          currentSchedule={ev.directions[scheduleModal]?.scheduled}
          onSave={s => handleScheduleSave(scheduleModal, s)}
        />
      )}
      {scheduleAllModal && (
        <ScheduleAllModal
          isOpen={scheduleAllModal}
          onClose={() => setScheduleAllModal(false)}
          activeDirections={activeDirections}
          currentSchedules={Object.fromEntries(DIRECTION_KEYS.map(k => [k, ev.directions[k]?.scheduled]))}
          onSave={(schedules) => {
            Object.entries(schedules).forEach(([k, s]) => {
              updateDirection(k, 'scheduled', s.type === 'specific' ? { date: s.date, time: s.time } : null);
            });
            addToast('Programación de apertura guardada.');
          }}
        />
      )}
      <AddSectionModal
        isOpen={addSectionModal}
        onClose={() => setAddSectionModal(false)}
        currentWeighting={ev.weighting}
        onAdd={addSection}
      />
    </div>
  );
}

function WeightingRow({ label, tooltip, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-36">
        <span className="text-sm text-gray-900">{label}</span>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <input
        type="number"
        min="0"
        max="100"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-20 border border-gray-300 px-2 py-1 text-sm focus:outline-none"
      />
      <span className="text-xs text-gray-500">%</span>
    </div>
  );
}

function ToggleRow({ label, description, tooltip, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function CollapsibleSection({ label, description, isExpanded, onToggle, children }) {
  return (
    <section className="border border-gray-300">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
      >
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {description && !isExpanded && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-gray-500 text-sm">{isExpanded ? '▲' : '▼'}</span>
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-200">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </section>
  );
}

function ConfirmDisableModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white border border-gray-400 p-6 max-w-sm w-full mx-4">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm border border-gray-900 bg-gray-900 text-white">Continuar</button>
        </div>
      </div>
    </div>
  );
}
