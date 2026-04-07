import { useState } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import NotificationModal from '../../modals/NotificationModal';

export default function Step7Notifications() {
  const { currentEval, updateCurrentEval, saveCurrentEval, setActiveStep, addToast } = useEvaluation();
  const [notifModal, setNotifModal] = useState(null); // null | { notification } | { isNew: true }
  const [menuOpen, setMenuOpen] = useState(null); // notification id

  if (!currentEval) return null;
  const ev = currentEval;

  const handleSave = () => {
    saveCurrentEval(7);
    updateCurrentEval({ notificationsVisited: true });
    addToast('Notificaciones guardadas correctamente.');
    setActiveStep(4); // Return to Summary after completing Notifications
  };

  const handleSaveNotification = (notif) => {
    updateCurrentEval(prev => {
      const exists = prev.notifications.find(n => n.id === notif.id);
      const notifications = exists
        ? prev.notifications.map(n => n.id === notif.id ? notif : n)
        : [...prev.notifications, notif];
      return { ...prev, notifications };
    });
    addToast('Notificación guardada correctamente.');
  };

  const handleDeleteNotification = (id) => {
    updateCurrentEval(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
    setMenuOpen(null);
  };

  const handleCancel = () => {
    // Mark as visited anyway
    updateCurrentEval({ notificationsVisited: true });
  };

  return (
    <div className="space-y-6" onClick={() => setMenuOpen(null)}>
      <section>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Configuración de Notificaciones</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Aquí podrás configurar el contenido, fecha de envío y estado de tus Notificaciones y E-mail.
            </p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setNotifModal({ isNew: true }); }}
            className="text-xs border border-gray-400 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
          >
            Crear Notificación +
          </button>
        </div>
        <div className="border-b border-gray-200 mt-3" />
      </section>

      {/* Notification grid */}
      <div className="grid grid-cols-2 gap-4">
        {ev.notifications.map(notif => (
          <div
            key={notif.id}
            className="border border-gray-300 p-4 cursor-pointer hover:border-gray-500 relative"
            onClick={() => setNotifModal({ notification: notif })}
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-semibold text-gray-900">{notif.name}</p>
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === notif.id ? null : notif.id); }}
                className="text-gray-400 hover:text-gray-700 text-lg leading-none px-1"
              >
                ⋮
              </button>
              {menuOpen === notif.id && (
                <div
                  className="absolute top-8 right-4 bg-white border border-gray-300 z-20 w-36"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setNotifModal({ notification: notif }); setMenuOpen(null); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  {!notif.isDefault && (
                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-2">{notif.description}</p>
            <div className="border-t border-gray-200 pt-2">
              <p className="text-xs text-gray-500">{notif.condition}</p>
              {notif.sendDate && (
                <p className="text-xs text-gray-500 mt-0.5">📅 Fecha de envío: {notif.sendDate}</p>
              )}
              {notif.isDefault && (
                <span className="inline-block mt-1.5 text-xs border border-gray-200 px-1.5 py-0.5 text-gray-400">
                  Predeterminada
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {ev.notifications.length === 0 && (
        <div className="text-center py-8 border border-dashed border-gray-300 text-gray-400">
          <p className="text-sm mb-1">No hay notificaciones configuradas</p>
          <p className="text-xs">Haz clic en "Crear Notificación +" para agregar una.</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button onClick={handleCancel} className="px-4 py-2 text-sm border border-gray-400 text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 text-sm font-medium bg-gray-900 text-white border border-gray-900 hover:bg-gray-700"
        >
          Guardar
        </button>
      </div>

      {/* Notification modal */}
      <NotificationModal
        isOpen={!!notifModal}
        onClose={() => setNotifModal(null)}
        notification={notifModal?.notification || null}
        onSave={handleSaveNotification}
      />
    </div>
  );
}
