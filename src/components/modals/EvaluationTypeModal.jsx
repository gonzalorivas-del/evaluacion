import { useState } from 'react';
import Modal from '../ui/Modal';
import { useEvaluation } from '../../context/EvaluationContext';
import { TEMPLATE_CONFIGS } from '../../data/constants';

export default function EvaluationTypeModal() {
  const { showTypeModal, setShowTypeModal, createEvaluation } = useEvaluation();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!selectedTemplate) errs.template = 'Selecciona una plantilla.';
    if (!name.trim()) errs.name = 'El nombre no puede estar vacío.';
    if (!startDate) errs.startDate = 'Indica la fecha de inicio.';
    if (!endDate) errs.endDate = 'Indica la fecha de término.';
    if (startDate && endDate && endDate <= startDate) errs.endDate = 'La fecha de término debe ser posterior a la de inicio.';
    return errs;
  };

  const handleCreate = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    createEvaluation(name, startDate, endDate, selectedTemplate);
    // reset
    setSelectedTemplate(null); setName(''); setStartDate(''); setEndDate(''); setErrors({});
  };

  const handleClose = () => {
    setShowTypeModal(false);
    setSelectedTemplate(null); setName(''); setStartDate(''); setEndDate(''); setErrors({});
  };

  const isValid = selectedTemplate && name.trim() && startDate && endDate && endDate > startDate;

  const templates = [
    { id: '90', ...TEMPLATE_CONFIGS['90'] },
    { id: '180', ...TEMPLATE_CONFIGS['180'] },
    { id: '360', ...TEMPLATE_CONFIGS['360'] },
    { id: 'custom', ...TEMPLATE_CONFIGS['custom'] },
  ];

  return (
    <Modal isOpen={showTypeModal} onClose={handleClose} title="¿Qué tipo de evaluación quieres crear?" size="lg">
      <p className="text-sm text-gray-600 mb-6">
        Elige una plantilla para comenzar rápido, o crea una desde cero.
      </p>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {templates.map(tpl => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => { setSelectedTemplate(tpl.id); setErrors(e => ({ ...e, template: undefined })); }}
            className={`text-left p-4 border-2 transition-colors ${
              selectedTemplate === tpl.id
                ? 'border-gray-900 bg-gray-100'
                : 'border-gray-300 bg-white hover:border-gray-500'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <span className="font-semibold text-sm text-gray-900">
                {tpl.label} {tpl.subtitle && <span className="font-normal text-gray-600">— {tpl.subtitle}</span>}
              </span>
              {tpl.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs border border-gray-900 bg-gray-900 text-white shrink-0">
                  {tpl.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{tpl.description}</p>
            {selectedTemplate === tpl.id && (
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-900">
                <span>✓</span>
                <span>Seleccionada</span>
              </div>
            )}
          </button>
        ))}
      </div>
      {errors.template && <p className="text-xs text-red-600 -mt-4 mb-4">{errors.template}</p>}

      {/* Basic data */}
      <div className="border-t border-gray-200 pt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Nombre de la evaluación <span className="text-gray-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: undefined })); }}
            placeholder="Ej: Evaluación de Desempeño Anual 2026"
            className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.name ? 'border-red-400' : 'border-gray-300 focus:border-gray-500'}`}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Fecha de inicio <span className="text-gray-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setErrors(er => ({ ...er, startDate: undefined, endDate: undefined })); }}
              className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.startDate ? 'border-red-400' : 'border-gray-300 focus:border-gray-500'}`}
            />
            {errors.startDate && <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>}
            <p className="text-xs text-gray-400 mt-1">Fecha estimada. Las fechas de cada etapa se configuran por separado.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Fecha de término <span className="text-gray-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setErrors(er => ({ ...er, endDate: undefined })); }}
              className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.endDate ? 'border-red-400' : 'border-gray-300 focus:border-gray-500'}`}
            />
            {errors.endDate && <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-sm border border-gray-400 text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreate}
          disabled={!isValid}
          className={`px-5 py-2 text-sm font-medium border transition-colors ${
            isValid
              ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-700'
              : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          Crear evaluación →
        </button>
      </div>
    </Modal>
  );
}
