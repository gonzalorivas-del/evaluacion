import { useEvaluation } from '../../context/EvaluationContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useEvaluation();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 bg-gray-900 text-white px-4 py-3 border border-gray-700 min-w-[280px] max-w-sm"
        >
          <span className="text-sm flex-1">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="text-gray-400 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
