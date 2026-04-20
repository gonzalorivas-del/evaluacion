import { useState, useEffect, useRef } from 'react';
import { CardOption } from '../CardOption';
import { Button } from '../Button';
import { InputField } from '../InputField';
import { useEvaluation } from '../../context/EvaluationContext';
import { TEMPLATE_CONFIGS } from '../../data/constants';

/*
 * Tokens Zafiro usados (src/tokens/tokens.json):
 *   primario:          #1E5591  — título modal, borde Cancelar
 *   importante:        #00B4FF  — ícono calendario
 *   negro-textos:      #333333  — texto banner
 *   gris-oscuro:       #666666  — labels fecha, placeholder
 *   gris-textos:       #999999  — separadores, helper text
 *   error:             #E24C4C  — mensajes de validación
 *   blanco:            #FFFFFF  — fondo modal
 *   Elevación 2:       0px 5px 8px 0px rgba(0,0,0,0.15)
 *   Background/Admin:  #EDF2F4  — fondo banner
 */

/* ── Asterisco requerido ──────────────────────────────────────────────────── */
function RequiredLabel({ text }) {
  if (!text.endsWith('*')) return text;
  return (
    <>
      {text.slice(0, -1).trimEnd()}
      {' '}
      <span style={{ color: '#E24C4C' }} aria-hidden="true">*</span>
    </>
  );
}

/* ── Ícono calendario (Icon/Calendar — Figma Zafiro) ──────────────────────── */
function CalendarIcon({ color = '#00B4FF' }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M3 9H21" stroke={color} strokeWidth="1.6" />
      <path d="M8 2V5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 2V5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ── Ícono flecha derecha (Icon/Arrow right — Figma Zafiro) ───────────────── */
function ArrowRightIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Campo selector de fecha ──────────────────────────────────────────────── */
/*
 * Comportamiento:
 *  - Clic en el texto / placeholder → el usuario escribe la fecha manualmente
 *    en formato DD/MM/YYYY (las barras se insertan automáticamente).
 *  - Clic en el ícono de calendario → llama a showPicker() sobre el input date
 *    oculto, abriendo el selector nativo del navegador de forma confiable.
 */
function DateField({ label, value, onChange, error, supportingText }) {
  // Estado interno en formato de texto "DD/MM/YYYY"
  const [text, setText] = useState('');
  const pickerRef = useRef(null);

  const handleCalendarClick = () => {
    if (pickerRef.current) {
      try {
        pickerRef.current.showPicker();
      } catch {
        pickerRef.current.click();
      }
    }
  };

  // Sincroniza cuando cambia el valor externo ISO (YYYY-MM-DD) o al resetear
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      setText(`${d}/${m}/${y}`);
    } else {
      setText('');
    }
  }, [value]);

  /* ── Escritura manual con auto-formato DD/MM/YYYY ─────────────────────── */
  const handleTextChange = (e) => {
    const newVal = e.target.value;

    if (newVal.length < text.length) {
      // Borrado: acepta el valor tal cual y elimina barra final si quedó sola
      let updated = newVal;
      if (updated.endsWith('/')) updated = updated.slice(0, -1);
      setText(updated);
      if (updated === '') onChange({ target: { value: '' } });
      return;
    }

    // Inserción: extrae solo dígitos y reformatea como DD/MM/YYYY
    const digits = newVal.replace(/\D/g, '').slice(0, 8);
    let formatted = '';
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }
    setText(formatted);

    // Notifica al padre cuando la fecha está completa y es válida
    if (formatted.length === 10) {
      const [dd, mm, yyyy] = formatted.split('/');
      const iso = `${yyyy}-${mm}-${dd}`;
      const d = new Date(`${iso}T00:00:00`);
      if (
        !isNaN(d) &&
        d.getFullYear() === parseInt(yyyy, 10) &&
        d.getMonth() + 1 === parseInt(mm, 10) &&
        d.getDate() === parseInt(dd, 10)
      ) {
        onChange({ target: { value: iso } });
      }
    } else if (digits.length === 0) {
      onChange({ target: { value: '' } });
    }
  };

  /* ── Selección desde el date picker nativo ───────────────────────────── */
  const handlePickerChange = (e) => {
    const iso = e.target.value; // YYYY-MM-DD
    if (iso) {
      const [y, m, d] = iso.split('-');
      setText(`${d}/${m}/${y}`);
    } else {
      setText('');
    }
    onChange(e);
  };

  return (
    <div style={{ position: 'relative', flex: '1 1 0', minWidth: 0 }}>
      {/* Label estático */}
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '12px',
        fontWeight: 400,
        color: error ? '#E24C4C' : '#666666',   /* error | gris-oscuro */
        margin: '0 0 4px',
        lineHeight: '16px',
      }}>
        <RequiredLabel text={label} />
      </p>

      {/* Fila: input texto + ícono calendario */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '24px',
      }}>
        {/* Input de texto — escritura manual DD/MM/YYYY */}
        <input
          type="text"
          value={text}
          placeholder="-- Seleccionar --"
          onChange={handleTextChange}
          maxLength={10}
          aria-label={label.replace(/\s*\*$/, '')}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: text ? '#333333' : '#666666', /* negro-textos | gris-oscuro */
            padding: 0,
            minWidth: 0,
          }}
        />

        {/* Botón ícono calendario — llama a showPicker() sobre el input oculto */}
        <button
          type="button"
          onClick={handleCalendarClick}
          aria-label={`Abrir calendario para ${label}`}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            flexShrink: 0,
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CalendarIcon color={error ? '#E24C4C' : '#00B4FF'} />
        </button>

        {/* Input date oculto — solo se activa vía showPicker() */}
        <input
          ref={pickerRef}
          type="date"
          value={value || ''}
          onChange={handlePickerChange}
          tabIndex={-1}
          aria-hidden="true"
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            width: 0,
            height: 0,
          }}
        />
      </div>

      {/* Separador */}
      <div style={{
        height: '1px',
        backgroundColor: error ? '#E24C4C' : '#999999',  /* error | gris-textos */
        borderRadius: '16px',
        marginTop: '2px',
      }} />

      {/* Texto de apoyo */}
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '12px',
        fontWeight: 400,
        color: error ? '#E24C4C' : '#999999',
        margin: '4px 0 0',
        lineHeight: '16px',
        minHeight: '16px',
      }}>
        {supportingText || '\u00A0'}
      </p>
    </div>
  );
}

/* ── Modal principal ─────────────────────────────────────────────────────── */
export default function EvaluationTypeModal() {
  const { showTypeModal, setShowTypeModal, createEvaluation } = useEvaluation();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});

  /* Bloquea scroll del body mientras el modal está abierto */
  useEffect(() => {
    document.body.style.overflow = showTypeModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showTypeModal]);

  const validate = () => {
    const errs = {};
    if (!selectedTemplate) errs.template = 'Selecciona una plantilla.';
    if (!name.trim()) errs.name = 'El nombre no puede estar vacío.';
    if (!startDate) errs.startDate = 'Indica la fecha de inicio.';
    if (!endDate) errs.endDate = 'Indica la fecha de término.';
    if (startDate && endDate && endDate <= startDate)
      errs.endDate = 'La fecha de término debe ser posterior a la de inicio.';
    return errs;
  };

  const handleCreate = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    createEvaluation(name, startDate, endDate, selectedTemplate);
    reset();
  };

  const handleClose = () => {
    setShowTypeModal(false);
    reset();
  };

  const reset = () => {
    setSelectedTemplate(null);
    setName('');
    setStartDate('');
    setEndDate('');
    setErrors({});
  };


  const templates = [
    { id: '90',     ...TEMPLATE_CONFIGS['90'] },
    { id: '180',    ...TEMPLATE_CONFIGS['180'] },
    { id: '360',    ...TEMPLATE_CONFIGS['360'] },
    { id: 'custom', ...TEMPLATE_CONFIGS['custom'] },
  ];

  if (!showTypeModal) return null;

  return (
    /* Overlay / Scrim */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
      }}
    >
      {/* Contenedor del modal — Modal-crear-evaluacion */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF',                              /* blanco */
          borderRadius: '16px',
          boxShadow: '0px 5px 8px 0px rgba(0, 0, 0, 0.15)', /* Elevación 2 */
          width: '754px',
          maxWidth: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Título ─────────────────────────────────────────────────────── */}
        <h2
          id="modal-title"
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '18px',
            fontWeight: 500,
            color: '#1E5591',                    /* primario */
            textAlign: 'center',
            margin: 0,
            lineHeight: 1,
            width: '100%',
          }}
        >
          ¿Qué tipo de evaluación quieres crear?
        </h2>

        {/* ── Banner alert ────────────────────────────────────────────────── */}
        <div
          style={{
            background: '#EDF2F4',               /* Background/Administration */
            padding: '8px 16px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#333333',                    /* negro-textos */
            margin: 0,
            lineHeight: 1,
          }}>
            Elige una plantilla para comenzar rápido, o crea una desde cero.
          </p>
        </div>

        {/* ── Grid de plantillas ──────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px 24px',                      /* row-gap col-gap */
          width: '100%',
        }}>
          {templates.map(tpl => (
            <div key={tpl.id} style={{ flex: '0 0 calc(50% - 12px)', display: 'flex' }}>
              <CardOption
                title={tpl.label}
                subtitle={tpl.subtitle}
                description={tpl.description}
                recommended={!!tpl.badge}
                recommendedLabel={tpl.badge ?? 'Recomendada'}
                selected={selectedTemplate === tpl.id}
                error={!!errors.template}
                onClick={() => {
                  setSelectedTemplate(tpl.id);
                  setErrors(e => ({ ...e, template: undefined }));
                }}
              />
            </div>
          ))}
        </div>

        {errors.template && (
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '12px',
            color: '#E24C4C',                   /* error */
            margin: '-16px 0 0',
            alignSelf: 'flex-start',
          }}>
            {errors.template}
          </p>
        )}

        {/* ── Nombre + Fechas ─────────────────────────────────────────────── */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingBottom: 0,
          boxSizing: 'border-box',
        }}>
          {/* Campo nombre */}
          <InputField
            label="Nombre de la evaluación *"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setErrors(er => ({ ...er, name: undefined }));
            }}
            fieldState={errors.name ? 'error' : 'default'}
            supportingText={errors.name || '\u00A0'}
            hideIcon
          />

          {/* Campos de fecha */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
            <DateField
              label="Fecha de inicio *"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
                setErrors(er => ({ ...er, startDate: undefined, endDate: undefined }));
              }}
              error={!!errors.startDate}
              supportingText={errors.startDate}
            />
            <DateField
              label="Fecha de término *"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
                setErrors(er => ({ ...er, endDate: undefined }));
              }}
              error={!!errors.endDate}
              supportingText={errors.endDate}
            />
          </div>

          {/* Texto de ayuda global fechas */}
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#999999',                    /* gris-textos */
            margin: '0',
            lineHeight: 1,
          }}>
            Fecha estimada. Las fechas de cada etapa se configuran por separado.
          </p>
        </div>

        {/* ── Botones de acción (centrados) ────────────────────────────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
        }}>
          <Button variant="secondary" size="md" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleCreate}
            icon={<ArrowRightIcon />}
            iconPosition="right"
          >
            Crear evaluación
          </Button>
        </div>
      </div>
    </div>
  );
}
