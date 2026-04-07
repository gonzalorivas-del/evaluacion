import { useEvaluation } from '../context/EvaluationContext';
import { TEMPLATE_CONFIGS, createInitialEvaluation } from '../data/constants';

const VIEWS = [
  { label: 'Lista', group: 'Lista' },
  { label: 'Modal tipo', group: 'Modal' },
  { label: 'Paso 1', group: 'Wizard', step: 1 },
  { label: 'Paso 2', group: 'Wizard', step: 2 },
  { label: 'Paso 3', group: 'Wizard', step: 3 },
  { label: 'Paso 4', group: 'Wizard', step: 4 },
  { label: 'Paso 5', group: 'Wizard', step: 5 },
  { label: 'Paso 6', group: 'Wizard', step: 6 },
  { label: 'Paso 7', group: 'Wizard', step: 7 },
];

function mockEval(step) {
  const ev = createInitialEvaluation();
  ev.name = 'Evaluación de Desempeño 2025';
  ev.startDate = '01/04/2025';
  ev.endDate = '30/06/2025';
  ev.template = '180';
  ev.hasCalibration = true;
  ev.hasFeedback = true;
  const cfg = TEMPLATE_CONFIGS['180'];
  if (cfg.directions) Object.keys(cfg.directions).forEach(k => {
    ev.directions[k] = { ...ev.directions[k], ...cfg.directions[k] };
  });
  ev.scale = cfg.scale;
  ev.formType = cfg.formType;
  ev.weighting = { ...ev.weighting, ...cfg.weighting };
  ev.competencyOrigin = cfg.competencyOrigin;
  ev.calibrationType = 'ninebox';
  ev.notificationsVisited = true;
  if (step >= 2) ev.tabStates.step1 = 'complete';
  if (step >= 3) ev.tabStates.step2 = 'complete';
  if (step >= 4) { ev.tabStates.step3 = 'complete'; ev.tabStates.step5 = 'complete'; ev.tabStates.step6 = 'complete'; ev.tabStates.step7 = 'complete'; }
  if (step === 5) ev.tabStates.step3 = 'complete';
  if (step === 6) { ev.tabStates.step3 = 'complete'; ev.tabStates.step5 = 'complete'; }
  if (step === 7) { ev.tabStates.step3 = 'complete'; ev.tabStates.step5 = 'complete'; ev.tabStates.step6 = 'complete'; }
  return ev;
}

export default function DevToolbar() {
  const {
    view, setView,
    activeStep, setActiveStep,
    setCurrentEval,
    showTypeModal, setShowTypeModal,
  } = useEvaluation();

  const activeKey = showTypeModal
    ? 'Modal tipo'
    : view === 'list'
    ? 'Lista'
    : `Paso ${activeStep}`;

  function navigate(item) {
    if (item.group === 'Lista') {
      setShowTypeModal(false);
      setCurrentEval(null);
      setView('list');
    } else if (item.group === 'Modal') {
      setCurrentEval(null);
      setView('list');
      setShowTypeModal(true);
    } else if (item.group === 'Wizard') {
      setShowTypeModal(false);
      setCurrentEval(mockEval(item.step));
      setActiveStep(item.step);
      setView('wizard');
    }
  }

  // Group separators
  const groups = [
    { title: null, items: VIEWS.filter(v => v.group === 'Lista' || v.group === 'Modal') },
    { title: 'Wizard', items: VIEWS.filter(v => v.group === 'Wizard') },
  ];

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
      className="flex items-center gap-0 bg-gray-950 border-b border-gray-800 px-3 h-9 text-xs font-mono select-none"
    >
      {/* Label */}
      <span className="text-gray-500 mr-3 shrink-0">⬡ dev</span>

      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center">
          {gi > 0 && <span className="w-px h-4 bg-gray-700 mx-2" />}
          {group.title && (
            <span className="text-gray-600 mr-2 uppercase tracking-wider text-[10px]">
              {group.title}
            </span>
          )}
          {group.items.map(item => {
            const isActive = activeKey === item.label;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item)}
                className={`px-2.5 py-1 rounded transition-colors mr-0.5 ${
                  isActive
                    ? 'bg-white text-gray-950 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ))}

      <span className="ml-auto text-gray-600">Prototipo Rex+ Desempeño v4.0</span>
    </div>
  );
}
