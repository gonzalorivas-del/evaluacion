import { useState } from 'react';
import Modal from '../ui/Modal';

export default function AddSectionModal({ isOpen, onClose, currentWeighting, onAdd }) {
  const [name, setName] = useState('');
  const [percentage, setPercentage] = useState('');
  const [errors, setErrors] = useState({});

  const totalExisting = currentWeighting.competencies + currentWeighting.objectives +
    (currentWeighting.additionalSections || []).reduce((s, sec) => s + (sec.percentage || 0), 0);
  const projected = totalExisting + Number(percentage || 0);

  const handleAdd = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'El nombre es obligatorio.';
    if (!percentage) errs.percentage = 'El porcentaje es obligatorio.';
    if (projected > 100) errs.percentage = `El total sería ${projected}%. Ajusta las otras secciones.`;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onAdd({ id: Date.now(), name: name.trim(), percentage: Number(percentage) });
    setName(''); setPercentage(''); setErrors({});
    onClose();
  };

  const handleClose = () => {
    setName(''); setPercentage(''); setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nueva sección de ponderación" size="sm">
      <p className="text-sm text-gray-600 mb-4">Todas las secciones deben sumar 100%.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Nombre de la sección <span className="text-gray-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: undefined })); }}
            placeholder="Ej: Liderazgo, Actitud, Potencial..."
            className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Porcentaje <span className="text-gray-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={percentage}
              onChange={e => { setPercentage(e.target.value); setErrors(er => ({ ...er, percentage: undefined })); }}
              className={`w-24 border px-3 py-2 text-sm focus:outline-none ${errors.percentage ? 'border-red-400' : 'border-gray-300'}`}
            />
            <span className="text-sm text-gray-600">%</span>
          </div>
          {percentage && (
            <p className={`text-xs mt-1 ${projected > 100 ? 'text-red-600' : 'text-gray-500'}`}>
              Con esta sección, el total será: Competencias {currentWeighting.competencies}% + Objetivos {currentWeighting.objectives}%
              {(currentWeighting.additionalSections || []).map(s => ` + ${s.name} ${s.percentage}%`)}
              {name ? ` + ${name} ${percentage}%` : ` + [sección] ${percentage}%`} = <strong>{projected}%</strong>
              {projected > 100 && ` ⚠️`}
            </p>
          )}
          {errors.percentage && <p className="text-xs text-red-600 mt-1">{errors.percentage}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={handleClose} className="px-4 py-2 text-sm border border-gray-300 text-gray-700">
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm border border-gray-900 bg-gray-900 text-white hover:bg-gray-700"
        >
          Agregar sección
        </button>
      </div>
    </Modal>
  );
}
