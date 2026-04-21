import { useState } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import { Section } from '../../Section';
import { Chip } from '../../Chip';
import { Selector } from '../../Selector';
import { Totalizador } from '../../Totalizador';
import { Button } from '../../Button';
import { Radiobutton } from '../../Radiobutton';
import { Checkbox } from '../../Checkbox';
import { Switch } from '../../Switch';
import Modal from '../../ui/Modal';
import ScheduleModal, { ScheduleAllModal } from '../../modals/ScheduleModal';
import AddSectionModal from '../../modals/AddSectionModal';
import { EyeIcon } from '../../../assets/icons/EyeIcon';
import { TrashIcon } from '../../../assets/icons/TrashIcon';
import { ArrowRightIcon } from '../../../assets/icons/ArrowRightIcon';
import {
  DIRECTION_LABELS,
  DIRECTION_DESCRIPTIONS,
  SCALE_OPTIONS,
  MOCK_PERIODS,
  TEMPLATE_CONFIGS,
} from '../../../data/constants';

/* ─── Constantes ─────────────────────────────────────────────────────────── */

// Direcciones oficiales del proceso (siempre visibles)
const OFFICIAL_DIRECTIONS = ['descendente', 'autoEvaluacion', 'ascendente', 'pares'];
// Direcciones creadas por diseño (ocultas por defecto, mostrar via Chip)
const CUSTOM_DIRECTIONS = ['autodiseno', 'descendenteDiseno'];
const DIRECTION_KEYS = [...OFFICIAL_DIRECTIONS, ...CUSTOM_DIRECTIONS];
// Direcciones que permiten configurar cantidad de evaluadores
const HAS_EVALUATORS = ['ascendente', 'pares'];

// Niveles de escala para modal de vista previa
const SCALE_LEVELS = {
  'likert1-5': [
    { value: 1, label: 'Muy por debajo de lo esperado' },
    { value: 2, label: 'Por debajo de lo esperado' },
    { value: 3, label: 'Según lo esperado' },
    { value: 4, label: 'Por encima de lo esperado' },
    { value: 5, label: 'Muy por encima de lo esperado' },
  ],
  'excellence': [
    { value: 1, label: 'Insatisfactorio' },
    { value: 2, label: 'En desarrollo' },
    { value: 3, label: 'Satisfactorio' },
    { value: 4, label: 'Destacado' },
    { value: 5, label: 'Sobresaliente' },
  ],
  '1-6': [1, 2, 3, 4, 5, 6].map(v => ({ value: v, label: String(v) })),
  '1-10': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => ({ value: v, label: String(v) })),
};

/* ─── Componente principal ───────────────────────────────────────────────── */

export default function Step2Structure() {
  const { currentEval, updateCurrentEval, saveCurrentEval, setActiveStep, addToast } = useEvaluation();

  const [errors, setErrors] = useState({});
  const [scheduleModal, setScheduleModal] = useState(null);
  const [scheduleAllModal, setScheduleAllModal] = useState(
    () => new URLSearchParams(window.location.search).get('scheduleModal') === 'open',
  );
  const [addSectionModal, setAddSectionModal] = useState(false);
  const _expandAll = new URLSearchParams(window.location.search).get('expand') === 'all';
  const [expandedSections, setExpandedSections] = useState({ D: true, E: _expandAll, F: _expandAll });
  const [competenciesEnabled, setCompetenciesEnabled] = useState(
    () => (currentEval?.weighting?.competencies ?? 0) > 0,
  );
  const [objectivesEnabled, setObjectivesEnabled] = useState(
    () => (currentEval?.weighting?.objectives ?? 0) > 0,
  );
  const [disableCalibrationWarning, setDisableCalibrationWarning] = useState(false);
  const [disableFeedbackWarning, setDisableFeedbackWarning] = useState(false);
  const [showCustomDirections, setShowCustomDirections] = useState(false);
  const [scalePreviewOpen, setScalePreviewOpen] = useState(false);

  if (!currentEval) return null;
  const ev = currentEval;

  /* ── Cálculos derivados ─────────────────────────────────────────────────── */

  const totalPercentage = DIRECTION_KEYS.reduce(
    (s, k) => s + (ev.directions[k]?.active ? Number(ev.directions[k]?.percentage || 0) : 0),
    0,
  );

  const totalWeighting =
    ev.weighting.competencies +
    ev.weighting.objectives +
    (ev.weighting.additionalSections || []).reduce((s, sec) => s + (sec.percentage || 0), 0);

  const activeDirections = DIRECTION_KEYS.filter(
    k => ev.directions[k]?.active && ev.directions[k]?.percentage > 0,
  );

  const selectedScale = SCALE_OPTIONS.find(s => s.value === ev.scale);

  /* ── Handlers ──────────────────────────────────────────────────────────── */

  const updateDirection = (key, field, value) => {
    updateCurrentEval(prev => ({
      ...prev,
      directions: { ...prev.directions, [key]: { ...prev.directions[key], [field]: value } },
    }));
    setErrors(e => ({ ...e, directions: undefined }));
  };

  const toggleDirection = (key, active) => {
    updateCurrentEval(prev => ({
      ...prev,
      directions: {
        ...prev.directions,
        [key]: { ...prev.directions[key], active, percentage: active ? prev.directions[key].percentage : 0 },
      },
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

  const handleCalibrationToggle = val => {
    if (!val && ev.hasCalibration) {
      setDisableCalibrationWarning(true);
    } else {
      updateCurrentEval({ hasCalibration: val });
    }
  };

  const handleFeedbackToggle = val => {
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
    if (totalPercentage !== 100)
      errs.directions = `Los porcentajes deben sumar 100%. Actualmente: ${totalPercentage}%.`;
    if (totalWeighting !== 100)
      errs.weighting = `Las ponderaciones deben sumar 100%. Actualmente: ${totalWeighting}%.`;
    if (ev.weighting.objectives > 0 && !ev.objectivesPeriod)
      errs.period = 'Debes seleccionar un período de objetivos.';
    if (!ev.scale) errs.scale = 'Selecciona una escala de calificación.';
    return errs;
  };

  const handleSaveAndContinue = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
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

  const addSection = section => {
    updateCurrentEval(prev => ({
      ...prev,
      weighting: {
        ...prev.weighting,
        additionalSections: [...(prev.weighting.additionalSections || []), section],
      },
    }));
    addToast(`Sección '${section.name}' agregada.`);
  };

  const removeSection = id => {
    updateCurrentEval(prev => ({
      ...prev,
      weighting: {
        ...prev.weighting,
        additionalSections: prev.weighting.additionalSections.filter(s => s.id !== id),
      },
    }));
  };

  /* ── Renderizado de tarjeta de dirección ───────────────────────────────── */

  const renderDirectionCard = key => {
    const dir = ev.directions[key];
    return (
      <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
        <Section
          title={DIRECTION_LABELS[key]}
          description={DIRECTION_DESCRIPTIONS[key]}
          open={dir?.active || false}
          onToggle={active => toggleDirection(key, active)}
          percentage={String(dir?.percentage || '')}
          onPercentageChange={val => updateDirection(key, 'percentage', Number(val))}
          isPrivate={dir?.isPrivate || false}
          onPrivateChange={val => updateDirection(key, 'isPrivate', val)}
          onScheduleOpen={() => setScheduleModal(key)}
        />

        {/* Badge de programación activa */}
        {dir?.scheduled && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 4,
            padding: '3px 10px',
            borderRadius: 16,
            border: '1px solid #B6CEE7',
            background: '#F6F9FA',
            alignSelf: 'flex-start',
            marginLeft: 16,
          }}>
            <ClockIconSvg color="#5780AD" size={14} />
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#5780AD' }}>
              Programada: {dir.scheduled.date} {dir.scheduled.time}
            </span>
          </div>
        )}

        {/* Cantidad de evaluadores (sólo para Ascendente y Pares cuando están activos) */}
        {HAS_EVALUATORS.includes(key) && dir?.active && (
          <div style={{
            background: '#ffffff',
            borderRadius: '0 0 16px 16px',
            boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.15)',
            padding: '12px 16px 16px 66px',
            marginTop: -4,
            display: 'flex',
            gap: 24,
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}>
            <PercentageInput
              label="Mín. evaluadores"
              value={String(dir.minEval || '')}
              onChange={val => updateDirection(key, 'minEval', val)}
              placeholder="—"
            />
            <PercentageInput
              label="Máx. evaluadores"
              value={String(dir.maxEval || '')}
              onChange={val => updateDirection(key, 'maxEval', val)}
              placeholder="—"
            />
            {dir.minEval && dir.maxEval && Number(dir.maxEval) < Number(dir.minEval) && (
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#E24C4C' }}>
                El máximo debe ser mayor o igual al mínimo.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */

  const templateInfo = ev.template && TEMPLATE_CONFIGS[ev.template];

  return (
    <>
      {/* Banner de plantilla */}
      {templateInfo && ev.template !== 'custom' && (
        <div style={{
          background: '#F6F9FA',
          border: '1px solid #E5E5E5',
          borderRadius: 8,
          padding: '10px 16px',
        }}>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: '#333333' }}>
            {ev.template === '180' ? (
              <>Configuración aplicada desde: <strong>Evaluación 180°</strong>. Puedes ajustar cualquier valor.</>
            ) : (
              <>
                Configuración aplicada desde{' '}
                <strong>
                  "{templateInfo.label}
                  {templateInfo.subtitle ? ` — ${templateInfo.subtitle}` : ''}"
                </strong>
                . Puedes ajustar cualquier valor.
              </>
            )}
          </span>
        </div>
      )}

      {/* ── Sección A: ¿Quién evalúa a quién? ─────────────────────────────── */}
      <SectionCard>
        {/* Título y bajada */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
          <p style={sectionTitleStyle}>A. ¿Quién evalúa a quién?</p>
          <p style={sectionSubtitleStyle}>
            Activa los tipos de evaluación e indícales un peso. Los porcentajes deben sumar exactamente 100%.
          </p>
        </div>

        {/* Totalizador + Programar publicación */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Totalizador total={totalPercentage} />
          {activeDirections.length > 0 && (
            <button
              type="button"
              onClick={() => setScheduleAllModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#019BE5',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              <ClockIconSvg color="#019BE5" size={16} />
              Programar publicación
            </button>
          )}
        </div>

        {/* Direcciones oficiales (siempre visibles) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {OFFICIAL_DIRECTIONS.map(key => renderDirectionCard(key))}
        </div>

        {/* Chip para mostrar/ocultar direcciones personalizadas */}
        <div style={{ paddingTop: 24 }}>
          <Chip
            label={showCustomDirections ? 'Ocultar' : 'Mostrar todas las direcciones'}
            count={CUSTOM_DIRECTIONS.length}
            expanded={showCustomDirections}
            active={showCustomDirections}
            onClick={() => setShowCustomDirections(prev => !prev)}
          />
        </div>

        {/* Direcciones personalizadas (visibles al expandir el Chip) */}
        {showCustomDirections && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {CUSTOM_DIRECTIONS.map(key => renderDirectionCard(key))}
          </div>
        )}

        {errors.directions && (
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#E24C4C', marginTop: 12 }}>
            {errors.directions}
          </p>
        )}
      </SectionCard>

      {/* ── Sección B: ¿Cómo se calcula el resultado? ──────────────────────── */}
      <SectionCard>
        <p style={{ ...sectionTitleStyle, marginBottom: 16 }}>B. ¿Cómo se calcula el resultado?</p>

        {/* Escala de calificación */}
        <div style={{ paddingTop: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#333333' }}>
              Escala de calificación final{' '}
              <span style={{ color: '#E24C4C' }}>*</span>
            </span>
            <InfoIconSvg />
          </div>

          {/* Selector + Chip vista previa */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <Selector
              label="Seleccionar"
              placeholder="-- Seleccionar escala --"
              options={SCALE_OPTIONS.map(s => ({ value: s.value, label: s.label }))}
              value={ev.scale}
              onChange={val => {
                updateCurrentEval({ scale: val });
                setErrors(er => ({ ...er, scale: undefined }));
              }}
              fieldState={errors.scale ? 'error' : 'default'}
              supportingText={errors.scale}
              style={{ width: 630 }}
            />
            <div style={{ paddingTop: 24, flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => ev.scale && setScalePreviewOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 24,
                  padding: '0 4px 0 8px',
                  borderRadius: 16,
                  border: '1px solid #5780AD',
                  background: 'transparent',
                  cursor: ev.scale ? 'pointer' : 'default',
                  color: '#5780AD',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>Ver escala</span>
                <EyeIcon color="#00B4FF" size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Ponderación */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#333333', margin: 0 }}>
              Peso de cada dimensión en el resultado
            </p>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: '#666666', lineHeight: '20px', margin: 0 }}>
              Activa las dimensiones que incluirá el proceso. Los porcentajes deben sumar 100%.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Totalizador total={totalWeighting} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Competencias */}
            <WeightingCard
              title="Competencias"
              description="Evalúa competencias conductuales y funcionales."
              enabled={competenciesEnabled}
              onToggle={val => {
                setCompetenciesEnabled(val);
                if (!val) updateWeighting('competencies', 0);
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingLeft: 50, paddingRight: 24, paddingTop: 19, paddingBottom: 19 }}>
                <div style={{ width: 140 }}>
                  <PercentageInput
                    label="Porcentaje (%)"
                    value={String(ev.weighting.competencies || '')}
                    onChange={val => updateWeighting('competencies', val)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#333333' }}>
                      Origen competencias funcionales
                    </span>
                    <InfoIconSvg />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      {
                        value: 'cargo',
                        label: 'Según el cargo que ocupa',
                        tag: '(Recomendado)',
                        desc: 'Competencias del cargo asignado en el sistema.',
                      },
                      {
                        value: 'familia',
                        label: 'Según la familia de cargos',
                        desc: 'Competencias de la familia del cargo.',
                      },
                      {
                        value: 'manual',
                        label: 'Asignación manual (Perfil personalizado)',
                        desc: 'Se asignan individualmente a cada colaborador.',
                      },
                    ].map(opt => (
                      <div key={opt.value} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Radiobutton
                          name="competencyOrigin"
                          value={opt.value}
                          checked={ev.competencyOrigin === opt.value}
                          onChange={() => updateCurrentEval({ competencyOrigin: opt.value })}
                          label={
                            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: '#333333' }}>
                              {opt.label}
                              {opt.tag && (
                                <span style={{ color: '#5780AD', marginLeft: 4 }}>{opt.tag}</span>
                              )}
                            </span>
                          }
                        />
                        <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#666666', paddingLeft: 32, margin: 0 }}>
                          {opt.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </WeightingCard>

            {/* Objetivos */}
            <WeightingCard
              title="Objetivos"
              description="Evalúa el cumplimiento de metas individuales."
              enabled={objectivesEnabled}
              onToggle={val => {
                setObjectivesEnabled(val);
                if (!val) {
                  updateWeighting('objectives', 0);
                  updateCurrentEval({ objectivesPeriod: null });
                }
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingLeft: 50, paddingRight: 24, paddingTop: 19, paddingBottom: 19 }}>
                <div style={{ width: 140 }}>
                  <PercentageInput
                    label="Porcentaje (%)"
                    value={String(ev.weighting.objectives || '')}
                    onChange={val => updateWeighting('objectives', val)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#333333' }}>
                        Período de objetivos
                      </span>
                      <InfoIconSvg />
                    </div>
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: '#666666', lineHeight: '20px', margin: 0 }}>
                      ¿Qué período de objetivos se evaluará? Debe existir previamente en el sistema.
                    </p>
                  </div>

                  {ev.objectivesPeriod ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#333333' }}>
                        {ev.objectivesPeriod.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCurrentEval({ objectivesPeriod: null })}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'Roboto, sans-serif',
                          fontSize: 12,
                          color: '#00B4FF',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {MOCK_PERIODS.map(p => (
                        <Radiobutton
                          key={p.id}
                          name="period"
                          value={String(p.id)}
                          checked={ev.objectivesPeriod?.id === p.id}
                          onChange={() => {
                            updateCurrentEval({ objectivesPeriod: p });
                            setErrors(er => ({ ...er, period: undefined }));
                          }}
                          label={p.name}
                        />
                      ))}
                    </div>
                  )}

                  {errors.period && (
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#E24C4C', margin: 0 }}>
                      {errors.period}
                    </p>
                  )}
                </div>
              </div>
            </WeightingCard>

            {/* Secciones adicionales */}
            {(ev.weighting.additionalSections || []).map(sec => (
              <div key={sec.id} style={{
                background: '#ffffff',
                borderRadius: 16,
                boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.15)',
                maxWidth: 687,
              }}>
                <div style={{ padding: 16, display: 'flex', alignItems: 'center' }}>
                  {/* Espacio reservado donde iría el switch */}
                  <div style={{ width: 40, flexShrink: 0 }} />
                  {/* Título */}
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#0A396C', flex: 1 }}>
                    {sec.name}
                  </span>
                  {/* Porcentaje + eliminar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 24 }}>
                    <div style={{ width: 140 }}>
                      <PercentageInput
                        label="Porcentaje (%)"
                        value={String(sec.percentage || '')}
                        onChange={val =>
                          updateCurrentEval(prev => ({
                            ...prev,
                            weighting: {
                              ...prev.weighting,
                              additionalSections: prev.weighting.additionalSections.map(s =>
                                s.id === sec.id ? { ...s, percentage: Number(val) } : s,
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSection(sec.id)}
                      aria-label={`Eliminar sección ${sec.name}`}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <TrashIcon color="#E24C4C" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.weighting && (
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#E24C4C', marginTop: 8, margin: 0 }}>
              {errors.weighting}
            </p>
          )}

          {/* Botón Añadir sección */}
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() => setAddSectionModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid #00B4FF',
                borderRadius: 16,
                padding: '2px 12px 2px 4px',
                background: 'transparent',
                cursor: 'pointer',
                color: '#019BE5',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              <PlusIconSvg />
              Añadir sección
            </button>
          </div>
        </div>
      </SectionCard>

      {/* ── Sección C: Tipo de formulario ──────────────────────────────────── */}
      <SectionCard>
        <p style={{ ...sectionTitleStyle, marginBottom: 16 }}>C. Tipo de formulario</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Radiobutton
              name="formType"
              value="single"
              checked={ev.formType === 'single'}
              onChange={() => updateCurrentEval({ formType: 'single', multipleFormCriteria: null })}
              label={
                <span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#333333' }}>
                    Formulario único
                  </span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: '#666666', marginLeft: 8 }}>
                    — Recomendado
                  </span>
                </span>
              }
            />
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#666666', paddingLeft: 32, margin: 0 }}>
              Todos responden el mismo instrumento.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Radiobutton
              name="formType"
              value="multiple"
              checked={ev.formType === 'multiple'}
              onChange={() => updateCurrentEval({ formType: 'multiple' })}
              label={
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#333333' }}>
                  Formulario múltiple
                </span>
              }
            />
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#666666', paddingLeft: 32, margin: 0 }}>
              Cada tipo de evaluador puede tener un formulario distinto.
            </p>
          </div>

          {ev.formType === 'multiple' && (
            <div style={{
              marginLeft: 32,
              background: '#F6F9FA',
              border: '1px solid #E5E5E5',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 12, color: '#666666', margin: 0 }}>
                ¿Cómo se diferencian los formularios?
              </p>
              {[
                { value: 'unique',  label: 'Por tipo de dirección',      desc: 'Un formulario diferente para cada dirección de evaluación activa.' },
                { value: 'cargo',   label: 'Por cargo',                desc: 'El formulario varía según el cargo del colaborador evaluado.' },
                { value: 'familia', label: 'Por familia de cargos',    desc: 'El formulario varía según la familia de cargos del colaborador.' },
                { value: 'perfil',  label: 'Por perfil personalizado', desc: 'El formulario se asigna individualmente a cada colaborador.' },
              ].map(opt => (
                <div key={opt.value} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Radiobutton
                    name="multipleFormCriteria"
                    value={opt.value}
                    checked={ev.multipleFormCriteria === opt.value}
                    onChange={() => updateCurrentEval({ multipleFormCriteria: opt.value })}
                    label={opt.label}
                  />
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#666666', paddingLeft: 32, margin: 0 }}>
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Sección D: Etapas adicionales (plegable) ───────────────────────── */}
      <CollapsibleSectionCard
        label="D. Etapas adicionales después de la evaluación (opcional)"
        description="Agrega etapas de revisión o feedback."
        isExpanded={expandedSections.D}
        onToggle={() => setExpandedSections(s => ({ ...s, D: !s.D }))}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ToggleOption
            label="Calibración"
            description="Revisión y ajuste colectivo de resultados antes de publicarlos."
            checked={ev.hasCalibration}
            onChange={handleCalibrationToggle}
          />
          <ToggleOption
            label="Retroalimentación"
            description="El evaluador entrega feedback formal al colaborador una vez cerrados los resultados."
            checked={ev.hasFeedback}
            onChange={handleFeedbackToggle}
          />
        </div>
      </CollapsibleSectionCard>

      {/* ── Sección E: Potencial (plegable) ───────────────────────────────── */}
      <CollapsibleSectionCard
        label="E. Evaluación de potencial (opcional)"
        isExpanded={expandedSections.E}
        onToggle={() => setExpandedSections(s => ({ ...s, E: !s.E }))}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Checkbox
            label="Incluir evaluación de potencial"
            checked={ev.hasPotential}
            onChange={val => updateCurrentEval({ hasPotential: val })}
          />
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#666666', paddingLeft: 32, margin: 0 }}>
            Evalúa el potencial de desarrollo, separado del desempeño.
          </p>
        </div>
      </CollapsibleSectionCard>

      {/* ── Sección F: Opciones avanzadas (plegable) ──────────────────────── */}
      <CollapsibleSectionCard
        label="F. Opciones avanzadas (opcional)"
        description="La configuración predeterminada funciona bien para la mayoría de los procesos."
        isExpanded={expandedSections.F}
        onToggle={() => setExpandedSections(s => ({ ...s, F: !s.F }))}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <p style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: '#666666',
              margin: '0 0 24px',
            }}>
              Visibilidad de resultados
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { key: 'participantCanSeePartialResults', label: 'El colaborador puede ver resultados parciales durante el proceso.' },
                { key: 'evaluatorSeesAccumulatedScore', label: 'El evaluador ve el puntaje acumulado mientras responde.' },
              ].map(opt => (
                <Checkbox
                  key={opt.key}
                  label={opt.label}
                  checked={ev.advancedOptions[opt.key]}
                  onChange={val =>
                    updateCurrentEval(prev => ({
                      ...prev,
                      advancedOptions: { ...prev.advancedOptions, [opt.key]: val },
                    }))
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: '#666666',
              margin: '0 0 24px',
            }}>
              Configuración reporte PDF
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { key: 'hideQualitativeFromPDF', label: 'No mostrar respuestas cualitativas del evaluador al colaborador en el PDF.' },
                { key: 'showOnlyAggregateResult', label: 'Mostrar solo resultado agregado, sin desglose de indicadores.' },
                ...(ev.hasPotential ? [{ key: 'hidePotentialFromPDF', label: 'No incluir la sección de potencial en el PDF.' }] : []),
              ].map(opt => (
                <Checkbox
                  key={opt.key}
                  label={opt.label}
                  checked={ev.advancedOptions[opt.key]}
                  onChange={val =>
                    updateCurrentEval(prev => ({
                      ...prev,
                      advancedOptions: { ...prev.advancedOptions, [opt.key]: val },
                    }))
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSectionCard>

      {/* ── Acciones ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        paddingTop: 16,
      }}>
        <Button variant="secondary" size="md" onClick={handleSaveDraft}>
          Guardar borrador
        </Button>
        <Button
          variant="primary"
          size="md"
          icon={<ArrowRightIcon color="#B6CEE7" size={16} />}
          iconPosition="right"
          onClick={handleSaveAndContinue}
        >
          Guardar y continuar
        </Button>
      </div>

      {/* ── Modal: Vista previa de escala ────────────────────────────────── */}
      <Modal
        isOpen={scalePreviewOpen}
        onClose={() => setScalePreviewOpen(false)}
        title={selectedScale ? `Vista previa: ${selectedScale.label}` : 'Vista previa de escala'}
        size="sm"
      >
        {selectedScale && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: '#666666', margin: 0 }}>
              {selectedScale.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {(SCALE_LEVELS[ev.scale] || []).map(level => (
                <div
                  key={level.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    background: '#F6F9FA',
                    borderRadius: 8,
                    border: '1px solid #E5E5E5',
                  }}
                >
                  <span style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#1E5591',
                    minWidth: 28,
                    textAlign: 'center',
                  }}>
                    {level.value}
                  </span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: '#333333' }}>
                    {level.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Modal: Confirmar desactivar calibración ──────────────────────── */}
      {disableCalibrationWarning && (
        <ConfirmDisableModal
          title="Desactivar calibración"
          message="Desactivar esta etapa eliminará la configuración guardada. ¿Continuar?"
          onConfirm={() => {
            updateCurrentEval({ hasCalibration: false });
            setDisableCalibrationWarning(false);
          }}
          onCancel={() => setDisableCalibrationWarning(false)}
        />
      )}

      {/* ── Modal: Confirmar desactivar retroalimentación ────────────────── */}
      {disableFeedbackWarning && (
        <ConfirmDisableModal
          title="Desactivar retroalimentación"
          message="Desactivar esta etapa eliminará la configuración guardada. ¿Continuar?"
          onConfirm={() => {
            updateCurrentEval({ hasFeedback: false });
            setDisableFeedbackWarning(false);
          }}
          onCancel={() => setDisableFeedbackWarning(false)}
        />
      )}

      {/* ── Modal: Programar apertura individual ─────────────────────────── */}
      {scheduleModal && (
        <ScheduleModal
          isOpen={!!scheduleModal}
          onClose={() => setScheduleModal(null)}
          directionKey={scheduleModal}
          currentSchedule={ev.directions[scheduleModal]?.scheduled}
          onSave={s => handleScheduleSave(scheduleModal, s)}
        />
      )}

      {/* ── Modal: Programar publicación global ──────────────────────────── */}
      {scheduleAllModal && (
        <ScheduleAllModal
          isOpen={scheduleAllModal}
          onClose={() => setScheduleAllModal(false)}
          activeDirections={activeDirections}
          currentSchedules={Object.fromEntries(DIRECTION_KEYS.map(k => [k, ev.directions[k]?.scheduled]))}
          onSave={schedules => {
            Object.entries(schedules).forEach(([k, s]) => {
              updateDirection(k, 'scheduled', s.type === 'specific' ? { date: s.date, time: s.time } : null);
            });
            addToast('Programación de apertura guardada.');
          }}
        />
      )}

      {/* ── Modal: Añadir sección ─────────────────────────────────────────── */}
      <AddSectionModal
        isOpen={addSectionModal}
        onClose={() => setAddSectionModal(false)}
        currentWeighting={ev.weighting}
        onAdd={addSection}
      />
    </>
  );
}

/* ─── Componentes auxiliares ─────────────────────────────────────────────── */

/** Tarjeta de sección principal (fondo blanco, elevación mayor) */
function SectionCard({ children }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
      padding: 24,
    }}>
      {children}
    </div>
  );
}

/** Tarjeta de ponderación (fondo blanco, elevación menor, ancho fijo 687px) */
function WeightingCard({ title, description, enabled, onToggle, children }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.15)',
      maxWidth: 687,
    }}>
      {/* Header: switch + título + descripción */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Switch
            checked={enabled}
            onChange={onToggle}
            aria-label={`${title}: ${enabled ? 'activo' : 'inactivo'}`}
          />
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#0A396C' }}>
            {title}
          </span>
        </div>
        {description && (
          <div style={{ paddingLeft: 50 }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#666666', margin: 0 }}>
              {description}
            </p>
          </div>
        )}
      </div>
      {/* Contenido expandido */}
      {enabled && children}
    </div>
  );
}

/** Sección plegable (opcional) */
function CollapsibleSectionCard({ label, description, isExpanded, onToggle, children }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#5780AD', margin: 0 }}>
            {label}
          </p>
          {description && !isExpanded && (
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: '#5780AD', margin: '2px 0 0' }}>
              {description}
            </p>
          )}
        </div>
        <ChevronIconSvg isExpanded={isExpanded} />
      </button>

      {isExpanded && (
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ paddingTop: 16 }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/** Fila con switch + label + descripción (para Calibración, Retroalimentación) */
function ToggleOption({ label, description, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, color: '#333333', margin: 0 }}>
          {label}
        </p>
        {description && (
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#666666', margin: '4px 0 0' }}>
            {description}
          </p>
        )}
      </div>
      <Switch checked={checked} onChange={onChange} aria-label={label} />
    </div>
  );
}

/** Input de porcentaje con separador inferior (estilo Zafiro InputField minimalista) */
function PercentageInput({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 83, width: 140 }}>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#666666' }}>{label}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', height: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <input
            type="number"
            min="0"
            max="100"
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 16,
              fontFamily: 'Roboto, sans-serif',
              color: '#333333',
              background: 'transparent',
              minWidth: 0,
            }}
          />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <text x="5" y="17" fontFamily="Roboto, sans-serif" fontSize="13" fill="#999999">%</text>
          </svg>
        </div>
        <div style={{ height: 1, background: '#999999', borderRadius: 16 }} />
      </div>
    </div>
  );
}

/** Modal de confirmación para desactivar etapas */
function ConfirmDisableModal({ title, message, onConfirm, onCancel }) {
  return (
    <Modal isOpen onClose={onCancel} title={title} size="sm">
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: '#666666', marginBottom: 20 }}>
        {message}
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" size="md" onClick={onConfirm}>
          Continuar
        </Button>
      </div>
    </Modal>
  );
}

/* ─── Íconos SVG inline ──────────────────────────────────────────────────── */

function InfoIconSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" stroke="#5780AD" strokeWidth="1.5" />
      <path d="M12 11v5" stroke="#5780AD" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.8" fill="#5780AD" />
    </svg>
  );
}

function ClockIconSvg({ color = '#00B4FF', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <path d="M12 7.5V12l3 1.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIconSvg({ isExpanded }) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
      style={{
        transform: isExpanded ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.2s ease',
        flexShrink: 0,
      }}
    >
      <path
        d="M1 1L6 6L11 1"
        stroke="#00B4FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIconSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


/* ─── Estilos compartidos ────────────────────────────────────────────────── */

const sectionTitleStyle = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: 16,
  color: '#5780AD',
  margin: 0,
};

const sectionSubtitleStyle = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: 14,
  color: '#5780AD',
  lineHeight: '20px',
  margin: 0,
};
