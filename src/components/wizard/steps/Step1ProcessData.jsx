import { useState, useRef, useEffect } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import { Switch } from '../../Switch';
import Tooltip from '../../ui/Tooltip';
import { MOCK_PARTICIPANTS, MOCK_USERS } from '../../../data/constants';
import { InputField } from '../../InputField';
import { Textarea } from '../../Textarea';
import { Selector } from '../../Selector';
import { Radiobutton } from '../../Radiobutton';
import { Checkbox } from '../../Checkbox';
import { Chip } from '../../Chip';
import { Button } from '../../Button';
import { Uploader } from '../../Uploader';
import { ArrowRightIcon } from '../../../assets/icons/ArrowRightIcon';

/* ── Estilos de tokens Zafiro ───────────────────────────────────────── */
const TOKEN = {
  panel:         '#5780AD',
  primarioOscuro:'#0A396C',
  grisOscuro:    '#666666',
  grisTextos:    '#999999',
  grisSecundario:'#E5E5E5',
  error:         '#E24C4C',
  fondo:         '#F6F9FA',
  negro:         '#333333',
};

const CARD_SECTION = {
  background:   '#ffffff',
  borderRadius: '16px',
  boxShadow:    '0px 5px 8px 0px rgba(0,0,0,0.15)',
  padding:      '24px',
  display:      'flex',
  flexDirection:'column',
  gap:          '24px',
};

const SECTION_TITLE = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize:   '16px',
  color:      TOKEN.panel,
  margin:     0,
};

const HELPER_TEXT = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize:   '12px',
  color:      TOKEN.grisTextos,
  margin:     0,
};

const PRIVACY_CARD = {
  background:   '#ffffff',
  borderRadius: '16px',
  boxShadow:    '0px 2px 4px 0px rgba(0,0,0,0.15)',
  padding:      '16px',
  display:      'flex',
  flexDirection:'column',
  gap:          '16px',
};

/* ── Íconos tabla ───────────────────────────────────────────────────── */
function More2Icon({ color = '#00B4FF' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5.5" cy="12" r="1.75" fill={color} />
      <circle cx="12" cy="12" r="1.75" fill={color} />
      <circle cx="18.5" cy="12" r="1.75" fill={color} />
    </svg>
  );
}

function TrashIcon({ color = '#E24C4C' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#CCCCCC" strokeWidth="1.5" />
      <path d="M16.5 16.5L21 21" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronPrevIcon({ disabled }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke={disabled ? '#CCCCCC' : '#333333'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronNextIcon({ disabled }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke={disabled ? '#CCCCCC' : '#333333'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Genera el array de páginas a mostrar en el paginador */
function getPaginationPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

/* ── Ícono Calendario ──────────────────────────────────────────────── */
function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}


/* ── CSV helpers ────────────────────────────────────────────────────── */
const CSV_TEMPLATE_HEADERS = 'nombre;rut;empresa;cargo;familia_cargo';
const CSV_TEMPLATE_ROWS = [
  'María González;12.345.678-9;Empresa A;Analista;Análisis',
  'Juan Pérez;11.234.567-8;Empresa A;Jefe de Área;Gestión',
];
const CSV_TEMPLATE = [CSV_TEMPLATE_HEADERS, ...CSV_TEMPLATE_ROWS].join('\n');

function parseCSV(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { rows: [], errors: ['El archivo no contiene datos.'] };

  const sep = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/"/g, '').replace(/\s+/g, '_'));

  const nameCol    = headers.findIndex(h => ['nombre', 'name', 'nombre_completo'].includes(h));
  const rutCol     = headers.findIndex(h => ['rut', 'rut_colaborador'].includes(h));
  const empresaCol = headers.findIndex(h => ['empresa', 'company'].includes(h));
  const cargoCol   = headers.findIndex(h => ['cargo', 'puesto', 'position'].includes(h));
  const familiaCol = headers.findIndex(h => ['familia_cargo', 'familia'].includes(h));

  if (nameCol === -1) {
    return { rows: [], errors: ['Columna "nombre" no encontrada. Descarga la plantilla para ver el formato correcto.'] };
  }

  const rows = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(sep).map(c => c.trim().replace(/"/g, ''));
    const nombre = cols[nameCol] || '';
    if (!nombre) {
      errors.push(`Fila ${i + 1}: sin nombre — omitida.`);
      continue;
    }
    rows.push({
      id: `csv-${i}-${Date.now()}`,
      name: nombre,
      rut:     rutCol     !== -1 ? (cols[rutCol]     || '—') : '—',
      empresa: empresaCol !== -1 ? (cols[empresaCol] || '—') : '—',
      cargo:   cargoCol   !== -1 ? (cols[cargoCol]   || '—') : '—',
      familia: familiaCol !== -1 ? (cols[familiaCol] || '—') : '—',
      _rowIndex: i,
    });
  }
  return { rows, errors };
}

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'plantilla_colaboradores.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ════════════════════════════════════════════════════════════════════ */
export default function Step1ProcessData() {
  const { currentEval, updateCurrentEval, saveCurrentEval, setActiveStep, addToast } = useEvaluation();

  const [errors, setErrors]                   = useState({});
  const [showPrivacyWarning, setShowPrivacyWarning] = useState(false);
  const [pendingPrivacy, setPendingPrivacy]   = useState(null);
  const [csvFileName, setCsvFileName]         = useState('');
  const [csvFileSize, setCsvFileSize]         = useState('');
  const [csvErrors, setCsvErrors]             = useState([]);
  const [showOrgTable, setShowOrgTable]       = useState(false);
  const [orgParticipants, setOrgParticipants] = useState(MOCK_PARTICIPANTS);
  const [orgSearchText, setOrgSearchText]     = useState('');
  const [orgPage, setOrgPage]                 = useState(1);
  const [orgRowsPerPage, setOrgRowsPerPage]   = useState(8);
  const [openMenuId, setOpenMenuId]           = useState(null);

  /* Cierra el menú contextual al hacer click fuera */
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  /* selector keys — fuerzan re-mount para resetear valor tras selección */
  const [managerSelKey, setManagerSelKey]     = useState(0);
  const [viewerSelKey, setViewerSelKey]       = useState(0);
  const [responsibleSelKey, setResponsibleSelKey] = useState(0);


  if (!currentEval) return null;
  const ev = currentEval;

  const update = (field, value) => {
    updateCurrentEval({ [field]: value });
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!ev.name.trim())  errs.name      = 'El proceso necesita un nombre.';
    if (!ev.startDate)    errs.startDate  = 'Indica la fecha de inicio.';
    if (!ev.endDate)      errs.endDate    = 'Indica la fecha de término.';
    if (ev.startDate && ev.endDate && ev.endDate <= ev.startDate)
      errs.endDate = 'La fecha de término debe ser posterior a la de inicio.';
    if (!ev.scope)        errs.scope      = 'Selecciona el alcance.';
    if (ev.scope === 'specific' && ev.participants.length === 0)
      errs.participants = 'Carga un archivo CSV con al menos un colaborador.';
    return errs;
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setCsvErrors(['El archivo debe ser formato .csv']);
      return;
    }
    setCsvFileName(file.name);
    setCsvFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    const reader = new FileReader();
    reader.onload = (e) => {
      const { rows, errors: parseErrors } = parseCSV(e.target.result);
      setCsvErrors(parseErrors);
      updateCurrentEval({ participants: rows });
      setErrors(er => ({ ...er, participants: undefined }));
      if (rows.length > 0) addToast(`${rows.length} colaboradores cargados correctamente.`);
    };
    reader.readAsText(file, 'UTF-8');
  };


  const removeParticipant = (id) =>
    updateCurrentEval({ participants: ev.participants.filter(p => p.id !== id) });

  const clearImport = () => {
    updateCurrentEval({ participants: [] });
    setCsvFileName('');
    setCsvFileSize('');
    setCsvErrors([]);
  };

  const handleSaveAndContinue = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    saveCurrentEval(1);
    setActiveStep(2);
  };

  const handleSaveDraft = () => {
    saveCurrentEval(1);
    addToast('Borrador guardado correctamente.');
  };

  const handlePrivacyToggle = (value) => {
    if (value && (ev.managers.length > 0 || ev.viewers.length > 0)) {
      setPendingPrivacy(value);
      setShowPrivacyWarning(true);
    } else {
      update('isPrivate', value);
    }
  };

  const confirmPrivacy = () => {
    updateCurrentEval({ isPrivate: pendingPrivacy, managers: [], viewers: [] });
    setShowPrivacyWarning(false);
    setPendingPrivacy(null);
  };

  const addUser = (field, u) => {
    if (u) updateCurrentEval({ [field]: [...ev[field], u] });
  };

  const removeUser = (field, id) =>
    updateCurrentEval({ [field]: ev[field].filter(u => u.id !== id) });

  const isMeResponsible = ev.responsibles.find(r => r.id === 1);
  const assignMe = () => {
    if (!isMeResponsible)
      updateCurrentEval({ responsibles: [...ev.responsibles, MOCK_USERS[0]] });
  };

  /* ── opciones para selectores de usuarios ───────────────────────── */
  const managerOptions = MOCK_USERS
    .filter(u => !ev.managers.find(m => m.id === u.id))
    .map(u => ({ value: String(u.id), label: u.name }));

  const viewerOptions = MOCK_USERS
    .filter(u => !ev.viewers.find(v => v.id === u.id))
    .map(u => ({ value: String(u.id), label: u.name }));

  const responsibleOptions = MOCK_USERS
    .filter(u => !ev.responsibles.find(r => r.id === u.id))
    .map(u => ({ value: String(u.id), label: u.name }));

  /* ════════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Modal advertencia privacidad ─────────────────────────────── */}
      {showPrivacyWarning && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px',
            maxWidth: '480px', width: '100%', margin: '0 16px',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontFamily:'Roboto,sans-serif', fontWeight:500, fontSize:'18px', color:TOKEN.primarioOscuro, margin:'0 0 12px' }}>
              ¿Activar privacidad?
            </h3>
            <p style={{ fontFamily:'Roboto,sans-serif', fontSize:'14px', color:TOKEN.grisOscuro, margin:'0 0 24px' }}>
              Activar la privacidad eliminará los Encargados y Visualizadores asignados. ¿Continuar?
            </p>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'12px' }}>
              <Button variant="secondary" onClick={() => setShowPrivacyWarning(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={confirmPrivacy}>
                Continuar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Sección 1: Información general ═══════════════════════════ */}
      <section style={CARD_SECTION}>
        <p style={SECTION_TITLE}>Información general</p>

        {/* Nombre */}
        <InputField
          label="Nombre de la evaluación *"
          value={ev.name}
          onChange={e => update('name', e.target.value)}
          fieldState={errors.name ? 'error' : 'default'}
          supportingText={errors.name}
          hideIcon
        />

        {/* Fechas */}
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
            <DateField
              label="Fecha de inicio *"
              value={ev.startDate}
              onChange={v => update('startDate', v)}
              error={errors.startDate}
            />
            <DateField
              label="Fecha de término *"
              value={ev.endDate}
              onChange={v => update('endDate', v)}
              error={errors.endDate}
            />
          </div>
          <p style={{ ...HELPER_TEXT, marginTop:'8px' }}>
            Fecha estimada. Las fechas de cada etapa se configuran por separado.
          </p>
        </div>

        {/* Descripción */}
        <div>
          <Textarea
            label="Descripción del proceso"
            placeholder="Describe el proceso aquí"
            value={ev.description}
            onChange={(value) => update('description', value.slice(0, 1000))}
            maxLength={1000}
          />
          <p style={{ ...HELPER_TEXT, marginTop:'8px' }}>
            La descripción y el nombre del proceso, serán visibles en la portada del formulario del colaborador.
          </p>
        </div>
      </section>

      {/* ══ Sección 2: ¿A quiénes incluye? ══════════════════════════ */}
      <section style={CARD_SECTION}>
        <p style={SECTION_TITLE}>¿A quiénes incluye?</p>

        {/* Opción A: Toda la organización */}
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          <Radiobutton
            label="A toda la organización"
            name="scope"
            value="all"
            checked={ev.scope === 'all'}
            onChange={() => { update('scope', 'all'); clearImport(); }}
          />
          {ev.scope === 'all' && (
            <div style={{ paddingLeft:'32px', display:'flex', flexDirection:'column', gap:'12px', alignItems:'flex-start' }}>
              <p style={{ ...HELPER_TEXT }}>
                Todos los colaboradores activos serán incluidos.
              </p>
              <Chip
                label="Ver listado de colaboradores incluidos"
                count={orgParticipants.length}
                expanded={showOrgTable}
                onClick={() => setShowOrgTable(v => !v)}
              />
              {showOrgTable && (() => {
                /* ── Derivados ── */
                const filtered = orgParticipants.filter(p =>
                  !orgSearchText.trim() ||
                  [p.rut, p.name, p.empresa, p.email, p.cargo, p.jefatura]
                    .some(v => (v || '').toLowerCase().includes(orgSearchText.toLowerCase()))
                );
                const totalPages  = Math.max(1, Math.ceil(filtered.length / orgRowsPerPage));
                const safePage    = Math.min(orgPage, totalPages);
                const paginated   = filtered.slice((safePage - 1) * orgRowsPerPage, safePage * orgRowsPerPage);
                const pages       = getPaginationPages(safePage, totalPages);

                /* ── Estilos compartidos ── */
                const CELL_BASE = {
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#333333',           /* Neutral/33 */
                  padding: '12px 8px 12px 8px',
                  borderBottom: '1px solid #B6CEE7', /* auxiliar */
                  verticalAlign: 'middle',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '160px',
                };
                const TH_BASE = {
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000000',
                  padding: '8px 8px 12px 8px',
                  borderBottom: '1px solid #B6CEE7',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  background: '#FFFFFF',
                };

                return (
                  <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    width: '100%',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}>

                    {/* ── Cabecera: buscador ── */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      height: '66px',
                      padding: '0 24px 0 8px',
                      background: '#FFFFFF',
                    }}>
                      <div style={{ position: 'relative', width: '280px' }}>
                        <input
                          type="text"
                          placeholder="Buscar contenido"
                          value={orgSearchText}
                          onChange={e => { setOrgSearchText(e.target.value); setOrgPage(1); }}
                          style={{
                            width: '100%',
                            border: 'none',
                            borderBottom: '1px solid #B6CEE7',
                            outline: 'none',
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: '16px',
                            fontWeight: 400,
                            color: '#333333',
                            background: 'transparent',
                            padding: '0 32px 8px 0',
                            boxSizing: 'border-box',
                          }}
                        />
                        <span style={{ position: 'absolute', right: 0, top: 0, pointerEvents: 'none' }}>
                          <SearchIcon />
                        </span>
                      </div>
                    </div>

                    {/* ── Tabla ── */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <colgroup>
                          <col style={{ width: '150px' }} />
                          <col />
                          <col />
                          <col />
                          <col />
                          <col />
                          <col style={{ width: '56px' }} />
                        </colgroup>
                        <thead>
                          <tr>
                            {['Identificador nacional','Nombre','Empresa','Email','Cargo','Jefatura'].map(h => (
                              <th key={h} style={TH_BASE}>{h}</th>
                            ))}
                            <th style={{ ...TH_BASE, textAlign: 'center', padding: '8px 16px 12px' }} />
                          </tr>
                        </thead>
                        <tbody>
                          {paginated.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ ...CELL_BASE, textAlign: 'center', color: '#999999', padding: '24px', maxWidth: 'none' }}>
                                Sin resultados para «{orgSearchText}»
                              </td>
                            </tr>
                          ) : paginated.map(p => (
                            <tr key={p.id}>
                              <td style={CELL_BASE}>{p.rut}</td>
                              <td style={CELL_BASE}>{p.name}</td>
                              <td style={CELL_BASE}>{p.empresa}</td>
                              <td style={CELL_BASE}>{p.email}</td>
                              <td style={CELL_BASE}>{p.cargo}</td>
                              <td style={CELL_BASE}>{p.jefatura}</td>
                              <td style={{ ...CELL_BASE, position: 'relative', textAlign: 'center', padding: '12px 16px', maxWidth: 'none', overflow: 'visible' }}>
                                {/* Botón More2 */}
                                <button
                                  type="button"
                                  aria-label="Opciones"
                                  onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === p.id ? null : p.id); }}
                                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <More2Icon color="#00B4FF" />
                                </button>

                                {/* Menú contextual */}
                                {openMenuId === p.id && (
                                  <div
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                      position: 'absolute',
                                      top: '100%',
                                      right: 0,
                                      zIndex: 100,
                                      background: '#FFFFFF',
                                      borderRadius: '16px',
                                      padding: '16px',
                                      boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
                                      minWidth: '200px',
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOrgParticipants(prev => prev.filter(x => x.id !== p.id));
                                        setOpenMenuId(null);
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                        fontFamily: 'Roboto, sans-serif',
                                        fontSize: '14px',
                                        fontWeight: 400,
                                        color: '#333333',
                                        whiteSpace: 'nowrap',
                                        width: '100%',
                                        textAlign: 'left',
                                      }}
                                    >
                                      <TrashIcon color="#E24C4C" />
                                      Quitar colaborador
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* ── Footer: total + paginador ── */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 24px',
                      height: '69px',
                      background: '#FFFFFF',
                      borderRadius: '0 0 16px 16px',
                    }}>
                      {/* Total */}
                      <p style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#999999',
                        margin: 0,
                      }}>
                        {`Total de colaboradores: ${filtered.length}`}
                      </p>

                      {/* Paginador */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Selector filas */}
                        <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', color: '#333333' }}>Filas</span>
                        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                          <select
                            value={orgRowsPerPage}
                            onChange={e => { setOrgRowsPerPage(Number(e.target.value)); setOrgPage(1); }}
                            style={{
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              border: 'none',
                              borderBottom: '1px solid #B6CEE7',
                              background: 'transparent',
                              fontFamily: 'Roboto, sans-serif',
                              fontSize: '16px',
                              color: '#333333',
                              paddingRight: '28px',
                              paddingBottom: '4px',
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {[5, 8, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                          <span style={{ position: 'absolute', right: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                            <ChevronDownSmall />
                          </span>
                        </div>

                        {/* Prev */}
                        <button
                          type="button"
                          disabled={safePage === 1}
                          onClick={() => setOrgPage(p => Math.max(1, p - 1))}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: safePage === 1 ? 'default' : 'pointer', display: 'flex' }}
                          aria-label="Página anterior"
                        >
                          <ChevronPrevIcon disabled={safePage === 1} />
                        </button>

                        {/* Números */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {pages.map((pg, i) =>
                            pg === '...' ? (
                              <span key={`dots-${i}`} style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#333333', padding: '4px' }}>...</span>
                            ) : (
                              <button
                                key={pg}
                                type="button"
                                onClick={() => setOrgPage(pg)}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'none',
                                  border: 'none',
                                  padding: '4px',
                                  cursor: 'pointer',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontSize: '14px',
                                  fontWeight: 400,
                                  lineHeight: '24px',
                                  color: pg === safePage ? '#00B4FF' : '#333333',
                                }}
                              >
                                {pg}
                              </button>
                            )
                          )}
                        </div>

                        {/* Next */}
                        <button
                          type="button"
                          disabled={safePage === totalPages}
                          onClick={() => setOrgPage(p => Math.min(totalPages, p + 1))}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: safePage === totalPages ? 'default' : 'pointer', display: 'flex' }}
                          aria-label="Página siguiente"
                        >
                          <ChevronNextIcon disabled={safePage === totalPages} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Separador */}
        <div style={{ height:'1px', background:TOKEN.grisSecundario }} />

        {/* Opción B: Carga masiva */}
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          <Radiobutton
            label="Carga masiva desde archivo"
            name="scope"
            value="specific"
            checked={ev.scope === 'specific'}
            onChange={() => update('scope', 'specific')}
          />
          <div style={{ paddingLeft:'32px' }}>
            <p style={HELPER_TEXT}>
              Importa el listado de colaboradores desde un archivo .csv
            </p>
          </div>

          {ev.scope === 'specific' && (
            <div style={{ paddingLeft:'32px', display:'flex', flexDirection:'column', gap:'16px' }}>
              {/* Uploader — carga de archivo CSV */}
              <Uploader
                accept=".csv"
                file={csvFileName ? { name: csvFileName, size: csvFileSize } : null}
                onFileChange={handleFile}
                onFileRemove={clearImport}
                onDownloadTemplate={downloadTemplate}
                description={[
                  'Columnas requeridas: nombre · Opcionales: rut empresa cargo familia_cargo',
                  'Separador: punto y coma (;) o coma (,) · Codificación: UTF-8',
                ]}
                supportText="Solo archivos .csv · máx. 5 MB"
              />

              {/* Errores de parseo */}
              {csvErrors.length > 0 && (
                <div style={{ background:'#FEF2F2', borderRadius:'8px', padding:'12px 16px' }}>
                  <p style={{ fontFamily:'Roboto,sans-serif', fontWeight:500, fontSize:'12px', color:TOKEN.error, margin:'0 0 4px' }}>
                    Advertencias al procesar el archivo:
                  </p>
                  {csvErrors.map((e, i) => (
                    <p key={i} style={{ fontFamily:'Roboto,sans-serif', fontSize:'12px', color:TOKEN.error, margin:0 }}>
                      · {e}
                    </p>
                  ))}
                </div>
              )}

              {/* Tabla de participantes cargados */}
              {ev.participants.length > 0 && (
                <div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
                    <p style={{ fontFamily:'Roboto,sans-serif', fontWeight:500, fontSize:'13px', color:TOKEN.negro, margin:0 }}>
                      ✅ {ev.participants.length} colaboradores cargados
                      {csvErrors.length > 0 && (
                        <span style={{ color:'#B45309', marginLeft:'8px' }}>· {csvErrors.length} filas omitidas</span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={clearImport}
                      style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Roboto,sans-serif', fontSize:'12px', color:TOKEN.error, textDecoration:'underline' }}
                    >
                      Limpiar importación
                    </button>
                  </div>
                  <div style={{ border:`1px solid ${TOKEN.grisSecundario}`, borderRadius:'8px', maxHeight:'224px', overflowY:'auto' }}>
                    <table style={{ width:'100%', fontSize:'12px', borderCollapse:'collapse' }}>
                      <thead style={{ position:'sticky', top:0, background:'#FAFAFA', borderBottom:`1px solid ${TOKEN.grisSecundario}` }}>
                        <tr>
                          {['#','Nombre','RUT','Empresa','Cargo',''].map((h,i) => (
                            <th key={i} style={{ textAlign:'left', padding:'8px 12px', color:TOKEN.grisOscuro, fontWeight:500 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ev.participants.map((p, i) => (
                          <tr key={p.id} style={{ borderBottom:`1px solid ${TOKEN.grisSecundario}` }}>
                            <td style={{ padding:'8px 12px', color:TOKEN.grisTextos }}>{i + 1}</td>
                            <td style={{ padding:'8px 12px', fontWeight:500, color:TOKEN.negro }}>{p.name}</td>
                            <td style={{ padding:'8px 12px', color:TOKEN.grisTextos }}>{p.rut}</td>
                            <td style={{ padding:'8px 12px', color:TOKEN.grisTextos }}>{p.empresa}</td>
                            <td style={{ padding:'8px 12px', color:TOKEN.grisTextos }}>{p.cargo}</td>
                            <td style={{ padding:'8px 12px', textAlign:'right' }}>
                              <button
                                onClick={() => removeParticipant(p.id)}
                                style={{ background:'none', border:'none', cursor:'pointer', color:TOKEN.grisTextos, fontSize:'14px' }}
                                title="Eliminar fila"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {errors.participants && (
                <p style={{ fontFamily:'Roboto,sans-serif', fontSize:'12px', color:TOKEN.error, margin:0 }}>
                  {errors.participants}
                </p>
              )}
            </div>
          )}
        </div>

        {errors.scope && (
          <p style={{ fontFamily:'Roboto,sans-serif', fontSize:'12px', color:TOKEN.error, margin:0 }}>
            {errors.scope}
          </p>
        )}
      </section>

      {/* ══ Sección 3: ¿Quién gestiona este proceso? ════════════════ */}
      <section style={CARD_SECTION}>
        <div>
          <p style={SECTION_TITLE}>¿Quién gestiona este proceso?</p>
          <p style={{ ...HELPER_TEXT, marginTop:'8px' }}>
            Define quién puede administrar esta evaluación y si quieres proteger su confidencialidad.
          </p>
        </div>

        {/* Card: Evaluación privada */}
        <div style={{ ...PRIVACY_CARD, boxShadow: ev.isPrivate ? 'none' : PRIVACY_CARD.boxShadow }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'16px' }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                <p style={{ fontFamily:'Roboto,sans-serif', fontWeight:500, fontSize:'16px', color:TOKEN.primarioOscuro, margin:0 }}>
                  Hacer esta evaluación privada
                </p>
                <Tooltip text="Una evaluación privada protege la confidencialidad del proceso. Úsala cuando solo ciertos administradores deben tener acceso, independientemente de sus permisos generales en la plataforma." />
              </div>
              <p style={{ fontFamily:'Roboto,sans-serif', fontSize:'12px', color:TOKEN.grisOscuro, margin:0 }}>
                Solo los usuarios designados como Responsables podrán ver, editar y gestionar este proceso.
                Los demás administradores no tendrán acceso.
              </p>
            </div>
            <Switch
                checked={ev.isPrivate}
                onChange={handlePrivacyToggle}
                aria-label="Hacer esta evaluación privada"
              />
          </div>

          {ev.isPrivate && (
            <div style={{ background:TOKEN.fondo, borderRadius:'8px', padding:'10px 16px' }}>
              <p style={{ fontFamily:'Roboto,sans-serif', fontSize:'12px', color:TOKEN.grisOscuro, margin:0 }}>
                En una evaluación privada, solo los Responsables asignados tienen acceso a este proceso.
              </p>
            </div>
          )}
        </div>

        {/* ── Evaluación privada: solo Responsables ─────────────────── */}
        {ev.isPrivate && (
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <p style={{ fontFamily:'Roboto,sans-serif', fontWeight:500, fontSize:'14px', color:TOKEN.negro, margin:0 }}>
                Responsables
              </p>
              <button
                onClick={assignMe}
                disabled={!!isMeResponsible}
                style={{
                  marginLeft:'auto',
                  background:'none',
                  border:`1px solid ${isMeResponsible ? TOKEN.grisSecundario : TOKEN.panel}`,
                  borderRadius:'24px',
                  padding:'4px 12px',
                  fontFamily:'Roboto,sans-serif',
                  fontSize:'12px',
                  color: isMeResponsible ? TOKEN.grisTextos : TOKEN.panel,
                  cursor: isMeResponsible ? 'not-allowed' : 'pointer',
                }}
              >
                {isMeResponsible ? '✅ Ya estás asignado' : 'Asignarme como responsable'}
              </button>
            </div>
            <Selector
              key={responsibleSelKey}
              label="Responsables"
              options={responsibleOptions}
              placeholder="-- Seleccionar responsable --"
              onChange={(value) => {
                const user = MOCK_USERS.find(u => String(u.id) === value);
                if (user) { addUser('responsibles', user); setResponsibleSelKey(k => k + 1); }
              }}
              style={{ width: '100%' }}
            />
            {ev.responsibles.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {ev.responsibles.map(u => (
                  <Chip key={u.id} label={u.name} active onRemove={() => removeUser('responsibles', u.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Evaluación no privada: Encargados + Visualizadores ─────── */}
        {!ev.isPrivate && (
          <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

            {/* Encargados */}
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <p style={{ fontFamily:'Roboto,sans-serif', fontWeight:500, fontSize:'14px', color:TOKEN.negro, margin:0 }}>
                  Encargados
                </p>
                <Tooltip text="Acceso completo para editar y gestionar el proceso." />
              </div>
              <Selector
                key={managerSelKey}
                label="Encargados"
                options={managerOptions}
                placeholder="-- Seleccionar --"
                onChange={(value) => {
                  const user = MOCK_USERS.find(u => String(u.id) === value);
                  if (user) { addUser('managers', user); setManagerSelKey(k => k + 1); }
                }}
                style={{ width: '100%' }}
              />
              {ev.managers.length > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'4px' }}>
                  {ev.managers.map(u => (
                    <Chip key={u.id} label={u.name} active onRemove={() => removeUser('managers', u.id)} />
                  ))}
                </div>
              )}
            </div>

            {/* Visualizadores */}
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <p style={{ fontFamily:'Roboto,sans-serif', fontWeight:500, fontSize:'14px', color:TOKEN.negro, margin:0 }}>
                  Visualizadores
                </p>
                <Tooltip text="Solo lectura: pueden ver el proceso y sus reportes." />
              </div>
              <Selector
                key={viewerSelKey}
                label="Visualizadores"
                options={viewerOptions}
                placeholder="-- Seleccionar --"
                onChange={(value) => {
                  const user = MOCK_USERS.find(u => String(u.id) === value);
                  if (user) { addUser('viewers', user); setViewerSelKey(k => k + 1); }
                }}
                style={{ width: '100%' }}
              />
              {ev.viewers.length > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'4px' }}>
                  {ev.viewers.map(u => (
                    <Chip key={u.id} label={u.name} active onRemove={() => removeUser('viewers', u.id)} />
                  ))}
                </div>
              )}
            </div>

            {/* Supervisores */}
            <div style={{ borderTop:`1px solid ${TOKEN.grisSecundario}`, paddingTop:'16px' }}>
              <Checkbox
                label={
                  <span style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    Todos los jefes directos podrán monitorear y visualizar los reportes de sus equipos
                    <Tooltip text="Los jefes directos acceden a los reportes de sus propios equipos sin ser asignados individualmente." />
                  </span>
                }
                checked={ev.supervisorsAccess}
                onChange={(checked) => update('supervisorsAccess', checked)}
              />
            </div>
          </div>
        )}
      </section>

      {/* ══ Acciones ════════════════════════════════════════════════ */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', paddingTop:'8px', paddingBottom:'8px' }}>
        <Button variant="secondary" onClick={handleSaveDraft}>
          Guardar borrador
        </Button>
        <Button
          variant="primary"
          size="md"
          icon={<ArrowRightIcon color="#B6CEE7" size={16} />}
          iconPosition="right"
          onClick={handleSaveAndContinue}
        >
          Guardar y continuar
        </Button>
      </div>
    </>
  );
}

/* ── Campo de fecha con estilo Zafiro ──────────────────────────────── */
function DateField({ label, value, onChange, error }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    try {
      inputRef.current?.showPicker();
    } catch {
      // fallback para navegadores sin soporte de showPicker
      inputRef.current?.click();
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
      <label style={{
        fontFamily:'Roboto,sans-serif', fontSize:'12px', fontWeight:400,
        color: error ? '#E24C4C' : '#666666', lineHeight:'16px',
      }}>
        {label}
      </label>
      <div style={{
        display:'flex', alignItems:'center', gap:'8px',
        borderBottom:`1px solid ${error ? '#E24C4C' : '#999999'}`,
        paddingBottom:'4px',
      }}>
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex:1, border:'none', outline:'none', background:'transparent',
            fontFamily:'Roboto,sans-serif', fontSize:'16px',
            color: value ? '#333333' : '#999999',
          }}
        />
        <span
          style={{ color:'#00B4FF', flexShrink:0, cursor:'pointer' }}
          onClick={openPicker}
          aria-label="Abrir calendario"
          role="button"
        >
          <CalendarIcon />
        </span>
      </div>
      {error && (
        <p style={{ fontFamily:'Roboto,sans-serif', fontSize:'12px', color:'#E24C4C', margin:0 }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Etiqueta de usuario seleccionado ──────────────────────────────── */
function UserTag({ name, onRemove }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:'6px',
      padding:'4px 10px 4px 6px',
      background:'#F0F5FA',
      border:`1px solid #B6CEE7`,
      borderRadius:'24px',
      fontFamily:'Roboto,sans-serif', fontSize:'13px', color:'#1E5591',
    }}>
      <span style={{
        width:'20px', height:'20px', borderRadius:'50%',
        background:'#B6CEE7', display:'flex', alignItems:'center', justifyContent:'center',
        fontWeight:500, fontSize:'11px', color:'#1E5591',
      }}>
        {name[0].toUpperCase()}
      </span>
      {name}
      <button
        type="button"
        onClick={onRemove}
        style={{
          background:'none', border:'none', cursor:'pointer',
          color:'#999999', fontSize:'12px', padding:'0', lineHeight:1,
          display:'flex', alignItems:'center',
        }}
        aria-label={`Quitar ${name}`}
      >
        ✕
      </button>
    </span>
  );
}
