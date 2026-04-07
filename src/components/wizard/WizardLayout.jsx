import { useEvaluation } from '../../context/EvaluationContext';
import { TEMPLATE_CONFIGS } from '../../data/constants';
import Step1ProcessData from './steps/Step1ProcessData';
import Step2Structure from './steps/Step2Structure';
import Step3Form from './steps/Step3Form';
import Step4Summary from './steps/Step4Summary';
import Step5Calibration from './steps/Step5Calibration';
import Step6Feedback from './steps/Step6Feedback';
import Step7Notifications from './steps/Step7Notifications';

function buildTabs(ev) {
  const tabs = [
    { step: 1, key: 'step1', label: 'Datos del proceso' },
    { step: 2, key: 'step2', label: 'Estructura' },
    { step: 3, key: 'step3', label: 'Formulario' },
  ];
  if (ev?.hasCalibration) tabs.push({ step: 5, key: 'step5', label: 'Calibración', conditional: true });
  if (ev?.hasFeedback) tabs.push({ step: 6, key: 'step6', label: 'Retroalimentación', conditional: true });
  tabs.push({ step: 7, key: 'step7', label: 'Notificaciones' });
  tabs.push({ step: 4, key: 'step4', label: 'Resumen y activación' }); // always last
  return tabs;
}

const TAB_STATE_ICON = {
  complete: '✅',
  progress: '🔘',
  pending: '⚪',
  warning: '⚠️',
};

export default function WizardLayout() {
  const { currentEval, activeStep, setActiveStep, setView, saveDraft } = useEvaluation();

  if (!currentEval) return null;
  const ev = currentEval;
  const tabs = buildTabs(ev);

  const getTabState = (tab) => {
    if (tab.step === activeStep) return 'progress';
    if (ev.tabStates[tab.key] === 'complete') return 'complete';
    return 'pending';
  };

  const canNavigateTo = (tab, tabIndex) => {
    if (tab.step === activeStep) return true;
    if (tabIndex === 0) return true;
    const prevTab = tabs[tabIndex - 1];
    return ev.tabStates[prevTab.key] === 'complete';
  };

  const templateInfo = ev.template ? TEMPLATE_CONFIGS[ev.template] : null;
  const templateLabel = templateInfo ? `${templateInfo.label}${templateInfo.subtitle ? ` — ${templateInfo.subtitle}` : ''}` : '—';

  const renderStep = () => {
    switch (activeStep) {
      case 1: return <Step1ProcessData />;
      case 2: return <Step2Structure />;
      case 3: return <Step3Form />;
      case 4: return <Step4Summary />;
      case 5: return <Step5Calibration />;
      case 6: return <Step6Feedback />;
      case 7: return <Step7Notifications />;
      default: return <Step1ProcessData />;
    }
  };

  const stepTitles = {
    1: { title: 'Datos del proceso', subtitle: 'Información básica sobre esta evaluación.' },
    2: { title: 'Estructura de la evaluación', subtitle: 'Define cómo funciona este proceso: quién evalúa, cómo se calcula el resultado y si habrá etapas adicionales.' },
    3: { title: 'Formulario de evaluación', subtitle: 'Define qué se va a evaluar y cómo se va a preguntar.' },
    4: { title: 'Resumen y activación', subtitle: 'Revisa la configuración completa antes de activar.' },
    5: { title: 'Calibración', subtitle: 'Configura el proceso de calibración de resultados.' },
    6: { title: 'Retroalimentación', subtitle: 'Configura la entrega de feedback formal al colaborador.' },
    7: { title: 'Notificaciones', subtitle: 'Configura cuándo y cómo se notificará a los participantes.' },
  };

  const currentStepInfo = stepTitles[activeStep] || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-300 sticky top-0 z-30">
        {/* Breadcrumb + meta */}
        <div className="px-6 py-2.5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setView('list')}
              className="text-xs text-gray-500 hover:text-gray-900 border-b border-transparent hover:border-gray-500"
            >
              ← Volver a Evaluaciones
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-semibold text-gray-900 truncate max-w-xs">
              {ev.name || 'Nueva evaluación'}
            </span>
            <span className="text-xs text-gray-400 border border-gray-300 px-2 py-0.5">{templateLabel}</span>
            {ev.startDate && (
              <span className="text-xs text-gray-500">{ev.startDate} → {ev.endDate}</span>
            )}
            {ev.isPrivate && (
              <span className="text-xs border border-gray-900 px-2 py-0.5">🔒 Privada</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {ev.lastSaved && (
              <span className="text-xs text-gray-400">Guardado automáticamente {ev.lastSaved}</span>
            )}
            <span className="text-xs border border-gray-300 px-2 py-0.5 text-gray-500">
              Borrador
            </span>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex overflow-x-auto">
          {tabs.map((tab, tabIndex) => {
            const state = getTabState(tab);
            const canNav = canNavigateTo(tab, tabIndex);
            return (
              <button
                key={tab.step}
                onClick={() => canNav && setActiveStep(tab.step)}
                disabled={!canNav}
                title={!canNav ? 'Completa el paso anterior para continuar.' : undefined}
                className={`flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  state === 'progress'
                    ? 'border-gray-900 text-gray-900 font-semibold bg-white'
                    : canNav
                    ? 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 bg-white'
                    : 'border-transparent text-gray-300 cursor-not-allowed bg-white'
                }`}
              >
                <span className="text-xs">{TAB_STATE_ICON[state]}</span>
                <span>{tab.label}</span>
                {tab.conditional && (
                  <span className="text-xs border border-gray-300 px-1 py-0.5 text-gray-400 ml-1">Opcional</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Step header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">{currentStepInfo.title}</h1>
          {currentStepInfo.subtitle && (
            <p className="text-sm text-gray-600 mt-1">{currentStepInfo.subtitle}</p>
          )}
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
