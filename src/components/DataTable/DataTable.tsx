import { useState, useRef, useEffect } from 'react';
import styles from './DataTable.module.css';
import { FilterApp } from '../FilterApp';
import type { FilterField } from '../FilterApp';

// ─── Icons (inline SVG, sin dependencias externas) ───────────────────────────

function IconSortUp({ active }: { active?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 11V3M3.5 6.5L7 3l3.5 3.5"
        stroke={active ? '#1E5591' : '#B6CEE7'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg width="20" height="5" viewBox="0 0 20 5" fill="currentColor" aria-hidden="true">
      <circle cx="2.5" cy="2.5" r="2" />
      <circle cx="10" cy="2.5" r="2" />
      <circle cx="17.5" cy="2.5" r="2" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
      <path d="M1 1l6 5.5L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type DataTableColumnType =
  | 'text'
  | 'avatar-text'
  | 'checkbox'
  | 'check-icon'
  | 'progress'
  | 'actions';

export interface DataTableColumn {
  /** Identificador único de la columna */
  key: string;
  /** Texto del encabezado */
  title?: string;
  /** Tipo de renderizado de la celda */
  type?: DataTableColumnType;
  /** Muestra ícono de ordenamiento. Default: true para columnas de tipo text/avatar-text */
  sortable?: boolean;
}

export interface DataTableRow {
  id: string | number;
  /** URL de avatar (para columnas tipo avatar-text) */
  avatar?: string;
  /** Valor de progreso 0-100 (para columnas tipo progress) */
  [key: string]: unknown;
}

export interface DataTableProps {
  /** Definición de columnas */
  columns: DataTableColumn[];
  /** Datos de filas */
  rows: DataTableRow[];
  /** Total de registros (para texto del paginador) */
  total?: number;
  /** Página actual (1-based) */
  currentPage?: number;
  /** Callback al cambiar página */
  onPageChange?: (page: number) => void;
  /** Callback al escribir en el buscador */
  onSearch?: (query: string) => void;
  /** Campos de filtro del panel FilterApp */
  filterFields?: FilterField[];
  /** Callback al hacer clic en un campo de filtro */
  onFilterFieldClick?: (key: string, field: FilterField) => void;
  /** Callback al hacer clic en un header ordenable */
  onSort?: (key: string) => void;
  /** Callback al hacer clic en el botón de acciones de una fila */
  onRowAction?: (rowId: string | number) => void;
  /** Callback al cambiar la selección de checkboxes */
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  className?: string;
}

const DEFAULT_FILTER_FIELDS: FilterField[] = [
  { key: 'empresa',          label: 'Empresa'         },
  { key: 'centro-de-costo',  label: 'Centro de costo' },
  { key: 'por-tipo',         label: 'Por tipo'        },
];

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * DataTable (Type=Portal) — Tabla de datos del sistema Zafiro (Rex+).
 *
 * Soporta columnas tipo: checkbox, avatar-text, text, check-icon, progress, actions.
 * Incluye header con FilterApp (panel desplegable sobre la tabla) y búsqueda,
 * y paginador con contador de registros.
 */
export function DataTable({
  columns,
  rows,
  total,
  currentPage = 1,
  onPageChange,
  onSearch,
  filterFields = DEFAULT_FILTER_FIELDS,
  onFilterFieldClick,
  onSort,
  onRowAction,
  onSelectionChange,
  className,
}: DataTableProps) {
  const [searchValue, setSearchValue] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);

  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // Cierra el panel al hacer clic fuera del área de filtro
  useEffect(() => {
    if (!filterOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (filterWrapperRef.current && !filterWrapperRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [filterOpen]);

  // Total pages (simple, based on rows.length if total not provided)
  const totalRecords = total ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / rows.length || 1));

  function handleSearch(value: string) {
    setSearchValue(value);
    onSearch?.(value);
  }

  function handleSort(key: string) {
    setSortKey(key);
    onSort?.(key);
  }

  function handleSelectAll(checked: boolean) {
    const next = checked ? new Set(rows.map((r) => r.id)) : new Set<string | number>();
    setSelectedIds(next);
    onSelectionChange?.([...next]);
  }

  function handleSelectRow(id: string | number, checked: boolean) {
    const next = new Set(selectedIds);
    checked ? next.add(id) : next.delete(id);
    setSelectedIds(next);
    onSelectionChange?.([...next]);
  }

  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const someSelected = rows.some((r) => selectedIds.has(r.id)) && !allSelected;

  // Range text: "1 - N de M Registros"
  const rangeEnd = Math.min(currentPage * rows.length, totalRecords);
  const rangeStart = (currentPage - 1) * rows.length + 1;
  const rangeText = `${rangeStart} - ${rangeEnd} de ${String(totalRecords).padStart(2, '0')} Registros`;

  function renderCell(col: DataTableColumn, row: DataTableRow) {
    const value = row[col.key];

    switch (col.type) {
      case 'checkbox':
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdCheckbox}`}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedIds.has(row.id)}
              onChange={(e) => handleSelectRow(row.id, e.target.checked)}
              aria-label="Seleccionar fila"
            />
          </td>
        );

      case 'avatar-text':
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdAvatarText}`}>
            <div className={styles.cellAvatarInner}>
              {row.avatar && (
                <img src={row.avatar as string} alt="" className={styles.avatar} />
              )}
              <span>{String(value ?? '')}</span>
            </div>
          </td>
        );

      case 'check-icon':
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdIcon}`}>
            {value !== false && (
              <span className={styles.checkIcon} aria-label="Completado">
                <IconCheckCircle />
              </span>
            )}
          </td>
        );

      case 'progress': {
        const pct = Math.min(100, Math.max(0, Number(value ?? 0)));
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdProgress}`}>
            <div className={styles.progressBar} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
          </td>
        );
      }

      case 'actions':
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdActions}`}>
            <button
              className={styles.moreBtn}
              type="button"
              aria-label="Más acciones"
              onClick={() => onRowAction?.(row.id)}
            >
              <IconMore />
            </button>
          </td>
        );

      default:
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdText}`}>
            {String(value ?? '')}
          </td>
        );
    }
  }

  function renderHeaderCell(col: DataTableColumn) {
    const isSortable =
      col.sortable !== false &&
      (col.type === 'text' || col.type === 'avatar-text' || col.type === 'check-icon' || col.type === 'progress' || col.sortable === true);

    if (col.type === 'checkbox') {
      return (
        <th key={col.key} className={`${styles.th} ${styles.thCheckbox}`}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected; }}
            onChange={(e) => handleSelectAll(e.target.checked)}
            aria-label="Seleccionar todo"
          />
        </th>
      );
    }

    if (col.type === 'actions') {
      return <th key={col.key} className={`${styles.th} ${styles.thActions}`} />;
    }

    const thClass = col.type === 'check-icon'
      ? `${styles.th} ${styles.thIcon}`
      : col.type === 'progress'
      ? `${styles.th} ${styles.thProgress}`
      : styles.th;

    return (
      <th key={col.key} className={thClass}>
        {col.title && (
          <div className={styles.thInner}>
            {isSortable ? (
              <button
                className={styles.thSortBtn}
                type="button"
                onClick={() => handleSort(col.key)}
                aria-label={`Ordenar por ${col.title}`}
              >
                <IconSortUp active={sortKey === col.key} />
                {col.title}
              </button>
            ) : (
              col.title
            )}
          </div>
        )}
      </th>
    );
  }

  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>

      {/* ── Header ── */}
      <div className={styles.header}>

        {/* Filtro — trigger siempre visible, panel se despliega sobre la tabla */}
        <div className={styles.filterWrapper} ref={filterWrapperRef}>
          <FilterApp
            expanded={false}
            onToggle={() => setFilterOpen((prev) => !prev)}
          />
          {filterOpen && (
            <div className={styles.filterPanel} role="dialog" aria-label="Opciones de filtro">
              <FilterApp
                expanded={true}
                fields={filterFields}
                onFieldClick={(key, field) => onFilterFieldClick?.(key, field)}
              />
            </div>
          )}
        </div>

        <div className={styles.searchWrapper} role="search">
          <span className={styles.searchIcon}>
            <IconSearch />
          </span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Buscar"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Buscar en la tabla"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Tabla de datos">
          <thead>
            <tr>{columns.map((col) => renderHeaderCell(col))}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => renderCell(col, row))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Paginator ── */}
      <div className={styles.paginator}>
        <div className={styles.paginatorPages}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn}${p === currentPage ? ` ${styles.active}` : ''}`}
              type="button"
              onClick={() => onPageChange?.(p)}
              aria-label={`Página ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            className={styles.paginatorNext}
            type="button"
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            aria-label="Siguiente página"
            disabled={currentPage >= totalPages}
          >
            <IconChevronRight />
          </button>
        </div>
        <p className={styles.paginatorInfo}>{rangeText}</p>
      </div>
    </div>
  );
}
