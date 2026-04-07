import { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';

export default function EvaluationList() {
  const { evaluations, setShowTypeModal, openExistingEval } = useEvaluation();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = evaluations.filter(ev => {
    const matchSearch = !search || ev.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || ev.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status) => {
    const base = 'px-2 py-0.5 text-xs border font-medium';
    if (status === 'Activa') return <span className={`${base} border-gray-900 bg-gray-100`}>Activa</span>;
    if (status === 'Finalizada') return <span className={`${base} border-gray-400 text-gray-500`}>Finalizada</span>;
    return <span className={`${base} border-gray-300 text-gray-500`}>Borrador</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
        <span>Inicio</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">Evaluaciones</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Evaluaciones</h1>
          <button
            onClick={() => setShowTypeModal(true)}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium border border-gray-900 hover:bg-gray-700 transition-colors"
          >
            Nueva evaluación +
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar evaluación..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-gray-500"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500"
          >
            <option value="">Todos los estados</option>
            <option value="Borrador">Borrador</option>
            <option value="Activa">Activa</option>
            <option value="Finalizada">Finalizada</option>
          </select>
          <span className="text-sm text-gray-500">{filtered.length} evaluaciones</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-300">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-600 font-medium">ID</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Empresa</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha inicio</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha término</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Formulario</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Etapas</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-400">
                    No hay evaluaciones que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filtered.map((ev, i) => (
                  <tr
                    key={ev.id}
                    className={`border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}
                    onClick={() => openExistingEval(ev)}
                  >
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{ev.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 hover:underline">{ev.name}</td>
                    <td className="px-4 py-3 text-gray-600">{ev.empresa}</td>
                    <td className="px-4 py-3 text-gray-600">{ev.startDate}</td>
                    <td className="px-4 py-3 text-gray-600">{ev.endDate}</td>
                    <td className="px-4 py-3 text-gray-600">{ev.template}</td>
                    <td className="px-4 py-3 text-gray-600">{ev.formType}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{ev.stages}</td>
                    <td className="px-4 py-3">{statusBadge(ev.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {evaluations.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No hay evaluaciones creadas</p>
            <p className="text-sm">Haz clic en "Nueva evaluación +" para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
