import { useState } from 'react';
import Modal from '../ui/Modal';
import { DIRECTION_LABELS } from '../../data/constants';

export default function ScheduleModal({ isOpen, onClose, directionKey, currentSchedule, onSave }) {
  const [type, setType] = useState(currentSchedule ? 'specific' : 'immediate');
  const [date, setDate] = useState(currentSchedule?.date || '');
  const [time, setTime] = useState(currentSchedule?.time || '09:00');

  const handleSave = () => {
    if (type === 'immediate') {
      onSave(null);
    } else {
      onSave({ date, time });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Programar apertura — ${DIRECTION_LABELS[directionKey] || directionKey}`}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">¿Cuándo se abre este tipo de evaluación?</p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="scheduleType"
            value="immediate"
            checked={type === 'immediate'}
            onChange={() => setType('immediate')}
            className="mt-0.5"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">Al activar la evaluación (inmediatamente)</p>
            <p className="text-xs text-gray-500">Se abre en el momento en que se activa el proceso.</p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="scheduleType"
            value="specific"
            checked={type === 'specific'}
            onChange={() => setType('specific')}
            className="mt-0.5"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">En una fecha y hora específica</p>
          </div>
        </label>

        {type === 'specific' && (
          <div className="ml-6 flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 text-gray-700">
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={type === 'specific' && !date}
          className={`px-4 py-2 text-sm border ${
            type === 'specific' && !date
              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-900 bg-gray-900 text-white hover:bg-gray-700'
          }`}
        >
          Guardar programación
        </button>
      </div>
    </Modal>
  );
}

export function ScheduleAllModal({ isOpen, onClose, activeDirections, currentSchedules, onSave }) {
  const [schedules, setSchedules] = useState(
    activeDirections.reduce((acc, key) => {
      acc[key] = currentSchedules[key] || { type: 'immediate', date: '', time: '09:00' };
      return acc;
    }, {})
  );

  const handleSave = () => {
    onSave(schedules);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Programar apertura de evaluaciones" size="lg">
      <p className="text-sm text-gray-600 mb-4">Solo se muestran las direcciones activas con porcentaje asignado.</p>

      <table className="w-full text-sm border border-gray-200">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-3 py-2 text-gray-600 font-medium">Tipo de dirección</th>
            <th className="text-left px-3 py-2 text-gray-600 font-medium">Apertura</th>
            <th className="text-left px-3 py-2 text-gray-600 font-medium">Fecha</th>
            <th className="text-left px-3 py-2 text-gray-600 font-medium">Hora</th>
          </tr>
        </thead>
        <tbody>
          {activeDirections.map(key => (
            <tr key={key} className="border-b border-gray-100">
              <td className="px-3 py-2 font-medium text-gray-900">{DIRECTION_LABELS[key]}</td>
              <td className="px-3 py-2">
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name={`type-${key}`}
                      value="immediate"
                      checked={schedules[key]?.type === 'immediate'}
                      onChange={() => setSchedules(s => ({ ...s, [key]: { ...s[key], type: 'immediate' } }))}
                    />
                    <span className="text-xs">Inmediata</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name={`type-${key}`}
                      value="specific"
                      checked={schedules[key]?.type === 'specific'}
                      onChange={() => setSchedules(s => ({ ...s, [key]: { ...s[key], type: 'specific' } }))}
                    />
                    <span className="text-xs">Fecha</span>
                  </label>
                </div>
              </td>
              <td className="px-3 py-2">
                {schedules[key]?.type === 'specific' && (
                  <input
                    type="date"
                    value={schedules[key]?.date || ''}
                    onChange={e => setSchedules(s => ({ ...s, [key]: { ...s[key], date: e.target.value } }))}
                    className="border border-gray-300 px-2 py-1 text-xs"
                  />
                )}
              </td>
              <td className="px-3 py-2">
                {schedules[key]?.type === 'specific' && (
                  <input
                    type="time"
                    value={schedules[key]?.time || '09:00'}
                    onChange={e => setSchedules(s => ({ ...s, [key]: { ...s[key], time: e.target.value } }))}
                    className="border border-gray-300 px-2 py-1 text-xs"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-3 mt-5">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 text-gray-700">
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm border border-gray-900 bg-gray-900 text-white hover:bg-gray-700"
        >
          Guardar programación
        </button>
      </div>
    </Modal>
  );
}
