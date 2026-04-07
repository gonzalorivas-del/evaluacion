import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

export default function NotificationModal({ isOpen, onClose, notification, onSave }) {
  const isEdit = !!notification;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sendDate, setSendDate] = useState('');
  const [sendOnPublish, setSendOnPublish] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setName(notification?.name || '');
      setDescription(notification?.description || '');
      setSendDate(notification?.sendDate || '');
      setSendOnPublish(notification?.sendOnPublish ?? true);
      setErrors({});
    }
  }, [isOpen, notification]);

  const handleSave = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'El nombre es obligatorio.';
    if (!description.trim()) errs.description = 'La descripción es obligatoria.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    onSave({
      id: notification?.id || Date.now(),
      name: name.trim(),
      description: description.trim(),
      sendDate,
      sendOnPublish,
      condition: sendDate
        ? `Se enviará el ${sendDate}`
        : 'Se enviará una vez se haya iniciado la evaluación',
      isDefault: notification?.isDefault || false,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar notificación' : 'Nueva notificación'} size="sm">
      <div className="text-center mb-4">
        <span className="text-3xl">🔔</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Nombre de notificación <span className="text-gray-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: undefined })); }}
            placeholder="Ingresar nombre de notificación"
            className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Descripción <span className="text-gray-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={e => { setDescription(e.target.value.slice(0, 255)); setErrors(er => ({ ...er, description: undefined })); }}
            placeholder="Descripción de la notificación..."
            rows={3}
            className={`w-full border px-3 py-2 text-sm focus:outline-none resize-none ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
          />
          <p className="text-xs text-gray-400 text-right mt-0.5">{description.length}/255</p>
          {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Seleccionar fecha de envío
            <span className="text-gray-400 font-normal ml-1">(opcional)</span>
          </label>
          <input
            type="date"
            value={sendDate}
            onChange={e => {
              setSendDate(e.target.value);
              if (e.target.value) setSendOnPublish(false);
            }}
            className="border border-gray-300 px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sendOnPublish}
            onChange={e => {
              setSendOnPublish(e.target.checked);
              if (e.target.checked) setSendDate('');
            }}
            className="mt-0.5"
          />
          <span className="text-sm text-gray-700">Enviar una vez la evaluación sea publicada</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 text-gray-700">
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm border border-gray-900 bg-gray-900 text-white hover:bg-gray-700"
        >
          {isEdit ? 'Guardar cambios' : 'Crear notificación'}
        </button>
      </div>
    </Modal>
  );
}
