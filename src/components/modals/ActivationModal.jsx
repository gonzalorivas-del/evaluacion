import { useState } from 'react';
import Modal from '../ui/Modal';
import { useEvaluation } from '../../context/EvaluationContext';

export default function ActivationModal({ isOpen, onClose }) {
  const { currentEval, activateEvaluation } = useEvaluation();
  const [activating, setActivating] = useState(false);

  if (!currentEval) return null;

  const activeDirectionsCount = Object.values(currentEval.directions).filter(d => d.active).length;
  const totalPercentage = Object.values(currentEval.directions)
    .filter(d => d.active)
    .reduce((s, d) => s + Number(d.percentage || 0), 0);
  const participantCount = currentEval.scope === 'all' ? 7 : currentEval.participants.length;
  const hasFormConfig = currentEval.weighting.competencies > 0
    ? currentEval.selectedFunctionalCompetencies.length > 0 || currentEval.selectedTransversalCompetencies.length > 0
    : currentEval.weighting.objectives > 0;

  const checks = [
    { label: 'Nombre del proceso configurado', ok: !!currentEval.name.trim() },
    { label: 'Fechas del proceso configuradas', ok: !!currentEval.startDate && !!currentEval.endDate },
    { label: 'Al menos un tipo de dirección con porcentajes = 100%', ok: activeDirectionsCount > 0 && totalPercentage === 100 },
    { label: 'Formulario con competencias u objetivos configurados', ok: hasFormConfig },
    { label: `${participantCount} colaboradores incluidos`, ok: participantCount > 0 },
    ...(currentEval.hasCalibration ? [{
      label: 'Tipo de calibración seleccionado',
      ok: !!currentEval.calibrationType,
      hint: 'Ve al paso Calibración para completarlo.',
    }] : []),
    ...(currentEval.hasFeedback ? [{
      label: 'Retroalimentación configurada',
      ok: currentEval.tabStates?.step6 === 'complete',
      hint: 'Ve al paso Retroalimentación para completarlo.',
    }] : []),
    { label: 'Notificaciones revisadas', ok: !!currentEval.notificationsVisited },
  ];

  const warnings = [
    !currentEval.responsibles.length && { label: 'Sin responsable asignado', cta: 'Ir al Paso 1' },
  ].filter(Boolean);

  const hasCriticalErrors = checks.some(c => !c.ok);
  const canActivate = !hasCriticalErrors;

  const handleActivate = async () => {
    setActivating(true);
    await new Promise(r => setTimeout(r, 800));
    activateEvaluation();
    setActivating(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¿Activar la evaluación ahora?" size="md">
      <p className="text-sm text-gray-600 mb-5">
        El proceso <strong>"{currentEval.name}"</strong> será activado para {participantCount} colaboradores.
        Algunos parámetros ya no podrán modificarse.
      </p>

      {/* Checklist */}
      <div className="border border-gray-200 divide-y divide-gray-100 mb-5">
        {checks.map((c, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-2.5">
            <span className={`mt-0.5 ${c.ok ? 'text-green-600' : 'text-red-500'}`}>
              {c.ok ? '✅' : '❌'}
            </span>
            <div>
              <span className={`text-sm ${c.ok ? 'text-gray-700' : 'text-red-700'}`}>{c.label}</span>
              {!c.ok && c.hint && (
                <p className="text-xs text-red-500 mt-0.5">{c.hint}</p>
              )}
            </div>
          </div>
        ))}
        {warnings.map((w, i) => (
          <div key={`w-${i}`} className="flex items-center gap-3 px-4 py-2.5 bg-yellow-50">
            <span>⚠️</span>
            <span className="text-sm text-yellow-800 flex-1">{w.label}</span>
            {w.cta && (
              <button onClick={onClose} className="text-xs text-blue-600 underline">{w.cta}</button>
            )}
          </div>
        ))}
      </div>

      {hasCriticalErrors && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 mb-4 text-sm text-red-700">
          Completa los puntos pendientes antes de activar la evaluación.
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleActivate}
          disabled={!canActivate || activating}
          className={`px-5 py-2 text-sm font-medium border transition-colors ${
            canActivate && !activating
              ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-700'
              : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          {activating ? 'Activando...' : 'Confirmar y activar'}
        </button>
      </div>
    </Modal>
  );
}
