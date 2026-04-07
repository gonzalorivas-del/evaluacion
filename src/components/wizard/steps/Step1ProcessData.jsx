import { useState, useRef } from 'react';
import { useEvaluation } from '../../../context/EvaluationContext';
import Toggle from '../../ui/Toggle';
import Tooltip from '../../ui/Tooltip';
import { MOCK_PARTICIPANTS, MOCK_USERS } from '../../../data/constants';

const CSV_TEMPLATE_HEADERS = 'nombre;rut;empresa;cargo;familia_cargo';
const CSV_TEMPLATE_ROWS = [
  'María González;12.345.678-9;Empresa A;Analista;Análisis',
  'Juan Pérez;11.234.567-8;Empresa A;Jefe de Área;Gestión',
];
const CSV_TEMPLATE = [CSV_TEMPLATE_HEADERS, ...CSV_TEMPLATE_ROWS].join('\n');

function parseCSV(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { rows: [], errors: ['El archivo no contiene datos.'] };

  // Auto-detect separator: semicolon or comma
  const sep = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/"/g, '').replace(/\s+/g, '_'));

  const nameCol   = headers.findIndex(h => ['nombre', 'name', 'nombre_completo'].includes(h));
  const rutCol    = headers.findIndex(h => ['rut', 'rut_colaborador'].includes(h));
  const empresaCol = headers.findIndex(h => ['empresa', 'company'].includes(h));
  const cargoCol  = headers.findIndex(h => ['cargo', 'puesto', 'position'].includes(h));
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
      rut: rutCol !== -1 ? (cols[rutCol] || '—') : '—',
      empresa: empresaCol !== -1 ? (cols[empresaCol] || '—') : '—',
      cargo: cargoCol !== -1 ? (cols[cargoCol] || '—') : '—',
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

export default function Step1ProcessData() {
  const { currentEval, updateCurrentEval, saveCurrentEval, setActiveStep, addToast } = useEvaluation();
  const [errors, setErrors] = useState({});
  const [userSearch, setUserSearch] = useState({ responsibles: '', managers: '', viewers: '' });
  const [showPrivacyWarning, setShowPrivacyWarning] = useState(false);
  const [pendingPrivacy, setPendingPrivacy] = useState(null);
  const [csvFileName, setCsvFileName] = useState('');
  const [csvErrors, setCsvErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const _urlParams = new URLSearchParams(window.location.search);
  const _isolateSection = _urlParams.get('section');
  const [showOrgTable, setShowOrgTable] = useState(_urlParams.get('orgTable') === 'open');
  const [orgParticipants, setOrgParticipants] = useState(MOCK_PARTICIPANTS);

  if (!currentEval) return null;
  const ev = currentEval;

  const update = (field, value) => {
    updateCurrentEval({ [field]: value });
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!ev.name.trim()) errs.name = 'El proceso necesita un nombre.';
    if (!ev.startDate) errs.startDate = 'Indica la fecha de inicio.';
    if (!ev.endDate) errs.endDate = 'Indica la fecha de término.';
    if (ev.startDate && ev.endDate && ev.endDate <= ev.startDate) errs.endDate = 'La fecha de término debe ser posterior a la de inicio.';
    if (!ev.scope) errs.scope = 'Selecciona el alcance.';
    if (ev.scope === 'specific' && ev.participants.length === 0) errs.participants = 'Carga un archivo CSV con al menos un colaborador.';
    return errs;
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setCsvErrors(['El archivo debe ser formato .csv']);
      return;
    }
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const { rows, errors: parseErrors } = parseCSV(e.target.result);
      setCsvErrors(parseErrors);
      updateCurrentEval({ participants: rows });
      setErrors(er => ({ ...er, participants: undefined }));
      if (rows.length > 0) {
        addToast(`${rows.length} colaboradores cargados correctamente.`);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleFileInput = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = ''; // allow re-upload same file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const removeParticipant = (id) => {
    updateCurrentEval({ participants: ev.participants.filter(p => p.id !== id) });
  };

  const clearImport = () => {
    updateCurrentEval({ participants: [] });
    setCsvFileName('');
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

  const filteredUsers = (field) => MOCK_USERS.filter(u =>
    userSearch[field].length >= 2 &&
    u.name.toLowerCase().includes(userSearch[field].toLowerCase()) &&
    !ev[field].find(eu => eu.id === u.id)
  );

  const addUser = (field, u) => {
    updateCurrentEval({ [field]: [...ev[field], u] });
    setUserSearch(s => ({ ...s, [field]: '' }));
  };

  const removeUser = (field, id) => {
    updateCurrentEval({ [field]: ev[field].filter(u => u.id !== id) });
  };

  const isMeResponsible = ev.responsibles.find(r => r.id === 1);
  const assignMe = () => {
    if (!isMeResponsible) {
      updateCurrentEval({ responsibles: [...ev.responsibles, MOCK_USERS[0]] });
    }
  };

  if (_isolateSection === 'quienes') {
    return (
      <div className="space-y-6">
        <section className="border border-gray-300 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">¿A quiénes incluye?</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="scope" value="all" checked readOnly className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">A toda la organización</p>
                <p className="text-xs text-gray-500">Todos los colaboradores activos serán incluidos.</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs border border-gray-300 text-gray-600">
                  {orgParticipants.length} colaboradores activos incluidos
                </span>
              </div>
            </label>
            <div className="ml-6">
              <button
                type="button"
                onClick={() => setShowOrgTable(v => !v)}
                className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
              >
                <span>{showOrgTable ? '▲' : '▼'}</span>
                {showOrgTable ? 'Ocultar' : 'Ver'} listado de colaboradores ({orgParticipants.length})
              </button>
              {showOrgTable && (
                <div className="mt-2 border border-gray-200 max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium whitespace-nowrap">Identificador Nacional</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Nombre</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Empresa</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Email</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Cargo</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Jefatura</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orgParticipants.map(p => (
                        <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-500 font-mono">{p.rut}</td>
                          <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                          <td className="px-3 py-2 text-gray-500">{p.empresa}</td>
                          <td className="px-3 py-2 text-gray-500">{p.email}</td>
                          <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{p.cargo}</td>
                          <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{p.jefatura}</td>
                          <td className="px-3 py-2 text-right">
                            <button type="button" onClick={() => setOrgParticipants(prev => prev.filter(x => x.id !== p.id))} className="text-gray-300 hover:text-red-500" title="Excluir">✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <label className="flex items-start gap-3 cursor-pointer opacity-40">
              <input type="radio" name="scope" value="specific" readOnly className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Carga masiva desde archivo</p>
                <p className="text-xs text-gray-500">Importa el listado de colaboradores desde un archivo .csv.</p>
              </div>
            </label>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Privacy warning modal */}
      {showPrivacyWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white border border-gray-400 p-6 max-w-md w-full mx-4">
            <h3 className="font-semibold text-gray-900 mb-2">¿Activar privacidad?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Activar la privacidad eliminará los Encargados y Visualizadores asignados. ¿Continuar?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowPrivacyWarning(false)} className="px-4 py-2 text-sm border border-gray-300">Cancelar</button>
              <button onClick={confirmPrivacy} className="px-4 py-2 text-sm border border-gray-900 bg-gray-900 text-white">Continuar</button>
            </div>
          </div>
        </div>
      )}

      {/* Section: General info */}
      <section className="border border-gray-300 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Información general</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Nombre de la evaluación <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ev.name}
              onChange={e => update('name', e.target.value)}
              className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Fecha estimada de inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={ev.startDate}
                onChange={e => update('startDate', e.target.value)}
                className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.startDate ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.startDate && <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>}
              <p className="text-xs text-gray-400 mt-1">Estas fechas son orientativas. Las fechas de apertura de cada etapa se programan por separado.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Fecha estimada de cierre <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={ev.endDate}
                onChange={e => update('endDate', e.target.value)}
                className={`w-full border px-3 py-2 text-sm focus:outline-none ${errors.endDate ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.endDate && <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Descripción del proceso
              <span className="text-gray-400 font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              value={ev.description}
              onChange={e => update('description', e.target.value.slice(0, 1000))}
              placeholder="¿Para qué sirve esta evaluación? (opcional)"
              rows={3}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-0.5">{ev.description.length}/1000</p>
            <p className="text-xs text-gray-400">Visible internamente para los administradores del proceso.</p>
          </div>
        </div>
      </section>

      {/* Section: Scope */}
      <section className="border border-gray-300 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">¿A quiénes incluye?</h3>
        <div className="space-y-3">

          {/* Option A: All organization */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="scope"
              value="all"
              checked={ev.scope === 'all'}
              onChange={() => { update('scope', 'all'); clearImport(); }}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">A toda la organización</p>
              <p className="text-xs text-gray-500">Todos los colaboradores activos serán incluidos.</p>
              {ev.scope === 'all' && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs border border-gray-300 text-gray-600">
                  {orgParticipants.length} colaboradores activos incluidos
                </span>
              )}
            </div>
          </label>

          {/* Collapsible org table */}
          {ev.scope === 'all' && (
            <div className="ml-6">
              <button
                type="button"
                onClick={() => setShowOrgTable(v => !v)}
                className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
              >
                <span>{showOrgTable ? '▲' : '▼'}</span>
                {showOrgTable ? 'Ocultar' : 'Ver'} listado de colaboradores ({orgParticipants.length})
              </button>

              {showOrgTable && (
                <div className="mt-2 border border-gray-200 max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium whitespace-nowrap">Identificador Nacional</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Nombre</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Empresa</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Email</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Cargo</th>
                        <th className="text-left px-3 py-2 text-gray-600 font-medium">Jefatura</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orgParticipants.map(p => (
                        <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-500 font-mono">{p.rut}</td>
                          <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                          <td className="px-3 py-2 text-gray-500">{p.empresa}</td>
                          <td className="px-3 py-2 text-gray-500">{p.email}</td>
                          <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{p.cargo}</td>
                          <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{p.jefatura}</td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => setOrgParticipants(prev => prev.filter(x => x.id !== p.id))}
                              className="text-gray-300 hover:text-red-500"
                              title="Excluir colaborador"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Option B: CSV import */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="scope"
              value="specific"
              checked={ev.scope === 'specific'}
              onChange={() => update('scope', 'specific')}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Carga masiva desde archivo</p>
              <p className="text-xs text-gray-500">Importa el listado de colaboradores desde un archivo .csv.</p>
            </div>
          </label>

          {/* CSV importer panel */}
          {ev.scope === 'specific' && (
            <div className="ml-6 space-y-4">

              {/* Format info + template download */}
              <div className="border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-800 mb-1">Formato esperado del archivo</p>
                  <p>Columnas requeridas: <code className="bg-gray-200 px-1">nombre</code> · Opcionales: <code className="bg-gray-200 px-1">rut</code> <code className="bg-gray-200 px-1">empresa</code> <code className="bg-gray-200 px-1">cargo</code> <code className="bg-gray-200 px-1">familia_cargo</code></p>
                  <p className="mt-0.5 text-gray-500">Separador: punto y coma (;) o coma (,) · Codificación: UTF-8</p>
                </div>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="shrink-0 text-xs border border-gray-400 px-3 py-1.5 text-gray-700 hover:bg-white whitespace-nowrap"
                >
                  ↓ Descargar plantilla
                </button>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-colors ${
                  isDragging ? 'border-gray-900 bg-gray-100' : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {csvFileName ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">📄 {csvFileName}</p>
                    <p className="text-xs text-gray-500">Haz clic para reemplazar el archivo</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">Arrastra tu archivo aquí o <span className="underline">haz clic para seleccionarlo</span></p>
                    <p className="text-xs text-gray-400">Solo archivos .csv · máx. 5 MB</p>
                  </div>
                )}
              </div>

              {/* Parse errors */}
              {csvErrors.length > 0 && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-red-700">Advertencias al procesar el archivo:</p>
                  {csvErrors.map((e, i) => (
                    <p key={i} className="text-xs text-red-600">· {e}</p>
                  ))}
                </div>
              )}

              {/* Results summary + table */}
              {ev.participants.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">
                      ✅ {ev.participants.length} colaboradores cargados
                      {csvErrors.length > 0 && (
                        <span className="ml-2 text-yellow-700">· {csvErrors.length} filas omitidas</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={clearImport}
                      className="text-xs text-gray-500 border-b border-gray-400 hover:text-red-600"
                    >
                      Limpiar importación
                    </button>
                  </div>

                  <div className="border border-gray-200 max-h-56 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-3 py-2 text-gray-600 font-medium">#</th>
                          <th className="text-left px-3 py-2 text-gray-600 font-medium">Nombre</th>
                          <th className="text-left px-3 py-2 text-gray-600 font-medium">RUT</th>
                          <th className="text-left px-3 py-2 text-gray-600 font-medium">Empresa</th>
                          <th className="text-left px-3 py-2 text-gray-600 font-medium">Cargo</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {ev.participants.map((p, i) => (
                          <tr key={p.id} className="border-b border-gray-100 last:border-0">
                            <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                            <td className="px-3 py-2 font-medium text-gray-900">{p.name}</td>
                            <td className="px-3 py-2 text-gray-500">{p.rut}</td>
                            <td className="px-3 py-2 text-gray-500">{p.empresa}</td>
                            <td className="px-3 py-2 text-gray-500">{p.cargo}</td>
                            <td className="px-3 py-2 text-right">
                              <button
                                onClick={() => removeParticipant(p.id)}
                                className="text-gray-300 hover:text-red-500"
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
                <p className="text-xs text-red-600 border border-red-200 bg-red-50 px-3 py-2">{errors.participants}</p>
              )}
            </div>
          )}

          {errors.scope && <p className="text-xs text-red-600">{errors.scope}</p>}
        </div>
      </section>

      {/* Section: Roles / Privacy */}
      <section className="border border-gray-300 p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900">¿Quién gestiona este proceso?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Define quién puede administrar esta evaluación y si quieres proteger su confidencialidad.
        </p>

        {/* Privacy toggle */}
        <div className="border border-gray-200 p-4 mb-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-gray-900">Hacer esta evaluación privada</p>
                <Tooltip text="Una evaluación privada protege la confidencialidad del proceso. Úsala cuando solo ciertos administradores deben tener acceso, independientemente de sus permisos generales en la plataforma." />
              </div>
              <p className="text-xs text-gray-500">
                Solo los usuarios designados como Responsables podrán ver, editar y gestionar este proceso.
                Los demás administradores no tendrán acceso.
              </p>
            </div>
            <Toggle checked={ev.isPrivate} onChange={handlePrivacyToggle} />
          </div>
          {ev.isPrivate && (
            <div className="mt-3 px-3 py-2 bg-gray-50 border border-gray-200 text-xs text-gray-600">
              En una evaluación privada, solo los Responsables asignados tienen acceso a este proceso.
            </div>
          )}
        </div>

        {/* Private: only Responsibles */}
        {ev.isPrivate && (
          <UserRoleSection
            title="Responsables"
            tooltip={null}
            users={ev.responsibles}
            searchValue={userSearch.responsibles}
            onSearchChange={v => setUserSearch(s => ({ ...s, responsibles: v }))}
            filteredUsers={filteredUsers('responsibles')}
            onAdd={u => addUser('responsibles', u)}
            onRemove={id => removeUser('responsibles', id)}
            extra={
              <button
                onClick={assignMe}
                className={`text-xs px-3 py-1 border ${isMeResponsible ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-400 hover:bg-gray-50 text-gray-700'}`}
                disabled={!!isMeResponsible}
              >
                {isMeResponsible ? '✅ Ya estás asignado' : 'Asignarme como responsable'}
              </button>
            }
          />
        )}

        {/* Standard (non-private): Encargados, Visualizadores, Supervisores */}
        {!ev.isPrivate && (
          <>
            <UserRoleSection
              title="Encargados"
              tooltip="Acceso completo para editar y gestionar el proceso."
              users={ev.managers}
              searchValue={userSearch.managers}
              onSearchChange={v => setUserSearch(s => ({ ...s, managers: v }))}
              filteredUsers={filteredUsers('managers')}
              onAdd={u => addUser('managers', u)}
              onRemove={id => removeUser('managers', id)}
            />
            <UserRoleSection
              title="Visualizadores"
              tooltip="Solo lectura: pueden ver el proceso y sus reportes."
              users={ev.viewers}
              searchValue={userSearch.viewers}
              onSearchChange={v => setUserSearch(s => ({ ...s, viewers: v }))}
              filteredUsers={filteredUsers('viewers')}
              onAdd={u => addUser('viewers', u)}
              onRemove={id => removeUser('viewers', id)}
            />

            <div className="border-t border-gray-200 pt-4 mt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ev.supervisorsAccess}
                  onChange={e => update('supervisorsAccess', e.target.checked)}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-900">
                      Todos los jefes directos podrán monitorear y visualizar los reportes de sus equipos
                    </p>
                    <Tooltip text="Los jefes directos acceden a los reportes de sus propios equipos sin ser asignados individualmente." />
                  </div>
                </div>
              </label>
            </div>
          </>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleSaveDraft}
          className="px-4 py-2 text-sm border border-gray-400 text-gray-700 hover:bg-gray-50"
        >
          Guardar borrador
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="px-5 py-2 text-sm font-medium bg-gray-900 text-white border border-gray-900 hover:bg-gray-700"
        >
          Guardar y continuar →
        </button>
      </div>
    </div>
  );
}

function UserRoleSection({ title, tooltip, users, searchValue, onSearchChange, filteredUsers, onAdd, onRemove, extra }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        {tooltip && <Tooltip text={tooltip} />}
        {extra && <span className="ml-auto">{extra}</span>}
      </div>
      <div className="relative mb-2">
        <input
          type="text"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar usuario (mín. 2 caracteres)..."
          className="w-full border border-gray-300 px-3 py-1.5 text-sm focus:outline-none"
        />
        {filteredUsers.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 z-20">
            {filteredUsers.map(u => (
              <button
                key={u.id}
                onClick={() => onAdd(u)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                {u.name} <span className="text-gray-500 text-xs">— {u.email}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {users.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {users.map(u => (
            <span key={u.id} className="flex items-center gap-1.5 px-2 py-1 border border-gray-300 text-xs text-gray-700 bg-gray-50">
              <span className="w-5 h-5 bg-gray-300 border border-gray-400 flex items-center justify-center text-xs font-bold uppercase">
                {u.name[0]}
              </span>
              {u.name}
              <button onClick={() => onRemove(u.id)} className="text-gray-400 hover:text-red-500 ml-1">✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
