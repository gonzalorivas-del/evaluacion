import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createInitialEvaluation, TEMPLATE_CONFIGS, MOCK_EVALUATIONS, MOCK_TRANSVERSAL_COMPETENCIES } from '../data/constants';

const EvaluationContext = createContext(null);

export function EvaluationProvider({ children }) {
  const [view, setView] = useState('list'); // 'list' | 'wizard'
  const [evaluations, setEvaluations] = useState(MOCK_EVALUATIONS);
  const [currentEval, setCurrentEval] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);

  // URL hash-based preview state for Figma capture: #step=N
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const match = params.has('step') ? ['', params.get('step')] : null;
    if (match) {
      const step = parseInt(match[1], 10);
      const ev = createInitialEvaluation();
      ev.name = 'Evaluación de Desempeño 2025';
      ev.startDate = '01/04/2025';
      ev.endDate = '30/06/2025';
      ev.template = '180';
      ev.hasCalibration = true;
      ev.hasFeedback = true;
      const cfg = TEMPLATE_CONFIGS['180'];
      if (cfg.directions) Object.keys(cfg.directions).forEach(k => { ev.directions[k] = { ...ev.directions[k], ...cfg.directions[k] }; });
      ev.scale = cfg.scale;
      ev.formType = cfg.formType;
      ev.weighting = { ...ev.weighting, ...cfg.weighting };
      ev.competencyOrigin = cfg.competencyOrigin;
      // Extra URL params for specific capture states
      if (params.get('objectives') === '1') ev.weighting = { ...ev.weighting, competencies: 60, objectives: 40 };
      if (params.get('calibration') === '1') ev.hasCalibration = true;
      if (params.get('feedback') === '1') ev.hasFeedback = true;
      if (params.get('potential') === '1') ev.hasPotential = true;
      if (params.get('feedbackChecked') === '1') {
        ev.feedbackOptions = { ...ev.feedbackOptions, collaboratorMustConfirmReading: true };
        ev.advancedOptions = { ...ev.advancedOptions, requireDigitalSignature: true };
      }
      if (params.get('commentsChecked') === '1') ev.advancedOptions = { ...ev.advancedOptions, enableGeneralComments: true };
      if (params.get('transversal')) {
        const n = parseInt(params.get('transversal'), 10);
        ev.selectedTransversalCompetencies = MOCK_TRANSVERSAL_COMPETENCIES.slice(0, n).map(c => ({ ...c, percentage: Math.round(100 / n), scale: ev.scale }));
        ev.transversalPercentage = 100;
        ev.functionalPercentage = 0;
      }
      // Mark previous steps complete so nav works
      if (step >= 2) ev.tabStates.step1 = 'complete';
      if (step >= 3) ev.tabStates.step2 = 'complete';
      if (step >= 4) { ev.tabStates.step3 = 'complete'; ev.tabStates.step5 = 'complete'; ev.tabStates.step6 = 'complete'; ev.tabStates.step7 = 'complete'; ev.notificationsVisited = true; ev.calibrationType = 'ninebox'; }
      if (step === 5) { ev.tabStates.step3 = 'complete'; }
      if (step === 6) { ev.tabStates.step3 = 'complete'; ev.tabStates.step5 = 'complete'; }
      if (step === 7) { ev.tabStates.step3 = 'complete'; ev.tabStates.step5 = 'complete'; ev.tabStates.step6 = 'complete'; }
      setCurrentEval(ev);
      setActiveStep(step);
      setView('wizard');
    }
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const createEvaluation = useCallback((name, startDate, endDate, template) => {
    const ev = createInitialEvaluation();
    ev.name = name;
    ev.startDate = startDate;
    ev.endDate = endDate;
    ev.template = template;
    ev.formName = name;

    // Apply template pre-config
    if (template && TEMPLATE_CONFIGS[template]) {
      const cfg = TEMPLATE_CONFIGS[template];
      if (cfg.directions) {
        Object.keys(cfg.directions).forEach(k => {
          ev.directions[k] = { ...ev.directions[k], ...cfg.directions[k] };
        });
      }
      if (cfg.scale) ev.scale = cfg.scale;
      if (cfg.formType) ev.formType = cfg.formType;
      if (cfg.weighting) ev.weighting = { ...ev.weighting, ...cfg.weighting };
      if (cfg.competencyOrigin) ev.competencyOrigin = cfg.competencyOrigin;
    }

    setCurrentEval(ev);
    setActiveStep(1);
    setView('wizard');
    setShowTypeModal(false);
  }, []);

  const openExistingEval = useCallback((ev) => {
    setCurrentEval({ ...createInitialEvaluation(), ...ev, template: ev.template || '180' });
    setActiveStep(4); // Open at summary for existing
    setView('wizard');
  }, []);

  const updateCurrentEval = useCallback((updates) => {
    setCurrentEval(prev => {
      if (!prev) return prev;
      const updated = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      updated.lastSaved = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
      return updated;
    });
  }, []);

  const saveCurrentEval = useCallback((stepNum) => {
    setCurrentEval(prev => {
      if (!prev) return prev;
      const stepKey = `step${stepNum}`;
      const newTabStates = { ...prev.tabStates, [stepKey]: 'complete' };
      const lastSaved = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
      return { ...prev, tabStates: newTabStates, lastSaved };
    });
  }, []);

  const activateEvaluation = useCallback(() => {
    if (!currentEval) return;
    const activated = {
      id: currentEval.id,
      name: currentEval.name,
      empresa: 'Empresa A',
      startDate: currentEval.startDate,
      endDate: currentEval.endDate,
      template: TEMPLATE_CONFIGS[currentEval.template]?.label || currentEval.template,
      formType: currentEval.formType === 'single' ? 'Único' : 'Múltiple',
      stages: Object.entries(currentEval.directions)
        .filter(([, d]) => d.active)
        .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
        .join(' · '),
      status: 'Activa',
    };
    setEvaluations(prev => [activated, ...prev]);
    addToast('Evaluación activada. Los participantes serán notificados.');
    setView('list');
    setCurrentEval(null);
  }, [currentEval, addToast]);

  const saveDraft = useCallback(() => {
    if (!currentEval) return;
    const draft = {
      id: currentEval.id,
      name: currentEval.name || '(Sin nombre)',
      empresa: 'Empresa A',
      startDate: currentEval.startDate,
      endDate: currentEval.endDate,
      template: TEMPLATE_CONFIGS[currentEval.template]?.label || currentEval.template || 'Personalizada',
      formType: currentEval.formType === 'single' ? 'Único' : 'Múltiple',
      stages: Object.entries(currentEval.directions)
        .filter(([, d]) => d.active)
        .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
        .join(' · ') || '—',
      status: 'Borrador',
    };
    setEvaluations(prev => {
      const exists = prev.find(e => e.id === draft.id);
      if (exists) return prev.map(e => e.id === draft.id ? draft : e);
      return [draft, ...prev];
    });
    addToast('Borrador guardado correctamente.');
    setView('list');
    setCurrentEval(null);
  }, [currentEval, addToast]);

  return (
    <EvaluationContext.Provider value={{
      view, setView,
      evaluations, setEvaluations,
      currentEval, setCurrentEval,
      activeStep, setActiveStep,
      toasts, addToast, removeToast,
      showTypeModal, setShowTypeModal,
      createEvaluation,
      openExistingEval,
      updateCurrentEval,
      saveCurrentEval,
      activateEvaluation,
      saveDraft,
    }}>
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluation() {
  const ctx = useContext(EvaluationContext);
  if (!ctx) throw new Error('useEvaluation must be used within EvaluationProvider');
  return ctx;
}
