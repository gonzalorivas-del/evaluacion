import { useState } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import { ResumenSeccion, ResumenSeccionContent, ResumenCampo } from '../../ResumenSeccion';
import { GrupoEvaluacion } from '../../GrupoEvaluacion';
import { Chip } from '../../Chip';
import { Button } from '../../Button';
import ActivationModal from '../../modals/ActivationModal';
import { TEMPLATE_CONFIGS, DIRECTION_LABELS, SCALE_OPTIONS } from '../../../data/constants';
import { CheckFillIcon } from '../../../assets/icons/CheckFillIcon';
import { CheckIcon } from '../../../assets/icons/CheckIcon';
import { XIcon } from '../../../assets/icons/XIcon';

/*
 * Tokens Zafiro usados (src/tokens/tokens.json):
 *   panel:       #5780AD  — títulos de sección y texto alerta
 *   auxiliar:    #B6CEE7  — borde InfoPill
 *   fondo:       #F6F9FA  — banner participantes, notif-cards, expand-area
 *   alerta:      #FFB800  — ícono triángulo de advertencia
 *   exito:       #ACCA54  — botón Activar evaluación
 *   error:       #E24C4C  — botón Eliminar formularios
 *   negro-textos:#333333  — valores en ResumenCampo
 *   gris-oscuro: #666666  — descripción notificaciones, tabla participantes
 *   blanco:      #FFFFFF  — fondo modal eliminar
 *   elevation-2: 0px 5px 8px 0px rgba(0,0,0,0.15)
 */

const DIRECTION_KEYS = [
  'descendente', 'autoEvaluacion', 'ascendente',
  'pares', 'autodiseno', 'descendenteDiseno',
];

const JUSTIF_LABELS = {
  none:     'No requerida',
  optional: 'Opcional',
  required: 'Requerida',
};

const TEXT_FIELD_LABELS = {
  strengths:     'Fortalezas',
  improvements:  'Oportunidades de mejora',
  achievements:  'Logros',
  trainingNeeds: 'Necesidades de capacitación',
};

/* ── Íconos inline ────────────────────────────────────────────────────────── */

function CheckCircleIcon({ size = 20, color = '#333333' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <path
        d="M8 12l3 3 5-5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertTriangleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="#FFB800"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 9v4" stroke="#FFB800" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.8" fill="#FFB800" />
    </svg>
  );
}

/* ── InfoPill — chip de solo lectura ─────────────────────────────────────── */

function InfoPill({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #B6CEE7',
        borderRadius: '20px',
        padding: '2px 12px',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '13px',
        fontWeight: 400,
        color: '#333333',
      }}
    >
      {children}
    </span>
  );
}

/* ── Mock data participantes ──────────────────────────────────────────────── */

const MOCK_PARTICIPANTS_TABLE = [
  { id: 1, name: 'María González',   rut: '12.345.678-9', empresa: 'Empresa A', cargo: 'Analista',      familia: 'Análisis',      status: 'No iniciada' },
  { id: 2, name: 'Juan Pérez',       rut: '11.234.567-8', empresa: 'Empresa A', cargo: 'Jefe de Área',  familia: 'Gestión',       status: 'Borrador' },
  { id: 3, name: 'Ana López',        rut: '13.456.789-0', empresa: 'Empresa B', cargo: 'Coordinadora',  familia: 'Coordinación',  status: 'No iniciada' },
  { id: 4, name: 'Carlos Rodríguez', rut: '14.567.890-1', empresa: 'Empresa A', cargo: 'Gerente',       familia: 'Dirección',     status: 'Enviada' },
  { id: 5, name: 'Sofía Martínez',   rut: '15.678.901-2', empresa: 'Empresa B', cargo: 'Analista Senior', familia: 'Análisis',   status: 'No iniciada' },
  { id: 6, name: 'Pedro Castillo',   rut: '16.789.012-3', empresa: 'Empresa A', cargo: 'Desarrollador', familia: 'TI',           status: 'No iniciada' },
  { id: 7, name: 'Laura Figueroa',   rut: '17.890.123-4', empresa: 'Empresa B', cargo: 'Diseñadora',    familia: 'Diseño',       status: 'No iniciada' },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function formatDate(d) {
  if (!d) return '—';
  if (d.includes('/')) return d;
  const [year, month, day] = d.split('-');
  return `${day}/${month}/${year}`;
}

/* ── Step 4: Resumen y activación ────────────────────────────────────────── */

export default function Step4Summary() {
  const { currentEval, setActiveStep, saveDraft, addToast } = useEvaluation();

  const [showActivationModal, setShowActivationModal] = useState(
    new URLSearchParams(window.location.search).get('modal') === '1'
  );
  const [showParticipants, setShowParticipants] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditable, setShowEditable] = useState(true);

  if (!currentEval) return null;
  const ev = currentEval;

  const templateInfo     = ev.template ? TEMPLATE_CONFIGS[ev.template] : null;
  const activeDirections = DIRECTION_KEYS.filter(k => ev.directions[k]?.active);
  const scaleLabel       = SCALE_OPTIONS.find(s => s.value === ev.scale)?.label || ev.scale;
  const participantCount = ev.scope === 'all' ? 7 : ev.participants.length;
  const isMultipleForm   = ev.formType !== 'single';

  const additionalStages = [
    ev.hasCalibration && 'Calibración',
    ev.hasFeedback    && 'Retroalimentación',
    ev.hasPotential   && 'Potencial',
  ].filter(Boolean);

  const activeTextFields = Object.entries(ev.textFields || {})
    .filter(([, v]) => v)
    .map(([k]) => TEXT_FIELD_LABELS[k])
    .filter(Boolean);

  const grupoItems = activeDirections.map(k => ({
    name:          DIRECTION_LABELS[k],
    weight:        `${ev.directions[k].percentage}%`,
    justification: 'No',
  }));

  return (
    <>
      {/* ── 1. Datos del proceso ─────────────────────────────────────────── */}
      <ResumenSeccion title="Datos del proceso" onEdit={() => setActiveStep(1)}>
        <ResumenSeccionContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <ResumenCampo label="Nombre">{ev.name || '—'}</ResumenCampo>
            <ResumenCampo label="Período">
              {ev.startDate && ev.endDate
                ? `${formatDate(ev.startDate)} → ${formatDate(ev.endDate)}`
                : '—'}
            </ResumenCampo>
            <ResumenCampo label="Plantilla">
              {templateInfo ? `Evaluación "${templateInfo.label}"` : '—'}
            </ResumenCampo>
            <ResumenCampo label="Privacidad">
              {ev.isPrivate ? 'Privada' : 'Estándar'}
            </ResumenCampo>
            <ResumenCampo label="Alcance">
              {ev.scope === 'all'
                ? 'Toda la organización'
                : `${ev.participants.length} personas seleccionadas`}
            </ResumenCampo>
            <ResumenCampo label="Responsables">
              {ev.responsibles.length > 0
                ? ev.responsibles.map(r => r.name).join(', ')
                : '—'}
            </ResumenCampo>
          </div>
        </ResumenSeccionContent>
      </ResumenSeccion>

      {/* ── 2. Estructura ────────────────────────────────────────────────── */}
      <ResumenSeccion title="Estructura" onEdit={() => setActiveStep(2)}>
        <ResumenSeccionContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <ResumenCampo label="Evaluadores">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {activeDirections.length > 0
                  ? activeDirections.map(k => (
                    <InfoPill key={k}>
                      {DIRECTION_LABELS[k]}: {ev.directions[k].percentage}%
                    </InfoPill>
                  ))
                  : <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#999999' }}>Sin configurar</span>
                }
              </div>
            </ResumenCampo>
            <ResumenCampo label="Tipo formulario">
              <InfoPill>{isMultipleForm ? 'Formulario múltiple' : 'Formulario único'}</InfoPill>
            </ResumenCampo>
            <ResumenCampo label="Escala">{scaleLabel || '—'}</ResumenCampo>
            <ResumenCampo label="Objetivos">{ev.weighting.objectives}%</ResumenCampo>
            <ResumenCampo label="Competencias">{ev.weighting.competencies}%</ResumenCampo>
            {additionalStages.length > 0 && (
              <ResumenCampo label="Etapas adicionales">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {additionalStages.map(s => <InfoPill key={s}>{s}</InfoPill>)}
                </div>
              </ResumenCampo>
            )}
          </div>
        </ResumenSeccionContent>
      </ResumenSeccion>

      {/* ── 3. Formulario ────────────────────────────────────────────────── */}
      <ResumenSeccion
        title="Formulario"
        onPreview={() => {}}
        onEdit={() => setActiveStep(3)}
      >
        {isMultipleForm ? (
          /* Formulario múltiple: tipo + grupos colapsables dentro del contenedor bordeado */
          <ResumenSeccionContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ResumenCampo label="Tipo formulario">
                <InfoPill>Formulario múltiple</InfoPill>
              </ResumenCampo>
              <GrupoEvaluacion
                title="Grupo evaluación 1"
                competencyWeight={ev.weighting.competencies}
                competencias={grupoItems}
                objectiveWeight={ev.weighting.objectives}
                objetivos={ev.weighting.objectives > 0 ? grupoItems : []}
                defaultExpanded={true}
              />
              <GrupoEvaluacion
                title="Grupo evaluación 2"
                competencyWeight={ev.weighting.competencies}
                competencias={grupoItems}
                objectiveWeight={ev.weighting.objectives}
                objetivos={ev.weighting.objectives > 0 ? grupoItems : []}
                defaultExpanded={false}
              />
            </div>
          </ResumenSeccionContent>
        ) : (
          /* Formulario único: grilla de campos */
          <ResumenSeccionContent>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <ResumenCampo label="Tipo formulario">
                <InfoPill>Formulario único</InfoPill>
              </ResumenCampo>
              <ResumenCampo label="Justificación por objetivos">
                {JUSTIF_LABELS[ev.objectiveJustification] ?? 'No requerida'}
              </ResumenCampo>
              <ResumenCampo label="Justificación por competencia">
                {JUSTIF_LABELS[ev.competencyJustification] ?? 'No requerida'}
              </ResumenCampo>
              {ev.weighting.objectives > 0 && (
                <ResumenCampo label="Peso objetivos individuales">
                  {ev.individualObjectivesWeight}%
                </ResumenCampo>
              )}
              {ev.weighting.competencies > 0 && (
                <ResumenCampo label="Funcionales">{ev.functionalPercentage}%</ResumenCampo>
              )}
              {activeTextFields.length > 0 && (
                <ResumenCampo label={`Campos adicionales (${activeTextFields.length})`}>
                  <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                    {activeTextFields.map(f => (
                      <li key={f} style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </ResumenCampo>
              )}
              {ev.weighting.competencies > 0 && (
                <ResumenCampo label="Transversales">{ev.transversalPercentage}%</ResumenCampo>
              )}
              {ev.selectedTransversalCompetencies.length > 0 && (
                <ResumenCampo label={`Competencias transversales seleccionadas (${ev.selectedTransversalCompetencies.length})`}>
                  <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                    {ev.selectedTransversalCompetencies.map(c => (
                      <li key={c.id} style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#333333' }}>
                        {c.name}: {c.percentage}% — Escala: {SCALE_OPTIONS.find(s => s.value === c.scale)?.label || c.scale}
                      </li>
                    ))}
                  </ul>
                </ResumenCampo>
              )}
            </div>
          </ResumenSeccionContent>
        )}
      </ResumenSeccion>

      {/* ── 4. Participantes ─────────────────────────────────────────────── */}
      <ResumenSeccion
        title="Participantes"
        onDelete={() => setShowDeleteConfirm(true)}
        deleteLabel="Eliminar formularios masivamente"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Banner conteo */}
          <div style={{ background: '#F6F9FA', borderRadius: '8px', padding: '12px 16px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#333333' }}>
              <strong>({participantCount})</strong> colaboradores incluidos en el proceso
            </span>
          </div>

          {/* Chip expandible lista */}
          <div style={{ display: 'inline-block' }}>
            <Chip
              label="Ver lista completa"
              expanded={showParticipants}
              onClick={() => setShowParticipants(p => !p)}
            />
          </div>

          {/* Tabla de participantes */}
          {showParticipants && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F6F9FA' }}>
                    {['Nombre', 'RUT', 'Empresa', 'Cargo', 'Familia', 'Estado formulario'].map(h => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 500,
                          fontSize: '12px',
                          color: '#666666',
                          borderBottom: '1px solid #E5E5E5',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PARTICIPANTS_TABLE.map((p, i) => (
                    <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid #E5E5E5' : undefined }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '13px', color: '#333333' }}>
                        {p.name}
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#666666' }}>{p.rut}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#666666' }}>{p.empresa}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#666666' }}>{p.cargo}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#666666' }}>{p.familia}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontSize: '12px',
                          border: `1px solid ${p.status === 'Enviada' ? '#333333' : p.status === 'Borrador' ? '#999999' : '#CCCCCC'}`,
                          color: p.status === 'Enviada' ? '#333333' : '#999999',
                          borderRadius: '4px',
                          padding: '2px 6px',
                        }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ResumenSeccion>

      {/* ── 5. Notificaciones configuradas ───────────────────────────────── */}
      <ResumenSeccion
        title="Notificaciones configuradas"
        subtitle="Al activar el proceso se enviarán las siguientes notificaciones."
        onEdit={() => setActiveStep(7)}
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {ev.notifications.map(n => (
            <div
              key={n.id}
              style={{
                background: '#F6F9FA',
                borderRadius: '12px',
                padding: '16px',
                flex: '1 1 200px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#333333', margin: 0 }}>
                {n.name}
              </p>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '12px', color: '#666666', margin: 0 }}>
                {n.condition || n.description}
              </p>
            </div>
          ))}
        </div>
      </ResumenSeccion>

      {/* ── 6. Alerta pre-activación + botones ───────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {/* Aviso */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangleIcon size={20} />
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: '#5780AD',
            margin: 0,
          }}>
            Una vez activado, algunos parámetros no podrán modificarse
          </p>
        </div>

        {/* Chip expandible "Ver qué puede editarse" */}
        <div style={{ display: 'inline-block' }}>
          <Chip
            label={showEditable ? 'Ocultar' : 'Ver que puede editarse después de activar o guardar'}
            expanded={showEditable}
            onClick={() => setShowEditable(e => !e)}
          />
        </div>

        {showEditable && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            padding: '16px',
            background: '#F6F9FA',
            borderRadius: '8px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '13px', color: '#333333', margin: 0 }}>
                Editable después de activar:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['Nombre del proceso', 'Fechas del proceso', 'Colaboradores incluidos', 'Responsables', 'Notificaciones'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckFillIcon size={16} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#666666' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '13px', color: '#333333', margin: 0 }}>
                No editable después de activar:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['Tipos de dirección y %', 'Ponderaciones', 'Escala de calificación', 'Formulario', 'Tipo de formulario'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <XIcon size={16} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#666666' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          paddingTop: '8px',
        }}>
          <Button variant="secondary" size="lg" onClick={saveDraft}>
            Guardar como borrador
          </Button>
          <Button
            variant="primary"
            size="lg"
            style={{ background: '#ACCA54', borderColor: '#ACCA54', color: '#1E5591' }}
            icon={<CheckIcon size={20} color="#1E5591" />}
            iconPosition="right"
            onClick={() => setShowActivationModal(true)}
          >
            Activar evaluación
          </Button>
        </div>
      </div>

      {/* ── Modal confirmar eliminar formularios ──────────────────────────── */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
          padding: '16px',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
          }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#333333', margin: '0 0 12px' }}>
              ¿Eliminar todos los formularios?
            </p>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#666666', margin: '0 0 24px' }}>
              Esta acción eliminará los formularios de {participantCount} colaboradores.
              Perderán cualquier avance guardado. No se puede deshacer.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="secondary" size="md" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                style={{ background: '#E24C4C', borderColor: '#E24C4C' }}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  addToast('Formularios eliminados correctamente.');
                }}
              >
                Sí, eliminar formularios
              </Button>
            </div>
          </div>
        </div>
      )}

      <ActivationModal
        isOpen={showActivationModal}
        onClose={() => setShowActivationModal(false)}
      />
    </>
  );
}
