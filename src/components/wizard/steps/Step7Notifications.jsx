import { useState } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import { Button } from '../../Button';
import { ArrowRightIcon } from '../../../assets/icons/ArrowRightIcon';
import NotificationModal from '../../modals/NotificationModal';

/*
 * Tokens Zafiro usados (src/tokens/tokens.json):
 *   primario-oscuro: #0A396C  — título de tarjeta
 *   gris-oscuro:    #666666   — descripción tarjeta
 *   neutral-99:     #999999   — categoría tarjeta
 *   blanco:         #FFFFFF   — fondo tarjeta
 *   elevation-1:    0px 2px 4px 0px rgba(0,0,0,0.15)
 *   fondo:          #F6F9FA   — hover de items del menú contextual
 *   error:          #E24C4C   — opción Eliminar
 *   auxiliar:       #B6CEE7   — separador modal / ícono arrow right
 */

/* ── Ícono plus ───────────────────────────────────────────────────────────── */
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ── Ícono tres puntos verticales ────────────────────────────────────────── */
function MoreVertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="5.5" r="1.5" fill="#B6CEE7" />
      <circle cx="12" cy="12" r="1.5" fill="#B6CEE7" />
      <circle cx="12" cy="18.5" r="1.5" fill="#B6CEE7" />
    </svg>
  );
}

/* ── Tarjeta de notificación ──────────────────────────────────────────────── */
function NotificationCard({ notif, onEdit, onDelete, menuOpen, onToggleMenu }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.15)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '372px',
        minHeight: '129px',
        cursor: 'pointer',
        position: 'relative',
        boxSizing: 'border-box',
      }}
      onClick={onEdit}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <p style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: '1.3',
          color: '#0A396C',
          margin: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 'calc(100% - 32px)',
        }}>
          {notif.name}
        </p>
        <button
          type="button"
          aria-label="Más opciones"
          onClick={e => { e.stopPropagation(); onToggleMenu(); }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            flexShrink: 0,
          }}
        >
          <MoreVertIcon />
        </button>

        {/* Menú contextual */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '44px',
              right: '16px',
              background: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
              zIndex: 20,
              minWidth: '140px',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => { onEdit(); onToggleMenu(); }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                color: '#333333',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F6F9FA'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
            >
              Editar
            </button>
            {!notif.isDefault && (
              <button
                type="button"
                onClick={() => { onDelete(); onToggleMenu(); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: '#E24C4C',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F6F9FA'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Descripción */}
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '1.3',
        color: '#666666',
        margin: 0,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
      }}>
        {notif.description}
      </p>

      {/* Categoría */}
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '1',
        color: '#999999',
        margin: 0,
      }}>
        {notif.isDefault ? 'Predeterminado' : (notif.condition || '')}
      </p>
    </div>
  );
}

/* ── Paso 7: Notificaciones ───────────────────────────────────────────────── */
export default function Step7Notifications() {
  const {
    currentEval,
    updateCurrentEval,
    saveCurrentEval,
    setActiveStep,
    addToast,
    saveDraft,
  } = useEvaluation();

  const [notifModal, setNotifModal] = useState(null);
  const [menuOpen, setMenuOpen]     = useState(null);

  if (!currentEval) return null;
  const ev = currentEval;

  const handleSaveAndContinue = () => {
    saveCurrentEval(7);
    updateCurrentEval({ notificationsVisited: true });
    addToast('Notificaciones guardadas correctamente.');
    setActiveStep(4);
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
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
    setMenuOpen(null);
  };

  return (
    <>
      {/* ── Sección: tarjetas de notificaciones ──────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '100%',
          boxSizing: 'border-box',
          alignItems: 'center',
        }}
        onClick={() => setMenuOpen(null)}
      >
        {/* Botón Crear notificación — alineado a la derecha en 768px */}
        <div style={{ width: '768px', maxWidth: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="tertiary"
            size="md"
            icon={<PlusIcon />}
            iconPosition="left"
            style={{ color: '#00B4FF' }}
            onClick={e => { e.stopPropagation(); setNotifModal({ isNew: true }); }}
          >
            Crear notificación
          </Button>
        </div>

        {/* Grid de tarjetas */}
        {ev.notifications.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', width: '100%' }}>
            {ev.notifications.map(notif => (
              <NotificationCard
                key={notif.id}
                notif={notif}
                onEdit={() => { setNotifModal({ notification: notif }); setMenuOpen(null); }}
                onDelete={() => handleDeleteNotification(notif.id)}
                menuOpen={menuOpen === notif.id}
                onToggleMenu={() => setMenuOpen(prev => prev === notif.id ? null : notif.id)}
              />
            ))}
          </div>
        ) : (
          <div style={{
            width: '768px',
            maxWidth: '100%',
            padding: '32px',
            textAlign: 'center',
            border: '1px dashed #CCCCCC',
            borderRadius: '8px',
          }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#999999', margin: '0 0 4px' }}>
              No hay notificaciones configuradas
            </p>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#CCCCCC', margin: 0 }}>
              Haz clic en "Crear notificación" para agregar una.
            </p>
          </div>
        )}
      </div>

      {/* ── Botones de acción ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
        paddingTop: '8px',
      }}>
        <Button variant="secondary" size="md" onClick={saveDraft}>
          Guardar borrador
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveAndContinue}
          icon={<ArrowRightIcon size={16} color="#B6CEE7" />}
          iconPosition="right"
        >
          Guardar y continuar
        </Button>
      </div>

      {/* ── Modal de notificación ─────────────────────────────────────── */}
      <NotificationModal
        isOpen={!!notifModal}
        onClose={() => setNotifModal(null)}
        notification={notifModal?.notification || null}
        onSave={handleSaveNotification}
      />
    </>
  );
}
