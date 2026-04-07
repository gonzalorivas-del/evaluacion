import { EvaluationProvider, useEvaluation } from './context/EvaluationContext';
import EvaluationList from './components/EvaluationList';
import EvaluationTypeModal from './components/modals/EvaluationTypeModal';
import WizardLayout from './components/wizard/WizardLayout';
import ToastContainer from './components/ui/Toast';
function AppContent() {
  const { view } = useEvaluation();

  return (
    <div>
      {view === 'list' && <EvaluationList />}
      {view === 'wizard' && <WizardLayout />}
      <EvaluationTypeModal />
      <ToastContainer />
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
