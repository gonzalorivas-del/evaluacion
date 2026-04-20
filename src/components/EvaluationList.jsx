import { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { Button } from './Button';
import tokens from '../tokens/tokens.json';

// ── Token values ──────────────────────────────────────────────────────────────
const C = {
  primario:          tokens.colors.primario['$value'],
  primOscuro:        tokens.colors['primario-oscuro']['$value'],
  fondo:             tokens.colors.fondo['$value'],
  auxiliar:          tokens.colors.auxiliar['$value'],
  grisPrimario:      tokens.colors['gris-primario']['$value'],
  grisSecundario:    tokens.colors['gris-secundario']['$value'],
  grisDeshabilitado: tokens.colors['gris-deshabilitado']['$value'],
  grisTextos:        tokens.colors['gris-textos']['$value'],
  grisOscuro:        tokens.colors['gris-oscuro']['$value'],
  negroTextos:       tokens.colors['negro-textos']['$value'],
  blanco:            tokens.colors.blanco['$value'],
  importante:        tokens.colors.importante['$value'],
};

const T = {
  roboto: tokens.typography['font-family'].roboto['$value'],
  sz12:   `${tokens.typography['font-size']['12']['$value']}px`,
  sz13:   '13px',
  sz14:   `${tokens.typography['font-size']['14']['$value']}px`,
  sz22:   `${tokens.typography['font-size']['22']['$value']}px`,
};

const shadow1 = tokens.effects['elevation-1']['$value'];
const br5     = `${tokens.zafiro['border-radius']['br-5']['$value'].M}px`; // 24px
const br2     = `${tokens.zafiro['border-radius']['br-2']['$value'].M}px`; // 4px
const p4      = `${tokens.zafiro.padding['p-4']['$value'].M}px`;           // 16px
const p5      = `${tokens.zafiro.padding['p-5']['$value'].M}px`;           // 24px

// ── Icons (inline SVG) ────────────────────────────────────────────────────────

function IconArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 4.5L6 10l6.5 5.5" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 6h13" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1v2M10.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none" aria-hidden="true">
      <path d="M1 1.5h13M3.5 6.5h8M6 11.5h3" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true">
      <path d="M1 1l4.5 5L10 1" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
      <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
      <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12L15.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconSortUp({ active }) {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 11V3M3.5 6.5L7 3l3.5 3.5"
        stroke={active ? C.primario : C.auxiliar}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMore() {
  return (
    <svg width="18" height="4" viewBox="0 0 18 4" fill="currentColor" aria-hidden="true">
      <circle cx="2" cy="2" r="2" />
      <circle cx="9" cy="2" r="2" />
      <circle cx="16" cy="2" r="2" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" />
    </svg>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Activa:    { bg: '#E8F4FF', border: C.auxiliar,          color: C.primario   },
  Finalizada:{ bg: C.grisPrimario, border: C.grisDeshabilitado, color: C.grisOscuro  },
  Borrador:  { bg: C.grisPrimario, border: C.grisSecundario,    color: C.grisTextos  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Borrador;
  return (
    <span
      role="status"
      aria-label={`Estado: ${status}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3px 10px',
        borderRadius: br2,
        border: `1px solid ${cfg.border}`,
        backgroundColor: cfg.bg,
        color: cfg.color,
        fontFamily: T.roboto,
        fontSize: T.sz12,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

// ── ChipCount ─────────────────────────────────────────────────────────────────
function ChipCount({ count }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 5px',
      borderRadius: br2,
      backgroundColor: C.grisSecundario,
      color: C.grisOscuro,
      fontFamily: T.roboto,
      fontSize: '11px',
      fontWeight: 500,
      lineHeight: 1,
    }}>
      +{count}
    </span>
  );
}

// ── ChipVer ───────────────────────────────────────────────────────────────────
function ChipVer({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ver detalle"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: br2,
        border: `1px solid ${C.auxiliar}`,
        backgroundColor: 'transparent',
        color: C.primario,
        fontFamily: T.roboto,
        fontSize: '11px',
        fontWeight: 500,
        cursor: 'pointer',
        lineHeight: 1,
      }}
    >
      Ver
    </button>
  );
}

// ── Column definitions ────────────────────────────────────────────────────────
const COLUMNS = [
  { key: 'id',        title: 'ID',         sortable: true  },
  { key: 'name',      title: 'Nombre',     sortable: true  },
  { key: 'empresa',   title: 'Empresa',    sortable: true  },
  { key: 'startDate', title: 'F. Inicio',  sortable: true  },
  { key: 'endDate',   title: 'F. Término', sortable: true  },
  { key: 'template',  title: 'Dirección',  sortable: true  },
  { key: 'status',    title: 'Estado',     sortable: true  },
  { key: 'actions',   title: '',           sortable: false },
];

const ROWS_OPTIONS = [8, 16, 24];

// ── EvaluationList ────────────────────────────────────────────────────────────

/**
 * Vista de listado de evaluaciones — Zafiro Design System (Rex+).
 * Diseño: Figma RDV-689 node 1053:17539
 */
export default function EvaluationList() {
  const { evaluations, setShowTypeModal, openExistingEval } = useEvaluation();
  const [search,      setSearch]      = useState('');
  const [sortKey,     setSortKey]     = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const filtered = evaluations.filter(ev => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      ev.name.toLowerCase().includes(q) ||
      ev.empresa.toLowerCase().includes(q) ||
      (ev.template ?? '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * rowsPerPage;
  const pageRows  = filtered.slice(pageStart, pageStart + rowsPerPage);

  function handleChangePage(page) {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  }

  function handleRowsPerPage(n) {
    setRowsPerPage(n);
    setCurrentPage(1);
  }

  // Visible page numbers: 1 2 3 4 5 … N
  function getPageNumbers() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums = [1, 2, 3, 4, 5, '…', totalPages];
    return nums;
  }

  // ── Shared cell/header styles ──────────────────────────────────────────────
  const thBase = {
    fontFamily: T.roboto,
    fontSize: T.sz14,
    fontWeight: 500,
    color: C.negroTextos,
    padding: '10px 12px',
    textAlign: 'left',
    borderBottom: `1px solid ${C.auxiliar}`,
    whiteSpace: 'nowrap',
    backgroundColor: C.blanco,
  };

  const tdBase = {
    fontFamily: T.roboto,
    fontSize: T.sz14,
    fontWeight: 400,
    color: C.negroTextos,
    padding: '0 12px',
    height: '48px',
    textAlign: 'left',
    borderBottom: `1px solid ${C.auxiliar}`,
    whiteSpace: 'nowrap',
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: C.fondo,
      fontFamily: T.roboto,
    }}>
      {/* Breadcrumb */}
      <div style={{
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: T.sz13,
        color: C.grisTextos,
      }}>
        <span>/</span>
        <span>Evaluaciones</span>
        <span>/</span>
      </div>

      {/* Content area */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `0 ${p5} 32px`,
      }}>

        {/* Page header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              aria-label="Volver"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: C.primario,
                padding: '4px',
                borderRadius: '50%',
              }}
            >
              <IconArrowLeft />
            </button>
            <h1 style={{
              margin: 0,
              fontFamily: T.roboto,
              fontSize: T.sz22,
              fontWeight: 600,
              color: C.negroTextos,
              lineHeight: 1.2,
            }}>
              Evaluaciones
            </h1>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<IconPlus />}
            iconPosition="left"
            onClick={() => setShowTypeModal(true)}
          >
            Nuevo proceso
          </Button>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: C.blanco,
          borderRadius: br5,
          boxShadow: shadow1,
          overflow: 'hidden',
        }}>

          {/* Filter bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `14px ${p5}`,
            borderBottom: `1px solid ${C.auxiliar}`,
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            {/* Left: filter chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Date range chip */}
              <button
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: `1px solid ${C.grisDeshabilitado}`,
                  backgroundColor: C.grisPrimario,
                  color: C.negroTextos,
                  fontFamily: T.roboto,
                  fontSize: T.sz13,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                <span style={{ color: C.primario, display: 'flex' }}><IconCalendar /></span>
                Jun 2020 – Dic 2023
                <span style={{ color: C.grisOscuro, display: 'flex' }}><IconChevronDown /></span>
              </button>

              {/* Filtros chip */}
              <button
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: `1px solid ${C.grisDeshabilitado}`,
                  backgroundColor: C.grisPrimario,
                  color: C.negroTextos,
                  fontFamily: T.roboto,
                  fontSize: T.sz13,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                <span style={{ color: C.grisOscuro, display: 'flex' }}><IconFilter /></span>
                Filtros
                <span style={{ color: C.grisOscuro, display: 'flex' }}><IconChevronDown /></span>
              </button>
            </div>

            {/* Right: search */}
            <div
              role="search"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: `1px solid ${C.grisDeshabilitado}`,
                borderRadius: '20px',
                padding: '6px 14px',
                width: '240px',
                flexShrink: 0,
              }}
            >
              <span style={{ color: C.grisOscuro, display: 'flex', alignItems: 'center' }}>
                <IconSearch />
              </span>
              <input
                type="search"
                placeholder="Buscar contenido"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Buscar evaluaciones"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: T.roboto,
                  fontSize: T.sz14,
                  color: C.negroTextos,
                  minWidth: 0,
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table
              aria-label="Listado de evaluaciones"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'auto',
              }}
            >
              <thead>
                <tr>
                  {COLUMNS.map(col => (
                    <th
                      key={col.key}
                      style={{
                        ...thBase,
                        ...(col.key === 'id'      ? { paddingLeft: p5 } : {}),
                        ...(col.key === 'actions' ? { width: '52px', textAlign: 'center' } : {}),
                      }}
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                            fontWeight: 'inherit',
                            color: 'inherit',
                            padding: 0,
                            whiteSpace: 'nowrap',
                          }}
                          onClick={() => setSortKey(col.key)}
                          aria-label={`Ordenar por ${col.title}`}
                        >
                          <IconSortUp active={sortKey === col.key} />
                          {col.title}
                        </button>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={COLUMNS.length}
                      style={{
                        ...tdBase,
                        textAlign: 'center',
                        padding: '40px',
                        color: C.grisTextos,
                        height: 'auto',
                      }}
                    >
                      No hay evaluaciones que coincidan con los filtros.
                    </td>
                  </tr>
                ) : (
                  pageRows.map(ev => (
                    <EvaluationRow
                      key={ev.id}
                      ev={ev}
                      tdBase={tdBase}
                      onOpen={openExistingEval}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: p4,
            padding: `14px ${p5}`,
            borderTop: `1px solid ${C.auxiliar}`,
          }}>

            {/* Rows per page */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: T.sz14, color: C.grisOscuro }}>Filas</span>
              <select
                value={rowsPerPage}
                onChange={e => handleRowsPerPage(Number(e.target.value))}
                aria-label="Filas por página"
                style={{
                  border: `1px solid ${C.grisDeshabilitado}`,
                  borderRadius: br2,
                  padding: '2px 4px',
                  fontSize: T.sz14,
                  color: C.negroTextos,
                  backgroundColor: C.blanco,
                  cursor: 'pointer',
                  fontFamily: T.roboto,
                }}
              >
                {ROWS_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Page controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Prev */}
              <button
                type="button"
                aria-label="Página anterior"
                disabled={safeCurrentPage === 1}
                onClick={() => handleChangePage(safeCurrentPage - 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'none',
                  cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                  color: safeCurrentPage === 1 ? C.grisDeshabilitado : C.negroTextos,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconChevronLeft />
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((p, i) =>
                p === '…' ? (
                  <span
                    key={`ellipsis-${i}`}
                    style={{
                      fontSize: T.sz14,
                      color: C.grisTextos,
                      padding: '0 2px',
                      lineHeight: 1,
                    }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    aria-label={`Página ${p}`}
                    aria-current={p === safeCurrentPage ? 'page' : undefined}
                    onClick={() => handleChangePage(p)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: T.roboto,
                      fontSize: T.sz14,
                      fontWeight: p === safeCurrentPage ? 500 : 400,
                      backgroundColor: p === safeCurrentPage ? C.importante : 'transparent',
                      color: p === safeCurrentPage ? C.blanco : C.negroTextos,
                      transition: 'background-color 0.15s',
                    }}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                type="button"
                aria-label="Página siguiente"
                disabled={safeCurrentPage >= totalPages}
                onClick={() => handleChangePage(safeCurrentPage + 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'none',
                  cursor: safeCurrentPage >= totalPages ? 'not-allowed' : 'pointer',
                  color: safeCurrentPage >= totalPages ? C.grisDeshabilitado : C.negroTextos,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconChevronRight />
              </button>
            </div>
          </div>

        </div>{/* /Card */}
      </div>{/* /Content area */}
    </div>
  );
}

// ── EvaluationRow ─────────────────────────────────────────────────────────────
// Extracted to avoid inline event handlers in tbody map
function EvaluationRow({ ev, tdBase, onOpen }) {
  const [hovered, setHovered] = useState(false);

  const rowStyle = {
    cursor: 'pointer',
    backgroundColor: hovered ? C.grisPrimario : 'transparent',
    transition: 'background-color 0.1s',
  };

  return (
    <tr
      style={rowStyle}
      onClick={() => onOpen(ev)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ID */}
      <td style={{ ...tdBase, paddingLeft: p5, color: C.grisOscuro, fontSize: T.sz13 }}>
        {ev.id}
      </td>

      {/* Nombre */}
      <td style={{ ...tdBase, fontWeight: 500, minWidth: '160px' }}>
        {ev.name}
      </td>

      {/* Empresa */}
      <td style={{ ...tdBase, minWidth: '180px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span>{ev.empresa}</span>
          <ChipCount count={1} />
          <ChipVer onClick={e => e.stopPropagation()} />
        </div>
      </td>

      {/* F. Inicio */}
      <td style={{ ...tdBase, color: C.grisOscuro, minWidth: '105px' }}>
        {ev.startDate}
      </td>

      {/* F. Término */}
      <td style={{ ...tdBase, color: C.grisOscuro, minWidth: '105px' }}>
        {ev.endDate}
      </td>

      {/* Dirección */}
      <td style={{ ...tdBase, minWidth: '200px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span>{ev.template}</span>
          <ChipCount count={1} />
          <ChipVer onClick={e => e.stopPropagation()} />
        </div>
      </td>

      {/* Estado */}
      <td style={{ ...tdBase, minWidth: '110px' }}>
        <StatusBadge status={ev.status} />
      </td>

      {/* Acciones */}
      <td
        style={{ ...tdBase, textAlign: 'center', width: '52px' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Más acciones"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: C.importante,
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px',
            borderRadius: br2,
          }}
        >
          <IconMore />
        </button>
      </td>
    </tr>
  );
}
