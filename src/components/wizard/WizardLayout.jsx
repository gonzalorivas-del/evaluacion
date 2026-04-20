import { useEvaluation } from '../../context/EvaluationContext';
import { TEMPLATE_CONFIGS } from '../../data/constants';
import { Breadcrumb } from '../Breadcrumb';
import { Tabs } from '../Tabs';
import Step1ProcessData from './steps/Step1ProcessData';
import Step2Structure from './steps/Step2Structure';
import Step3Form from './steps/Step3Form';
import Step4Summary from './steps/Step4Summary';
import Step5Calibration from './steps/Step5Calibration';
import Step6Feedback from './steps/Step6Feedback';
import Step7Notifications from './steps/Step7Notifications';

/** Formatea fecha ISO (YYYY-MM-DD) a DD/MM/YYYY */
function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function buildTabs(ev) {
  const tabs = [
    { step: 1, key: 'step1', label: 'Datos del proceso' },
    { step: 2, key: 'step2', label: 'Estructura' },
    { step: 3, key: 'step3', label: 'Formulario' },
  ];
  if (ev?.hasCalibration) tabs.push({ step: 5, key: 'step5', label: 'Calibración', conditional: true });
  if (ev?.hasFeedback)    tabs.push({ step: 6, key: 'step6', label: 'Retroalimentación', conditional: true });
  tabs.push({ step: 7, key: 'step7', label: 'Notificaciones' });
  tabs.push({ step: 4, key: 'step4', label: 'Resumen y activación' });
  return tabs;
}

export default function WizardLayout() {
  const { currentEval, activeStep, setActiveStep, setView } = useEvaluation();

  if (!currentEval) return null;
  const ev = currentEval;
  const tabs = buildTabs(ev);

  /* ── navegación entre pasos ───────────────────────────────────────────── */
  const canNavigateTo = (tab, tabIndex) => {
    if (tab.step === activeStep) return true;
    if (tabIndex === 0) return true;
    const prevTab = tabs[tabIndex - 1];
    return ev.tabStates[prevTab.key] === 'complete';
  };

  /* ── datos para el componente Tabs ───────────────────────────────────── */
  const activeTabKey = tabs.find(t => t.step === activeStep)?.key;

  const completedTabKeys = tabs
    .filter(t => ev.tabStates[t.key] === 'complete')
    .map(t => t.key);

  const tabDefs = tabs.map((tab, index) => ({
    key: tab.key,
    label: tab.label,
    disabled: !canNavigateTo(tab, index),
  }));

  const handleTabClick = (key) => {
    const tab = tabs.find(t => t.key === key);
    if (tab) setActiveStep(tab.step);
  };

  /* ── datos para el Breadcrumb ────────────────────────────────────────── */
  const templateInfo = ev.template ? TEMPLATE_CONFIGS[ev.template] : null;
  const templateLabel = templateInfo ? templateInfo.label : '';

  const dateRange =
    ev.startDate && ev.endDate
      ? `${formatDate(ev.startDate)} → ${formatDate(ev.endDate)}`
      : '';
  const subheadText = [dateRange, templateLabel ? `Evaluación ${templateLabel}` : '']
    .filter(Boolean)
    .join('  - ');

  /* ── títulos de cada paso (usados en el encabezado del contenido) ────── */
  const stepTitles = {
    1: {
      title: 'Datos del proceso de Evaluación de Desempeño',
      subtitle: 'Define cómo funciona este proceso: quién evalúa, cómo se calcula el resultado y si habrá etapas adicionales.',
    },
    2: {
      title: 'Estructura de la evaluación',
      subtitle: 'Define cómo funciona este proceso: quién evalúa, cómo se calcula el resultado y si habrá etapas adicionales.',
    },
    3: {
      title: 'Formulario de evaluación',
      subtitle: 'Define qué se va a evaluar y cómo se va a preguntar.',
    },
    4: {
      title: 'Resumen y activación',
      subtitle: 'Revisa la configuración completa antes de activar.',
    },
    5: {
      title: 'Calibración',
      subtitle: 'Configura el proceso de calibración de resultados.',
    },
    6: {
      title: 'Retroalimentación',
      subtitle: 'Configura la entrega de feedback formal al colaborador.',
    },
    7: {
      title: 'Notificaciones',
      subtitle: 'Configura cuándo y cómo se notificará a los participantes.',
    },
  };

  const currentStepInfo = stepTitles[activeStep] || {};

  const renderStep = () => {
    switch (activeStep) {
      case 1:  return <Step1ProcessData />;
      case 2:  return <Step2Structure />;
      case 3:  return <Step3Form />;
      case 4:  return <Step4Summary />;
      case 5:  return <Step5Calibration />;
      case 6:  return <Step6Feedback />;
      case 7:  return <Step7Notifications />;
      default: return <Step1ProcessData />;
    }
  };

  /* ── render ───────────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: '#F6F9FA' }}>

      {/* ── Breadcrumb sticky ──────────────────────────────────────────── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: '#F6F9FA',
        padding: '24px 60px 0',
      }}>
        <Breadcrumb
          breadcrumb="/ Evaluaciones /"
          title={ev.name || 'Nueva evaluación'}
          badge="Borrador"
          subhead={subheadText || undefined}
          onBack={() => setView('list')}
        />
      </div>

      {/* ── Contenedor principal (card blanca) ────────────────────────── */}
      <div style={{ padding: '24px 60px 32px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.15)',
          paddingTop: '24px',
          paddingBottom: '32px',
        }}>

          {/* Tabs — dentro de la card, padding lateral 32px */}
          <div style={{ paddingLeft: '32px', paddingRight: '32px' }}>
            <Tabs
              tabs={tabDefs}
              activeKey={activeTabKey}
              completedKeys={completedTabKeys}
              onTabClick={handleTabClick}
            />
          </div>

          {/* Encabezado del paso — centrado a max 998px */}
          <div style={{
            maxWidth: '998px',
            margin: '32px auto 24px',
            paddingLeft: '32px',
            paddingRight: '32px',
          }}>
            <p style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '1.3',
              color: '#1E5591',
              margin: 0,
            }}>
              {currentStepInfo.title}
            </p>
            {currentStepInfo.subtitle && (
              <p style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '1.3',
                color: '#5780AD',
                margin: '4px 0 0',
              }}>
                {currentStepInfo.subtitle}
              </p>
            )}
          </div>

          {/* Contenido del paso — centrado a max 998px */}
          <div style={{ paddingLeft: '32px', paddingRight: '32px' }}>
            <div style={{
              maxWidth: '998px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}>
              {renderStep()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
