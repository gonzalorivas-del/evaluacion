import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { InputField } from '../InputField';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';

export default function NotificationModal({ isOpen, onClose, notification, onSave }) {
  const isEdit = !!notification;
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [sendDate, setSendDate]       = useState('');
  const [sendOnPublish, setSendOnPublish] = useState(true);
  const [errors, setErrors]           = useState({});

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
    if (!name.trim())        errs.name        = 'El nombre es obligatorio.';
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar notificación' : 'Nueva notificación'}
      size="sm"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <InputField
          label="Nombre de notificación"
          value={name}
          onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: undefined })); }}
          placeholder="Ingresar nombre de notificación"
          fieldState={errors.name ? 'error' : 'default'}
          supportingText={errors.name}
          hideIcon
        />

        <Textarea
          label="Descripción"
          value={description}
          onChange={val => { setDescription(val.slice(0, 255)); setErrors(er => ({ ...er, description: undefined })); }}
          placeholder="Descripción de la notificación..."
          maxLength={255}
          fieldState={errors.description ? 'error' : 'default'}
          supportingText={errors.description}
        />

        <InputField
          label="Seleccionar fecha de envío (opcional)"
          type="date"
          value={sendDate}
          onChange={e => {
            setSendDate(e.target.value);
            if (e.target.value) setSendOnPublish(false);
          }}
          hideIcon
        />

        <Checkbox
          label="Enviar una vez la evaluación sea publicada"
          checked={sendOnPublish}
          onChange={val => {
            setSendOnPublish(val);
            if (val) setSendDate('');
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid #B6CEE7',
      }}>
        <Button variant="secondary" size="md" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" size="md" onClick={handleSave}>
          {isEdit ? 'Guardar cambios' : 'Crear notificación'}
        </Button>
      </div>
    </Modal>
  );
}
