import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', hideClose = false }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div
        className={`bg-white w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto border border-gray-400`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {!hideClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 text-xl font-bold leading-none"
              aria-label="Cerrar"
            >
              ×
            </button>
          )}
        </div>
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
