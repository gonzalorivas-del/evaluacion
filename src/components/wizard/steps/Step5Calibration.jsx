import { useEvaluation } from '../../../context/EvaluationContext';

export default function Step5Calibration() {
  const { currentEval, updateCurrentEval, saveCurrentEval, setActiveStep, addToast } = useEvaluation();

  if (!currentEval) return null;
  const ev = currentEval;

  const updateCalibOption = (key, value) => {
    updateCurrentEval(prev => ({
      ...prev,
      calibrationOptions: { ...prev.calibrationOptions, [key]: value }
    }));
  };

  const handleSaveAndContinue = () => {
    if (!ev.calibrationType) {
      // Show error — handled via UI
      return;
    }
    saveCurrentEval(5);
    // Navigate to next step: feedback if enabled, else notifications
    if (ev.hasFeedback) {
      setActiveStep(6);
    } else {
      setActiveStep(7);
    }
  };

  const handleCancel = () => {
    setActiveStep(2);
  };

  const [expandedAdvanced, setExpandedAdvanced] = [
    ev.calibrationOptions._advancedExpanded || false,
    (v) => updateCalibOption('_advancedExpanded', v)
  ];

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <div className="border-l-4 border-gray-900 pl-4 py-1">
        <p className="text-sm text-gray-800">
          Selecciona el tipo de calibración que utilizarás en el proceso de Evaluación de Desempeño.
        </p>
      </div>

      {/* Type selection */}
      <div className="grid grid-cols-2 gap-4">
        <CalibrationCard
          title="Calibración por Ninebox"
          description="Posicionamiento de colaboradores en una matriz 9 cuadrantes que combina desempeño y potencial. Se realiza directamente desde la plataforma de Administración de Desempeño."
          selected={ev.calibrationType === 'ninebox'}
          onSelect={() => updateCurrentEval({ calibrationType: 'ninebox' })}
        />
        <CalibrationCard
          title="Calibración vía Portal del Colaborador"
          description="Los evaluadores revisan y proponen ajustes a los resultados desde el Portal del Colaborador. Permite la formación de comités de revisión."
          selected={ev.calibrationType === 'portal'}
          onSelect={() => updateCurrentEval({ calibrationType: 'portal' })}
        />
      </div>

      {/* No selection error */}
      {ev.calibrationType === null && (
        <p className="text-xs text-gray-500 italic">Selecciona un tipo de calibración para continuar.</p>
      )}

      {/* Ninebox confirmation */}
      {ev.calibrationType === 'ninebox' && (
        <div className="border border-gray-300 bg-gray-50 px-5 py-4 text-sm text-gray-700">
          <p>Haz seleccionado realizar el proceso de calibración mediante: <strong>Ninebox</strong>.</p>
          <p className="text-xs text-gray-500 mt-1">Este proceso se realiza directamente desde la plataforma de Administración de Desempeño.</p>
        </div>
      )}

      {/* Portal sections */}
      {ev.calibrationType === 'portal' && (
        <>
          <div className="border border-gray-300 bg-gray-50 px-5 py-4 text-sm text-gray-700">
            <p>Haz seleccionado realizar el proceso de calibración mediante: <strong>Calibración vía Portal del Colaborador</strong>.</p>
            <p className="text-xs text-gray-500 mt-1">Este proceso se realiza directamente desde el Portal del Colaborador.</p>
          </div>

          {/* Committee formation */}
          <section className="border border-gray-300 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Formación de comités</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ev.calibrationOptions.bossIsCommitteeMember}
                  onChange={e => updateCalibOption('bossIsCommitteeMember', e.target.checked)}
                />
                <span className="text-sm text-gray-800">El jefe del evaluador es integrante</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ev.calibrationOptions.evaluatorIsCoordinator}
                  onChange={e => updateCalibOption('evaluatorIsCoordinator', e.target.checked)}
                />
                <span className="text-sm text-gray-800">El evaluador es coordinador</span>
              </label>
            </div>
          </section>

          {/* Advanced configuration */}
          <section className="border border-gray-300">
            <button
              type="button"
              onClick={() => updateCalibOption('_advancedExpanded', !ev.calibrationOptions._advancedExpanded)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
            >
              <p className="text-sm font-semibold text-gray-900">Configuración avanzada</p>
              <span className="text-gray-500 text-sm">
                {ev.calibrationOptions._advancedExpanded ? '▲' : '▼'}
              </span>
            </button>
            {ev.calibrationOptions._advancedExpanded && (
              <div className="px-5 pb-5 border-t border-gray-200">
                <div className="pt-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ev.calibrationOptions.canProposeWithoutValue}
                      onChange={e => updateCalibOption('canProposeWithoutValue', e.target.checked)}
                    />
                    <span className="text-sm text-gray-800">Se puede proponer sin valor</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ev.calibrationOptions.finalValueValidatedByMember}
                      onChange={e => updateCalibOption('finalValueValidatedByMember', e.target.checked)}
                    />
                    <span className="text-sm text-gray-800">Valor final debe ser validado por Miembro</span>
                  </label>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button onClick={handleCancel} className="px-4 py-2 text-sm border border-gray-400 text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button
          onClick={handleSaveAndContinue}
          disabled={!ev.calibrationType}
          className={`px-5 py-2 text-sm font-medium border transition-colors ${
            ev.calibrationType
              ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-700'
              : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          Guardar y continuar →
        </button>
      </div>
    </div>
  );
}

function CalibrationCard({ title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left p-5 border-2 transition-colors ${
        selected ? 'border-gray-900 bg-gray-100' : 'border-gray-300 bg-white hover:border-gray-500'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 mb-2">{title}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        </div>
        <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 ${
          selected ? 'border-gray-900 bg-gray-900' : 'border-gray-400 bg-white'
        }`} />
      </div>
      {selected && (
        <p className="text-xs text-gray-900 font-medium mt-3">✓ Seleccionada</p>
      )}
    </button>
  );
}
