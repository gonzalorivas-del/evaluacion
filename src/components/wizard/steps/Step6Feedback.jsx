import { useEvaluation } from '../../../context/EvaluationContext';

export default function Step6Feedback() {
  const { currentEval, updateCurrentEval, saveCurrentEval, setActiveStep } = useEvaluation();

  if (!currentEval) return null;
  const ev = currentEval;

  const handleSaveAndContinue = () => {
    saveCurrentEval(6);
    setActiveStep(7);
  };

  const handleCancel = () => {
    setActiveStep(2);
  };

  const mustConfirmReading = ev.feedbackOptions.collaboratorMustConfirmReading;

  return (
    <div className="space-y-6">
      {/* Acceso a resultados */}
      <section className="border border-gray-300 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Acceso a resultados</h3>
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={mustConfirmReading}
              onChange={e => {
                const val = e.target.checked;
                updateCurrentEval(prev => ({
                  ...prev,
                  feedbackOptions: { ...prev.feedbackOptions, collaboratorMustConfirmReading: val },
                  advancedOptions: { ...prev.advancedOptions, requireDigitalSignature: val },
                }));
              }}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm text-gray-900">
                El colaborador debe confirmar haber leído su evaluación para que quede registrada como entregada.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Cuando el colaborador abra su evaluación en el Portal del Colaborador, deberá aceptar explícitamente que ha leído los resultados.
              </p>
            </div>
          </label>

          {mustConfirmReading && (
            <div className="flex items-start gap-3 ml-6 opacity-60">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-0.5 cursor-not-allowed"
              />
              <div>
                <p className="text-sm text-gray-900">El colaborador debe firmar digitalmente para aceptar los resultados.</p>
                <p className="text-xs text-gray-500 mt-1">
                  Requerido cuando la confirmación de lectura está activa.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Comentarios generales */}
      <section className="border border-gray-300 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Comentarios generales</h3>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ev.advancedOptions.enableGeneralComments}
            onChange={e => updateCurrentEval(prev => ({
              ...prev,
              advancedOptions: { ...prev.advancedOptions, enableGeneralComments: e.target.checked },
            }))}
            className="mt-0.5"
          />
          <div>
            <p className="text-sm text-gray-900">Habilitar comentarios generales al final del formulario.</p>
            <p className="text-xs text-gray-500 mt-1">
              Agrega un campo de texto libre al final del formulario de evaluación para que el evaluador pueda incluir observaciones generales.
            </p>
          </div>
        </label>
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button onClick={handleCancel} className="px-4 py-2 text-sm border border-gray-400 text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="px-5 py-2 text-sm font-medium bg-gray-900 text-white border border-gray-900 hover:bg-gray-700"
        >
          Guardar y continuar →
        </button>
      </div>
    </div>
  );
}
