import { useState } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import ActivationModal from '../../modals/ActivationModal';
import { TEMPLATE_CONFIGS, DIRECTION_LABELS, SCALE_OPTIONS } from '../../../data/constants';

const DIRECTION_KEYS = ['descendente', 'autoEvaluacion', 'ascendente', 'pares', 'autodiseno', 'descendenteDiseno'];

export default function Step4Summary() {
  const { currentEval, setActiveStep, saveDraft, addToast, updateCurrentEval } = useEvaluation();
  const [showActivationModal, setShowActivationModal] = useState(
    new URLSearchParams(window.location.search).get('modal') === '1'
  );
  const [showParticipants, setShowParticipants] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditable, setShowEditable] = useState(false);

  if (!currentEval) return null;
  const ev = currentEval;

  const templateInfo = ev.template ? TEMPLATE_CONFIGS[ev.template] : null;
  const activeDirections = DIRECTION_KEYS.filter(k => ev.directions[k]?.active);
  const scaleLabel = SCALE_OPTIONS.find(s => s.value === ev.scale)?.label || ev.scale;
  const participantCount = ev.scope === 'all' ? 7 : ev.participants.length;

  const MOCK_PARTICIPANTS_TABLE = [
    { id: 1, name: 'María González', rut: '12.345.678-9', empresa: 'Empresa A', cargo: 'Analista', familia: 'Análisis', status: 'No iniciada' },
    { id: 2, name: 'Juan Pérez', rut: '11.234.567-8', empresa: 'Empresa A', cargo: 'Jefe de Área', familia: 'Gestión', status: 'Borrador' },
    { id: 3, name: 'Ana López', rut: '13.456.789-0', empresa: 'Empresa B', cargo: 'Coordinadora', familia: 'Coordinación', status: 'No iniciada' },
    { id: 4, name: 'Carlos Rodríguez', rut: '14.567.890-1', empresa: 'Empresa A', cargo: 'Gerente', familia: 'Dirección', status: 'Enviada' },
    { id: 5, name: 'Sofía Martínez', rut: '15.678.901-2', empresa: 'Empresa B', cargo: 'Analista Senior', familia: 'Análisis', status: 'No iniciada' },
    { id: 6, name: 'Pedro Castillo', rut: '16.789.012-3', empresa: 'Empresa A', cargo: 'Desarrollador', familia: 'TI', status: 'No iniciada' },
    { id: 7, name: 'Laura Figueroa', rut: '17.890.123-4', empresa: 'Empresa B', cargo: 'Diseñadora', familia: 'Diseño', status: 'No iniciada' },
  ];

  const handleGoToNotifications = () => {
    updateCurrentEval({ notificationsVisited: true });
    // Find the notifications tab index
    const tabs = buildTabList(ev);
    const notifIdx = tabs.findIndex(t => t.key === 'step7');
    if (notifIdx !== -1) setActiveStep(tabs[notifIdx].step);
  };

  return (
    <div className="space-y-6">
      {/* Block 1: Process data */}
      <SummaryBlock title="Datos del proceso" onEdit={() => setActiveStep(1)}>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div><dt className="text-gray-500 text-xs">Nombre</dt><dd className="font-medium text-gray-900">{ev.name || '—'}</dd></div>
          <div><dt className="text-gray-500 text-xs">Período</dt><dd className="text-gray-800">{ev.startDate} → {ev.endDate}</dd></div>
          <div><dt className="text-gray-500 text-xs">Plantilla</dt><dd className="text-gray-800">{templateInfo ? `${templateInfo.label}${templateInfo.subtitle ? ` — ${templateInfo.subtitle}` : ''}` : '—'}</dd></div>
          <div>
            <dt className="text-gray-500 text-xs">Privacidad</dt>
            <dd>{ev.isPrivate
              ? <span className="border border-gray-900 px-2 py-0.5 text-xs">🔒 Privada</span>
              : <span className="text-gray-600 text-xs">Estándar</span>
            }</dd>
          </div>
          <div>
            <dt className="text-gray-500 text-xs">Alcance</dt>
            <dd className="text-gray-800">{ev.scope === 'all' ? 'Toda la organización' : `${ev.participants.length} personas seleccionadas`}</dd>
          </div>
          <div>
            <dt className="text-gray-500 text-xs">Responsables</dt>
            <dd className="text-gray-800">{ev.responsibles.length > 0 ? ev.responsibles.map(r => r.name).join(', ') : <span className="text-yellow-600 text-xs">⚠️ Sin asignar</span>}</dd>
          </div>
          {!ev.isPrivate && ev.managers.length > 0 && (
            <div><dt className="text-gray-500 text-xs">Encargados</dt><dd className="text-gray-800">{ev.managers.map(m => m.name).join(', ')}</dd></div>
          )}
          {!ev.isPrivate && ev.viewers.length > 0 && (
            <div><dt className="text-gray-500 text-xs">Visualizadores</dt><dd className="text-gray-800">{ev.viewers.map(v => v.name).join(', ')}</dd></div>
          )}
        </dl>
      </SummaryBlock>

      {/* Block 2: Structure */}
      <SummaryBlock title="Estructura" onEdit={() => setActiveStep(2)}>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">Evaluadores</p>
            <div className="flex flex-wrap gap-2">
              {activeDirections.map(k => (
                <div key={k} className="flex items-center gap-1 border border-gray-300 px-2 py-1 text-xs">
                  <span className="font-medium">{DIRECTION_LABELS[k]}</span>
                  <span className="text-gray-500">{ev.directions[k].percentage}%</span>
                  {ev.directions[k].isPrivate && <span className="border border-gray-400 px-1 text-gray-500">Privada</span>}
                  {ev.directions[k].scheduled && <span className="text-gray-400">⏱</span>}
                </div>
              ))}
              {activeDirections.length === 0 && <span className="text-yellow-600 text-xs">⚠️ Sin configurar</span>}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div><dt className="text-xs text-gray-500">Escala</dt><dd className="text-gray-800">{scaleLabel || '—'}</dd></div>
            <div><dt className="text-xs text-gray-500">Tipo formulario</dt><dd className="text-gray-800">{ev.formType === 'single' ? 'Único' : 'Múltiple'}</dd></div>
            <div><dt className="text-xs text-gray-500">Competencias</dt><dd className="text-gray-800">{ev.weighting.competencies}%</dd></div>
            <div><dt className="text-xs text-gray-500">Objetivos</dt><dd className="text-gray-800">{ev.weighting.objectives}%</dd></div>
            {(ev.weighting.additionalSections || []).map(s => (
              <div key={s.id}><dt className="text-xs text-gray-500">{s.name}</dt><dd className="text-gray-800">{s.percentage}%</dd></div>
            ))}
            <div>
              <dt className="text-xs text-gray-500">Etapas adicionales</dt>
              <dd className="text-gray-800">
                {[ev.hasCalibration && 'Calibración ✅', ev.hasFeedback && 'Retroalimentación ✅']
                  .filter(Boolean).join(' · ') || 'Sin etapas adicionales'}
              </dd>
            </div>
          </dl>
        </div>
      </SummaryBlock>

      {/* Block 3: Form */}
      <SummaryBlock title="Formulario" onEdit={() => setActiveStep(3)}>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div><dt className="text-xs text-gray-500">Nombre</dt><dd className="font-medium text-gray-900">{ev.formName || '—'}</dd></div>
          <div>
            <dt className="text-xs text-gray-500">Competencias funcionales</dt>
            <dd className="text-gray-800">{ev.selectedFunctionalCompetencies.length} seleccionadas</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Competencias transversales</dt>
            <dd className="text-gray-800">{ev.selectedTransversalCompetencies.length} seleccionadas</dd>
          </div>
          {ev.weighting.objectives > 0 && (
            <div><dt className="text-xs text-gray-500">Período objetivos</dt><dd className="text-gray-800">{ev.objectivesPeriod?.name || '—'}</dd></div>
          )}
          {Object.values(ev.textFields).some(Boolean) && (
            <div>
              <dt className="text-xs text-gray-500">Campos adicionales</dt>
              <dd className="text-gray-800">
                {[
                  ev.textFields.strengths && 'Fortalezas',
                  ev.textFields.improvements && 'Oportunidades',
                  ev.textFields.achievements && 'Logros',
                  ev.textFields.trainingNeeds && 'Capacitación',
                ].filter(Boolean).join(', ')}
              </dd>
            </div>
          )}
        </dl>
      </SummaryBlock>

      {/* Participants */}
      <section className="border border-gray-300 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Participantes</h3>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-red-600 border border-red-300 px-3 py-1 hover:bg-red-50"
          >
            Eliminar formularios masivamente
          </button>
        </div>
        <div className="border border-gray-200 px-4 py-2 bg-gray-50 text-sm text-gray-700 mb-3">
          <strong>{participantCount}</strong> colaboradores incluidos
        </div>
        <button
          onClick={() => setShowParticipants(p => !p)}
          className="text-xs text-gray-600 border-b border-gray-400"
        >
          {showParticipants ? 'Ocultar lista ▲' : 'Ver lista completa ▼'}
        </button>
        {showParticipants && (
          <table className="w-full text-xs border border-gray-200 mt-3">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 text-gray-600">Nombre</th>
                <th className="text-left px-3 py-2 text-gray-600">RUT</th>
                <th className="text-left px-3 py-2 text-gray-600">Empresa</th>
                <th className="text-left px-3 py-2 text-gray-600">Cargo</th>
                <th className="text-left px-3 py-2 text-gray-600">Familia</th>
                <th className="text-left px-3 py-2 text-gray-600">Estado formulario</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PARTICIPANTS_TABLE.map(p => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="px-3 py-2 font-medium text-gray-900">{p.name}</td>
                  <td className="px-3 py-2 text-gray-500">{p.rut}</td>
                  <td className="px-3 py-2 text-gray-500">{p.empresa}</td>
                  <td className="px-3 py-2 text-gray-500">{p.cargo}</td>
                  <td className="px-3 py-2 text-gray-500">{p.familia}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs border px-1.5 py-0.5 ${
                      p.status === 'Enviada' ? 'border-gray-900 text-gray-900' :
                      p.status === 'Borrador' ? 'border-gray-400 text-gray-500' :
                      'border-gray-200 text-gray-400'
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Notifications preview */}
      <section className="border border-gray-300 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Notificaciones configuradas</h3>
        <p className="text-xs text-gray-500 mb-4">Al activar el proceso se enviarán las siguientes notificaciones.</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {ev.notifications.map(n => (
            <div key={n.id} className="border border-gray-300 p-3 text-xs w-64">
              <p className="font-medium text-gray-900 mb-1">{n.name}</p>
              <div className="border-t border-gray-200 pt-2 text-gray-500">{n.condition}</div>
            </div>
          ))}
        </div>
        <button
          onClick={handleGoToNotifications}
          className="text-xs text-gray-700 border-b border-gray-500 hover:text-gray-900"
        >
          Revisar y editar notificaciones →
        </button>
      </section>

      {/* Activation section */}
      <section className="border border-gray-300 p-5">
        <div className="border border-gray-200 bg-gray-50 px-4 py-3 mb-5 text-sm text-gray-700">
          <p className="font-medium mb-2">⚠️ Una vez activado, algunos parámetros no podrán modificarse.</p>
          <button
            onClick={() => setShowEditable(e => !e)}
            className="text-xs text-gray-500 border-b border-gray-400"
          >
            {showEditable ? 'Ocultar ▲' : 'Ver qué puede editarse después de activar ▼'}
          </button>
          {showEditable && (
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-semibold text-gray-700 mb-1">✅ Editable después de activar:</p>
                <ul className="space-y-0.5 text-gray-600">
                  <li>· Nombre del proceso</li>
                  <li>· Fechas del proceso</li>
                  <li>· Colaboradores incluidos</li>
                  <li>· Responsables</li>
                  <li>· Notificaciones</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">❌ No editable después de activar:</p>
                <ul className="space-y-0.5 text-gray-600">
                  <li>· Tipos de dirección y %</li>
                  <li>· Ponderaciones</li>
                  <li>· Escala de calificación</li>
                  <li>· Formulario</li>
                  <li>· Tipo de formulario</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowActivationModal(true)}
            className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold border border-gray-900 hover:bg-gray-700"
          >
            Activar evaluación
          </button>
          <button
            onClick={saveDraft}
            className="px-4 py-3 text-sm border border-gray-400 text-gray-700 hover:bg-gray-50"
          >
            Guardar como borrador
          </button>
        </div>
      </section>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white border border-gray-400 p-6 max-w-md w-full mx-4">
            <h3 className="font-semibold text-gray-900 mb-2">¿Eliminar todos los formularios?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Esta acción eliminará los formularios de {participantCount} colaboradores.
              Perderán cualquier avance guardado. No se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm border border-gray-300">Cancelar</button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  addToast('Formularios eliminados correctamente.');
                }}
                className="px-4 py-2 text-sm border border-red-600 bg-red-600 text-white hover:bg-red-700"
              >
                Sí, eliminar formularios
              </button>
            </div>
          </div>
        </div>
      )}

      <ActivationModal isOpen={showActivationModal} onClose={() => setShowActivationModal(false)} />
    </div>
  );
}

function SummaryBlock({ title, onEdit, children }) {
  return (
    <section className="border border-gray-300 p-5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onEdit}
          className="text-xs text-gray-600 border border-gray-300 px-3 py-1 hover:bg-gray-50"
        >
          ✏️ Editar
        </button>
      </div>
      {children}
    </section>
  );
}

function buildTabList(ev) {
  const tabs = [
    { key: 'step1', step: 1 },
    { key: 'step2', step: 2 },
    { key: 'step3', step: 3 },
    { key: 'step4', step: 4 },
  ];
  if (ev?.hasCalibration) tabs.push({ key: 'step5', step: 5 });
  if (ev?.hasFeedback) tabs.push({ key: 'step6', step: 6 });
  tabs.push({ key: 'step7', step: 7 });
  return tabs;
}
