import { EvaluationProvider, useEvaluation } from './context/EvaluationContext';
import EvaluationList from './components/EvaluationList';
import EvaluationTypeModal from './components/modals/EvaluationTypeModal';
import WizardLayout from './components/wizard/WizardLayout';
import ToastContainer from './components/ui/Toast';
import ComponentsShowroom from './components/ComponentsShowroom';

function AppContent() {
  const { view, setView } = useEvaluation();

  return (
    <div>
      {view === 'list' && <EvaluationList />}
      {view === 'wizard' && <WizardLayout />}
      {view === 'showroom' && <ComponentsShowroom />}
      {view !== 'showroom' && (
        <>
          <EvaluationTypeModal />
          <ToastContainer />
          <button
            onClick={() => setView('showroom')}
            style={{
              position: 'fixed',
              bottom: '14px',
              left: '16px',
              fontSize: '12px',
              color: '#9aafc5',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              zIndex: 9999,
              fontFamily: 'Roboto, sans-serif',
              lineHeight: 1,
            }}
          >
            Ver componentes
          </button>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <EvaluationProvider>
      <AppContent />
    </EvaluationProvider>
  );
}
