import { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { Button } from './Button';
import { Badge } from './Badge';
import { Card } from './Card';
import { CardOption } from './CardOption';
import { Tabs } from './Tabs';
import { Textarea } from './Textarea';
import { Radiobutton } from './Radiobutton';
import { Checkbox } from './Checkbox';
import { Chip } from './Chip';
import { Uploader } from './Uploader';
import { Section } from './Section';
import { Totalizador } from './Totalizador';
import { InputField } from './InputField';
import { Snackbar } from './Snackbar';
import { DataTable } from './DataTable';
import { Selector } from './Selector';
import { MenuPortal } from './MenuPortal';
import { ActivityMonitor } from './ActivityMonitor';
import { FilterApp } from './FilterApp';
import { Breadcrumb } from './Breadcrumb';
import { BloquesSeleccion } from './BloquesSeleccion';
import Toggle from './ui/Toggle';
import { ResumenSeccion, ResumenSeccionContent, ResumenCampo } from './ResumenSeccion';
import { GrupoEvaluacion } from './GrupoEvaluacion';
import tokens from '../tokens/tokens.json';

const c = tokens.colors;

/* ─── Estilos base ────────────────────────────────────────────────────────── */

const pageStyle = {
  minHeight: '100vh',
  background: c.fondo.$value,
  fontFamily: 'Roboto, sans-serif',
  color: '#333333',
};

const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: c['primario-oscuro'].$value,
  color: '#fff',
  padding: '16px 40px',
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  boxShadow: '0px 4px 16px rgba(0,0,0,0.18)',
};

const backBtnStyle = {
  background: 'none',
  border: `1px solid ${c.auxiliar.$value}`,
  color: c.auxiliar.$value,
  cursor: 'pointer',
  padding: '6px 16px',
  borderRadius: '20px',
  fontSize: '13px',
  fontFamily: 'Roboto, sans-serif',
  flexShrink: 0,
};

const mainStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '48px 40px 80px',
};

const tocStyle = {
  background: '#fff',
  border: `1px solid ${c.auxiliar.$value}`,
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '48px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px 24px',
};

const tocItemStyle = {
  fontSize: '13px',
  color: c.primario.$value,
  textDecoration: 'none',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: '0',
  fontFamily: 'Roboto, sans-serif',
};

const sectionStyle = {
  marginBottom: '64px',
};

const sectionHeadStyle = {
  marginBottom: '20px',
};

const sectionTitleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: c.primario.$value,
  fontFamily: 'Montserrat, sans-serif',
  margin: '0 0 4px 0',
  paddingBottom: '10px',
  borderBottom: `2px solid ${c.auxiliar.$value}`,
};

const sectionDescStyle = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '8px 0 0 0',
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
  alignItems: 'flex-start',
};

const itemLabelStyle = {
  fontSize: '11px',
  color: '#9ca3af',
  marginBottom: '6px',
  fontFamily: 'Roboto, sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const groupTitleStyle = {
  fontSize: '12px',
  color: '#6b7280',
  fontWeight: '500',
  margin: '0 0 12px 0',
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function ShowcaseItem({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <span style={itemLabelStyle}>{label}</span>}
      {children}
    </div>
  );
}

function GroupLabel({ children }) {
  return <p style={groupTitleStyle}>{children}</p>;
}

function Divider() {
  return <div style={{ height: '1px', background: c.auxiliar.$value, opacity: 0.5, margin: '28px 0' }} />;
}

/* ─── Datos de ejemplo para DataTable ────────────────────────────────────── */

const TABLE_COLUMNS = [
  { key: 'select', type: 'checkbox' },
  { key: 'name', title: 'Nombre', type: 'avatar-text' },
  { key: 'empresa', title: 'Empresa', type: 'text' },
  { key: 'status', title: 'Estado', type: 'text' },
  { key: 'progress', title: 'Avance', type: 'progress' },
  { key: 'done', title: 'Listo', type: 'check-icon' },
  { key: 'actions', type: 'actions' },
];

const TABLE_ROWS = [
  { id: 1, name: 'Ana García', empresa: 'Empresa A', status: 'Activa', progress: 80, done: true },
  { id: 2, name: 'Luis Pérez', empresa: 'Tech S.A.', status: 'Borrador', progress: 35, done: false },
  { id: 3, name: 'María López', empresa: 'Empresa A', status: 'Activa', progress: 95, done: true },
];

/* ─── Secciones del índice ─────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'botones', label: 'Botones' },
  { id: 'formularios', label: 'Formularios' },
  { id: 'badges', label: 'Badges' },
  { id: 'notificaciones', label: 'Notificaciones' },
  { id: 'activity-monitor', label: 'Activity Monitor' },
  { id: 'tarjetas', label: 'Tarjetas' },
  { id: 'card-option', label: 'Card Option' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'textarea', label: 'Textarea' },
  { id: 'radiobutton', label: 'Radiobutton' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'chips', label: 'Chips' },
  { id: 'uploader', label: 'Uploader' },
  { id: 'sections', label: 'Sections' },
  { id: 'totalizador', label: 'Totalizador' },
  { id: 'tabla', label: 'Tabla de datos' },
  { id: 'breadcrumb', label: 'Breadcrumb' },
  { id: 'navegacion', label: 'Navegación' },
  { id: 'bloques-seleccion', label: 'Bloques de Selección' },
  { id: 'utilidades', label: 'Utilidades' },
  { id: 'resumen-seccion', label: 'Resumen Sección' },
  { id: 'grupo-evaluacion', label: 'Grupo Evaluación' },
];

/* ─── Demo interactivo CardOption ─────────────────────────────────────────── */

const CARD_OPTIONS_DEMO = [
  {
    id: '90',
    title: '90°',
    subtitle: 'Evaluación directa',
    description: 'Solo el jefe evalúa al colaborador. Sin auto-evaluación ni otras fuentes.',
    recommended: false,
  },
  {
    id: '180',
    title: '180°',
    subtitle: 'La más usada',
    description: 'El jefe evalúa al colaborador y el colaborador se auto-evalúa.',
    recommended: true,
  },
  {
    id: '360',
    title: '360°',
    subtitle: 'Evaluación completa',
    description: 'Jefe, pares, subordinados y auto-evaluación. Visión 360° del colaborador.',
    recommended: false,
  },
  {
    id: 'obj',
    title: 'Objetivos',
    subtitle: 'Por metas',
    description: 'Evaluación basada en el cumplimiento de objetivos definidos previamente.',
    recommended: false,
  },
];

function CardOptionInteractiveDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 340 }}>
      {CARD_OPTIONS_DEMO.map((opt) => (
        <CardOption
          key={opt.id}
          title={opt.title}
          subtitle={opt.subtitle}
          description={opt.description}
          recommended={opt.recommended}
          selected={selected === opt.id}
          onClick={() => setSelected(opt.id)}
        />
      ))}
    </div>
  );
}

/* ─── Demo interactivo Tabs ───────────────────────────────────────────────── */

const WIZARD_TABS = [
  { key: 'datos',         label: 'Datos del proceso'  },
  { key: 'estructura',    label: 'Estructura'          },
  { key: 'formulario',    label: 'Formulario'          },
  { key: 'notificaciones',label: 'Notificaciones'      },
  { key: 'resumen',       label: 'Resumen y activación'},
];

/* ─── Demo interactivo BloquesSeleccion ──────────────────────────────────── */

const MOCK_COMPETENCIAS_BS = [
  { id: 1, name: 'Innovación', description: 'Genera ideas creativas y busca mejoras continuas.' },
  { id: 2, name: 'Liderazgo', description: 'Inspira y guía a otros hacia objetivos comunes.' },
  { id: 3, name: 'Trabajo en equipo', description: 'Colabora y contribuye al logro grupal.' },
  { id: 4, name: 'Integridad', description: 'Actúa con honestidad y coherencia ética en cada acción.' },
  { id: 5, name: 'Compromiso', description: 'Demuestra dedicación y responsabilidad en sus funciones.' },
];

const SCALE_OPTIONS_BS = [
  { value: 'likert1-5', label: 'Desempeño 1-5 Likert' },
  { value: 'excellence', label: 'Escala de Excelencia' },
  { value: '1-6', label: '1 al 6' },
  { value: '1-10', label: '1 al 10' },
];

function BloquesSeleccionDemo() {
  const [selected, setSelected] = useState([]);

  const toggle = (comp) => {
    setSelected(prev => {
      const exists = prev.find(c => c.id === comp.id);
      return exists
        ? prev.filter(c => c.id !== comp.id)
        : [...prev, { ...comp, scale: 'likert1-5', percentage: 0 }];
    });
  };

  const updateScale = (id, scale) => {
    setSelected(prev => prev.map(c => (c.id === id ? { ...c, scale } : c)));
  };

  const updatePercentage = (id, percentage) => {
    setSelected(prev => prev.map(c => (c.id === id ? { ...c, percentage } : c)));
  };

  return (
    <BloquesSeleccion
      available={MOCK_COMPETENCIAS_BS}
      selected={selected}
      onToggle={toggle}
      onUpdateScale={updateScale}
      onUpdatePercentage={updatePercentage}
      scaleOptions={SCALE_OPTIONS_BS}
      currentScale="likert1-5"
    />
  );
}

function TabsTextDemo() {
  const [active, setActive] = useState('datos');
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <Tabs
          tabs={WIZARD_TABS}
          activeKey={active}
          variant="text"
          onTabClick={setActive}
        />
      </div>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: 8 }}>
        Tab activo: <strong style={{ color: '#00b4ff' }}>{WIZARD_TABS.find(t => t.key === active)?.label}</strong>
      </p>
    </div>
  );
}

/* ─── Demo interactivo Uploader ──────────────────────────────────────────── */

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploaderDemo() {
  const [file, setFile] = useState(null);

  function handleFileChange(f) {
    setFile({ name: f.name, size: formatFileSize(f.size) });
  }

  return (
    <div style={{ maxWidth: 687 }}>
      <Uploader
        file={file}
        onFileChange={handleFileChange}
        onFileRemove={() => setFile(null)}
        onDownloadTemplate={() => alert('Descargando plantilla…')}
      />
    </div>
  );
}

/* ─── Demo interactivo Chip ───────────────────────────────────────────────── */

function ChipFilterDemo() {
  const [open, setOpen] = useState(null);
  const [active, setActive] = useState({ empresa: false, tipo: true, estado: false });

  const filters = [
    { key: 'empresa', label: 'Empresa', count: undefined },
    { key: 'tipo',    label: 'Tipo de evaluación', count: 2 },
    { key: 'estado',  label: 'Estado', count: undefined },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {filters.map((f) => (
        <Chip
          key={f.key}
          label={f.label}
          count={f.count}
          active={active[f.key]}
          expanded={open === f.key}
          onClick={() => {
            setOpen((prev) => (prev === f.key ? null : f.key));
            setActive((prev) => ({ ...prev, [f.key]: !prev[f.key] }));
          }}
        />
      ))}
    </div>
  );
}

/* ─── Demo interactivo Radiobutton ───────────────────────────────────────── */

function RadiobuttonGroupDemo() {
  const [selected, setSelected] = useState('area');

  const options = [
    { value: 'org',   label: 'Toda la organización' },
    { value: 'area',  label: 'Área específica' },
    { value: 'cargo', label: 'Por cargo' },
    { value: 'grupo', label: 'Grupo personalizado' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {options.map((opt) => (
        <Radiobutton
          key={opt.value}
          name="alcance-demo"
          value={opt.value}
          label={opt.label}
          checked={selected === opt.value}
          onChange={setSelected}
        />
      ))}
      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
        Seleccionado: <strong style={{ color: c.primario.$value }}>{
          options.find((o) => o.value === selected)?.label
        }</strong>
      </p>
    </div>
  );
}

/* ─── Demo interactivo Checkbox ──────────────────────────────────────────── */

function CheckboxListDemo() {
  const [selected, setSelected] = useState({
    potencial: true,
    competencias: true,
    objetivos: false,
  });

  const allChecked = Object.values(selected).every(Boolean);
  const noneChecked = Object.values(selected).every((v) => !v);
  const someChecked = !allChecked && !noneChecked;

  function toggleAll(checked) {
    setSelected({ potencial: checked, competencias: checked, objetivos: checked });
  }

  function toggleOne(key, checked) {
    setSelected((prev) => ({ ...prev, [key]: checked }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 340 }}>
      {/* Seleccionar todos — estado indeterminate cuando hay mezcla */}
      <Checkbox
        label="Seleccionar todos"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={toggleAll}
      />
      <div style={{ paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Checkbox label="Incluir evaluación de potencial" checked={selected.potencial} onChange={(v) => toggleOne('potencial', v)} />
        <Checkbox label="Incluir evaluación de competencias" checked={selected.competencias} onChange={(v) => toggleOne('competencias', v)} />
        <Checkbox label="Incluir evaluación de objetivos" checked={selected.objetivos} onChange={(v) => toggleOne('objetivos', v)} />
      </div>
    </div>
  );
}

/* ─── Demo interactivo Textarea ───────────────────────────────────────────── */

function TextareaCounterDemo() {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: 560 }}>
      <Textarea
        label="Descripción del proceso"
        placeholder="Describe el proceso aquí"
        value={value}
        onChange={setValue}
        maxLength={1000}
        supportingText={value.length === 0 ? 'Escribe una descripción para ver el contador.' : undefined}
      />
    </div>
  );
}

/* ─── Demo interactivo Section ───────────────────────────────────────────── */

const SECTION_DIRECTIONS = [
  { key: 'descendente',    title: 'Descendente',    description: 'El jefe directo evalúa al colaborador.' },
  { key: 'autoevaluacion', title: 'Autoevaluación', description: 'El colaborador se evalúa a sí mismo.'  },
  { key: 'par',            title: 'Par',             description: 'Un compañero de trabajo evalúa al colaborador.' },
];

function SectionGroupDemo() {
  const [states, setStates] = useState(() =>
    Object.fromEntries(
      SECTION_DIRECTIONS.map((d) => [
        d.key,
        { open: false, percentage: '', isPrivate: false },
      ])
    )
  );

  function update(key, patch) {
    setStates((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: 687 }}>
      {SECTION_DIRECTIONS.map((d) => (
        <Section
          key={d.key}
          title={d.title}
          description={d.description}
          open={states[d.key].open}
          onToggle={(v) => update(d.key, { open: v })}
          percentage={states[d.key].percentage}
          onPercentageChange={(v) => update(d.key, { percentage: v })}
          isPrivate={states[d.key].isPrivate}
          onPrivateChange={(v) => update(d.key, { isPrivate: v })}
          onInfoClick={() => alert(`Info sobre "${d.title}"`)}
          onScheduleOpen={() => alert(`Programar apertura de "${d.title}"`)}
        />
      ))}
    </div>
  );
}

/* ─── Demo interactivo Totalizador ──────────────────────────────────────── */

function TotalizadorDemo() {
  const [total, setTotal] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: 500 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label style={{ fontSize: '13px', color: '#666', fontFamily: 'Roboto, sans-serif', flexShrink: 0 }}>
          Total:
        </label>
        <input
          type="range"
          min={0}
          max={120}
          step={5}
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: '13px', fontWeight: 500, color: c.primario.$value, width: 40, textAlign: 'right', fontFamily: 'Roboto, sans-serif' }}>
          {total}%
        </span>
      </div>
      <Totalizador total={total} />
    </div>
  );
}

/* ─── Componente principal ────────────────────────────────────────────────── */

export default function ComponentsShowroom() {
  const { setView } = useEvaluation();
  const [menuOpen, setMenuOpen] = useState(true);
  const [menuType, setMenuType] = useState('Supervisor');
  const [toggleA, setToggleA] = useState(false);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div style={pageStyle}>
      {/* ── Header ── */}
      <header style={headerStyle}>
        <button style={backBtnStyle} onClick={() => setView('list')}>
          ← Volver
        </button>
        <div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '700', margin: 0 }}>
            ComponentsShowroom
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '12px', opacity: 0.65 }}>
            Sistema de diseño Zafiro — Rex+ · {SECTIONS.length} tipos de componentes
          </p>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={mainStyle}>

        {/* Índice de secciones */}
        <nav aria-label="Índice de componentes" style={tocStyle}>
          {SECTIONS.map((s) => (
            <button key={s.id} style={tocItemStyle} onClick={() => scrollTo(s.id)}>
              {s.label}
            </button>
          ))}
        </nav>

        {/* ══════════════════════════════════════════════
            1. BOTONES
        ══════════════════════════════════════════════ */}
        <section id="botones" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Botones</h2>
            <p style={sectionDescStyle}>Button — 5 variantes · 3 tamaños · íconos · estados disabled y loading</p>
          </div>

          <GroupLabel>Variantes (tamaño md)</GroupLabel>
          <div style={{ ...rowStyle, marginBottom: '28px' }}>
            {['primary', 'secondary', 'tertiary', 'link', 'ia'].map((v) => (
              <ShowcaseItem key={v} label={v}>
                <Button variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              </ShowcaseItem>
            ))}
          </div>

          <Divider />

          <GroupLabel>Tamaños (variante primary)</GroupLabel>
          <div style={{ ...rowStyle, alignItems: 'center', marginBottom: '28px' }}>
            {['sm', 'md', 'lg'].map((s) => (
              <ShowcaseItem key={s} label={s}>
                <Button size={s}>Botón {s.toUpperCase()}</Button>
              </ShowcaseItem>
            ))}
          </div>

          <Divider />

          <GroupLabel>Estados y variantes especiales</GroupLabel>
          <div style={rowStyle}>
            <ShowcaseItem label="disabled">
              <Button disabled>Deshabilitado</Button>
            </ShowcaseItem>
            <ShowcaseItem label="loading">
              <Button loading>Cargando…</Button>
            </ShowcaseItem>
            <ShowcaseItem label="icon izquierda">
              <Button
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
              >
                Con ícono
              </Button>
            </ShowcaseItem>
            <ShowcaseItem label="icon derecha">
              <Button
                variant="secondary"
                iconPosition="right"
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              >
                Siguiente
              </Button>
            </ShowcaseItem>
            <ShowcaseItem label="ia">
              <Button variant="ia">Asistente IA</Button>
            </ShowcaseItem>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            2. FORMULARIOS
        ══════════════════════════════════════════════ */}
        <section id="formularios" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Formularios</h2>
            <p style={sectionDescStyle}>InputField y Selector — 6 estados de validación</p>
          </div>

          <GroupLabel>InputField — estados</GroupLabel>
          <div style={{ ...rowStyle, marginBottom: '36px', flexWrap: 'wrap' }}>
            {[
              { state: 'default',  label: 'Campo de texto',  supporting: 'Texto de apoyo'   },
              { state: 'success',  label: 'Validado',        supporting: 'Campo correcto'    },
              { state: 'alert',    label: 'Advertencia',     supporting: 'Verifica el valor' },
              { state: 'error',    label: 'Error',           supporting: 'Campo requerido'   },
              { state: 'disabled', label: 'Deshabilitado',   supporting: 'No disponible'     },
              { state: 'blocked',  label: 'Bloqueado',       supporting: 'Acceso restringido'},
            ].map(({ state, label, supporting }) => (
              <ShowcaseItem key={state} label={state}>
                <div style={{ width: 200 }}>
                  <InputField
                    label={label}
                    fieldState={state}
                    supportingText={supporting}
                    defaultValue={state !== 'default' ? 'Valor de ejemplo' : undefined}
                  />
                </div>
              </ShowcaseItem>
            ))}
          </div>

          <Divider />

          <GroupLabel>Selector — estados</GroupLabel>
          <div style={{ ...rowStyle, flexWrap: 'wrap' }}>
            {[
              { state: 'default',  label: 'Seleccionar', supporting: 'Elige una opción' },
              { state: 'success',  label: 'Seleccionado', supporting: 'Opción válida'   },
              { state: 'alert',    label: 'Atención',     supporting: 'Verifica la selección' },
              { state: 'error',    label: 'Requerido',    supporting: 'Debe seleccionar' },
              { state: 'disabled', label: 'No disponible',supporting: 'Campo bloqueado' },
            ].map(({ state, label, supporting }) => (
              <ShowcaseItem key={state} label={state}>
                <div style={{ width: 200 }}>
                  <Selector
                    label={label}
                    fieldState={state}
                    supportingText={supporting}
                    options={[
                      { value: 'a', label: 'Opción A' },
                      { value: 'b', label: 'Opción B' },
                      { value: 'c', label: 'Opción C' },
                    ]}
                  />
                </div>
              </ShowcaseItem>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            3. BADGES
        ══════════════════════════════════════════════ */}
        <section id="badges" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Badges</h2>
            <p style={sectionDescStyle}>Badge — 4 variantes de color × 2 tamaños</p>
          </div>

          <GroupLabel>Tamaño md</GroupLabel>
          <div style={{ ...rowStyle, marginBottom: '24px' }}>
            {[
              { variant: 'solid-success', label: 'Activo'    },
              { variant: 'solid-error',   label: 'Inactivo'  },
              { variant: 'solid-alert',   label: 'Pendiente' },
              { variant: 'solid-primary', label: 'Proceso'   },
            ].map(({ variant, label }) => (
              <ShowcaseItem key={variant} label={variant}>
                <Badge variant={variant} label={label} size="md" />
              </ShowcaseItem>
            ))}
          </div>

          <GroupLabel>Tamaño sm</GroupLabel>
          <div style={rowStyle}>
            {[
              { variant: 'solid-success', label: 'Activo'    },
              { variant: 'solid-error',   label: 'Inactivo'  },
              { variant: 'solid-alert',   label: 'Pendiente' },
              { variant: 'solid-primary', label: 'Proceso'   },
            ].map(({ variant, label }) => (
              <ShowcaseItem key={variant} label={variant}>
                <Badge variant={variant} label={label} size="sm" />
              </ShowcaseItem>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            4. NOTIFICACIONES
        ══════════════════════════════════════════════ */}
        <section id="notificaciones" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Notificaciones</h2>
            <p style={sectionDescStyle}>Snackbar — 5 variantes de estado semántico</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '540px' }}>
            {[
              { variant: 'primary',   message: 'Información del sistema disponible para revisar.'  },
              { variant: 'success',   message: 'La operación se completó con éxito.'              },
              { variant: 'alert',     message: 'Revisa los datos antes de continuar.'             },
              { variant: 'error',     message: 'Error al procesar la solicitud. Intenta de nuevo.' },
              { variant: 'important', message: 'Acción importante requerida por el administrador.' },
            ].map(({ variant, message }) => (
              <ShowcaseItem key={variant} label={variant}>
                <Snackbar
                  variant={variant}
                  message={message}
                  duration={0}
                />
              </ShowcaseItem>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            5. ACTIVITY MONITOR
        ══════════════════════════════════════════════ */}
        <section id="activity-monitor" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Activity Monitor</h2>
            <p style={sectionDescStyle}>ActivityMonitor — 6 estados semánticos con métrica numérica</p>
          </div>

          <div style={{ ...rowStyle, flexWrap: 'wrap' }}>
            {[
              { state: 'Default',      number: '24', label: 'Procesos activos'  },
              { state: 'Success',      number: '18', label: 'Completados'       },
              { state: 'Alert',        number: '06', label: 'En revisión'       },
              { state: 'Error',        number: '03', label: 'Con errores'       },
              { state: 'Important',    number: '12', label: 'Prioritarios'      },
              { state: 'Intermediate', number: '09', label: 'En progreso'       },
            ].map(({ state, number, label }) => (
              <ShowcaseItem key={state} label={state}>
                <ActivityMonitor state={state} number={number} labelText={label} />
              </ShowcaseItem>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            6. TARJETAS
        ══════════════════════════════════════════════ */}
        <section id="tarjetas" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Tarjetas</h2>
            <p style={sectionDescStyle}>Card — variantes default (contenido libre), platform (acceso) y kpi (métrica)</p>
          </div>

          <GroupLabel>Variante default</GroupLabel>
          <div style={{ ...rowStyle, marginBottom: '28px' }}>
            <ShowcaseItem label="sin título">
              <Card variant="default" style={{ width: 260 }}>
                <p style={{ fontSize: '14px', color: '#333', margin: 0, lineHeight: 1.6 }}>
                  Contenido libre de la tarjeta. Acepta cualquier elemento React como children.
                </p>
              </Card>
            </ShowcaseItem>
            <ShowcaseItem label="con título">
              <Card variant="default" title="Título de la Card" style={{ width: 260 }}>
                <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: 1.6 }}>
                  Contenido con encabezado visible en la parte superior.
                </p>
              </Card>
            </ShowcaseItem>
          </div>

          <Divider />

          <GroupLabel>Variante platform</GroupLabel>
          <div style={{ ...rowStyle, marginBottom: '28px' }}>
            <ShowcaseItem label="platform">
              <Card
                variant="platform"
                logo={
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="10" fill={c.primario.$value} />
                    <path d="M12 20h16M20 12v16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                }
                title="Portal Rex+"
                description="Gestiona evaluaciones, solicitudes y documentos de tu organización."
                ctaLabel="Ir a plataforma"
              />
            </ShowcaseItem>
          </div>

          <Divider />

          <GroupLabel>Variante kpi</GroupLabel>
          <div style={rowStyle}>
            <ShowcaseItem label="tendencia positiva">
              <Card
                variant="kpi"
                icon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 14l4-4 4 2 6-7" stroke={c.primario.$value} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                title="Evaluaciones activas"
                value="1,240"
                trend={12.5}
              />
            </ShowcaseItem>
            <ShowcaseItem label="tendencia negativa">
              <Card
                variant="kpi"
                icon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke={c.primario.$value} strokeWidth="1.5" />
                    <path d="M10 7v4" stroke={c.primario.$value} strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="10" cy="13.5" r="0.8" fill={c.primario.$value} />
                  </svg>
                }
                title="Tasa de abandono"
                value="3.2%"
                trend={-4.1}
              />
            </ShowcaseItem>
            <ShowcaseItem label="sin tendencia">
              <Card
                variant="kpi"
                icon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M10 4v12" stroke={c.primario.$value} strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                }
                title="Participantes"
                value="856"
              />
            </ShowcaseItem>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            7. CARD OPTION
        ══════════════════════════════════════════════ */}
        <section id="card-option" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Card Option</h2>
            <p style={sectionDescStyle}>
              CardOption — tarjeta de selección de tipo de evaluación.
              Variantes: básica · con badge "Recomendada" · seleccionada · interactiva.
              Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1170:18944.
            </p>
          </div>

          <GroupLabel>Estados (Figma: Default → WBadge → WBadge-Actived)</GroupLabel>
          <div style={{ ...rowStyle, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <ShowcaseItem label="Default — sin badge, sin selección">
              <div style={{ width: 300 }}>
                <CardOption
                  title="90°"
                  subtitle="Evaluación directa"
                  description="Solo el jefe evalúa al colaborador. Sin auto-evaluación ni otras fuentes."
                />
              </div>
            </ShowcaseItem>

            <ShowcaseItem label='WBadge — con badge "Recomendada"'>
              <div style={{ width: 300 }}>
                <CardOption
                  title="180°"
                  subtitle="La más usada"
                  description="El jefe evalúa al colaborador y el colaborador se auto-evalúa."
                  recommended
                />
              </div>
            </ShowcaseItem>

            <ShowcaseItem label='WBadge-Actived — badge + seleccionada'>
              <div style={{ width: 300 }}>
                <CardOption
                  title="180°"
                  subtitle="La más usada"
                  description="El jefe evalúa al colaborador y el colaborador se auto-evalúa."
                  recommended
                  selected
                />
              </div>
            </ShowcaseItem>

            <ShowcaseItem label="360° — sin badge, con selección">
              <div style={{ width: 300 }}>
                <CardOption
                  title="360°"
                  subtitle="Evaluación completa"
                  description="Jefe, pares, subordinados y auto-evaluación. Visión 360° del colaborador."
                  selected
                />
              </div>
            </ShowcaseItem>
          </div>

          <Divider />

          <GroupLabel>Demo interactivo — clic para seleccionar</GroupLabel>
          <CardOptionInteractiveDemo />
        </section>

        {/* ══════════════════════════════════════════════
            8. TABS
        ══════════════════════════════════════════════ */}
        <section id="tabs" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Tabs</h2>
            <p style={sectionDescStyle}>
              Tabs — barra de navegación por pasos del wizard.
              Variante <strong>text</strong>: indicador azul en el tab activo.
              Variante <strong>icon</strong>: ícono check verde en pasos completados.
              Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1213:20337.
            </p>
          </div>

          <GroupLabel>Variante text — tab activo y demo interactivo</GroupLabel>
          <TabsTextDemo />

          <Divider />

          <GroupLabel>Variante text — con tab deshabilitado</GroupLabel>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
            <Tabs
              tabs={[
                { key: 'a', label: 'Datos del proceso' },
                { key: 'b', label: 'Estructura' },
                { key: 'c', label: 'Formulario', disabled: true },
                { key: 'd', label: 'Notificaciones', disabled: true },
                { key: 'e', label: 'Resumen y activación', disabled: true },
              ]}
              activeKey="a"
              variant="text"
            />
          </div>

          <Divider />

          <GroupLabel>Variante icon — todos los pasos completados</GroupLabel>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
            <Tabs
              variant="icon"
              tabs={[
                { key: 'a', label: 'Datos del proceso' },
                { key: 'b', label: 'Estructura' },
                { key: 'c', label: 'Formulario' },
                { key: 'd', label: 'Calibración' },
                { key: 'e', label: 'Retroalimentación' },
                { key: 'f', label: 'Notificaciones' },
                { key: 'g', label: 'Resumen y activación' },
              ]}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            9. TEXTAREA
        ══════════════════════════════════════════════ */}
        <section id="textarea" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Textarea</h2>
            <p style={sectionDescStyle}>
              Textarea — campo de texto multilínea con label, placeholder, contador de caracteres
              y 6 estados de validación. Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1194:6707.
            </p>
          </div>

          <GroupLabel>Estados de validación</GroupLabel>
          <div style={{ ...rowStyle, flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { state: 'default',  label: 'Descripción del proceso',  supporting: undefined,              placeholder: 'Describe el proceso aquí' },
              { state: 'success',  label: 'Descripción validada',     supporting: 'Contenido correcto',   placeholder: 'Describe el proceso aquí' },
              { state: 'alert',    label: 'Revisa el contenido',      supporting: 'Verifica la redacción',placeholder: 'Describe el proceso aquí' },
              { state: 'error',    label: 'Campo requerido',          supporting: 'Este campo es obligatorio', placeholder: 'Describe el proceso aquí' },
              { state: 'disabled', label: 'No disponible',            supporting: undefined,              placeholder: 'Campo deshabilitado' },
              { state: 'blocked',  label: 'Acceso restringido',       supporting: undefined,              placeholder: 'Campo bloqueado' },
            ].map(({ state, label, supporting, placeholder }) => (
              <ShowcaseItem key={state} label={state}>
                <div style={{ width: 280 }}>
                  <Textarea
                    label={label}
                    fieldState={state}
                    placeholder={placeholder}
                    supportingText={supporting}
                    maxLength={1000}
                    defaultValue={state !== 'default' && state !== 'disabled' && state !== 'blocked'
                      ? 'Texto de ejemplo ingresado en el campo.'
                      : undefined
                    }
                  />
                </div>
              </ShowcaseItem>
            ))}
          </div>

          <Divider />

          <GroupLabel>Demo interactivo — contador de caracteres</GroupLabel>
          <TextareaCounterDemo />
        </section>

        {/* ══════════════════════════════════════════════
            10. RADIOBUTTON
        ══════════════════════════════════════════════ */}
        <section id="radiobutton" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Radiobutton</h2>
            <p style={sectionDescStyle}>
              Radiobutton — selector de opción única dentro de un grupo.
              Usa input nativo oculto + círculo SVG para accesibilidad completa.
              Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1194:6715.
            </p>
          </div>

          <GroupLabel>Estados individuales</GroupLabel>
          <div style={{ ...rowStyle, flexWrap: 'wrap', marginBottom: '28px' }}>
            <ShowcaseItem label="sin seleccionar">
              <Radiobutton name="demo-a" value="a" label="Sin seleccionar" />
            </ShowcaseItem>

            <ShowcaseItem label="seleccionado">
              <Radiobutton name="demo-b" value="b" label="Seleccionado" checked onChange={() => {}} />
            </ShowcaseItem>

            <ShowcaseItem label="disabled sin seleccionar">
              <Radiobutton name="demo-c" value="c" label="Deshabilitado" disabled />
            </ShowcaseItem>

            <ShowcaseItem label="disabled seleccionado">
              <Radiobutton name="demo-d" value="d" label="Deshabilitado + marcado" checked disabled onChange={() => {}} />
            </ShowcaseItem>
          </div>

          <Divider />

          <GroupLabel>Demo interactivo — grupo con name compartido</GroupLabel>
          <RadiobuttonGroupDemo />
        </section>

        {/* ══════════════════════════════════════════════
            11. CHECKBOX
        ══════════════════════════════════════════════ */}
        <section id="checkbox" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Checkbox</h2>
            <p style={sectionDescStyle}>
              Checkbox — selector de opción múltiple con estados checked, indeterminate y disabled.
              Usa input nativo oculto + caja SVG (border-radius 4px) para accesibilidad completa.
              Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1214:20428.
            </p>
          </div>

          <GroupLabel>Estados individuales</GroupLabel>
          <div style={{ ...rowStyle, flexWrap: 'wrap', marginBottom: '28px' }}>
            <ShowcaseItem label="sin marcar">
              <Checkbox label="Sin marcar" />
            </ShowcaseItem>

            <ShowcaseItem label="marcado">
              <Checkbox label="Marcado" checked onChange={() => {}} />
            </ShowcaseItem>

            <ShowcaseItem label="indeterminado">
              <Checkbox label="Indeterminado" indeterminate checked={false} onChange={() => {}} />
            </ShowcaseItem>

            <ShowcaseItem label="disabled sin marcar">
              <Checkbox label="Deshabilitado" disabled />
            </ShowcaseItem>

            <ShowcaseItem label="disabled marcado">
              <Checkbox label="Deshabilitado + marcado" checked disabled onChange={() => {}} />
            </ShowcaseItem>

            <ShowcaseItem label="disabled indeterminado">
              <Checkbox label="Deshabilitado + indeterminado" indeterminate checked={false} disabled onChange={() => {}} />
            </ShowcaseItem>
          </div>

          <Divider />

          <GroupLabel>Demo interactivo — "Seleccionar todos" con estado indeterminate</GroupLabel>
          <CheckboxListDemo />
        </section>

        {/* ══════════════════════════════════════════════
            12. CHIPS
        ══════════════════════════════════════════════ */}
        <section id="chips" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Chips</h2>
            <p style={sectionDescStyle}>
              Chip — pill interactivo de filtro (altura 24px, border-radius 16px).
              Estado default (#5780AD panel), activo (#00B4FF importante) y disabled.
              Chevron animado indica panel expandido.
              Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1214:20435.
            </p>
          </div>

          <GroupLabel>Estados</GroupLabel>
          <div style={{ ...rowStyle, flexWrap: 'wrap', marginBottom: '28px' }}>
            <ShowcaseItem label="default">
              <Chip label="Ver colaboradores incluidos" count={50} />
            </ShowcaseItem>

            <ShowcaseItem label="default — sin contador">
              <Chip label="Empresa" />
            </ShowcaseItem>

            <ShowcaseItem label="active (filtro aplicado)">
              <Chip label="Tipo de evaluación" count={2} active />
            </ShowcaseItem>

            <ShowcaseItem label="expanded (dropdown abierto)">
              <Chip label="Estado" expanded />
            </ShowcaseItem>

            <ShowcaseItem label="active + expanded">
              <Chip label="Centro de costo" count={1} active expanded />
            </ShowcaseItem>

            <ShowcaseItem label="disabled">
              <Chip label="No disponible" disabled />
            </ShowcaseItem>
          </div>

          <Divider />

          <GroupLabel>Demo interactivo — barra de filtros</GroupLabel>
          <ChipFilterDemo />
        </section>

        {/* ══════════════════════════════════════════════
            13. UPLOADER
        ══════════════════════════════════════════════ */}
        <section id="uploader" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Uploader</h2>
            <p style={sectionDescStyle}>
              Uploader — tarjeta de carga de archivos con drag-drop.
              Variante <strong>default</strong>: zona vacía con nube + instrucción.
              Variante <strong>load</strong>: archivo cargado con nombre, peso y botón eliminar.
              Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1194:18475.
            </p>
          </div>

          <GroupLabel>Uploader-default — zona de carga vacía</GroupLabel>
          <div style={{ maxWidth: 687, marginBottom: 28 }}>
            <Uploader
              onDownloadTemplate={() => {}}
            />
          </div>

          <Divider />

          <GroupLabel>Uploader-load — archivo seleccionado</GroupLabel>
          <div style={{ maxWidth: 687, marginBottom: 28 }}>
            <Uploader
              file={{ name: 'Documento.jpg', size: '0.1 MB' }}
              onFileRemove={() => {}}
              onDownloadTemplate={() => {}}
            />
          </div>

          <Divider />

          <GroupLabel>Demo interactivo — selecciona o arrastra un archivo real</GroupLabel>
          <UploaderDemo />
        </section>

        {/* ══════════════════════════════════════════════
            14. SECTIONS
        ══════════════════════════════════════════════ */}
        <section id="sections" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Sections</h2>
            <p style={sectionDescStyle}>
              Section — tarjeta acordeón para configurar una dirección de evaluación.
              Variante <strong>accordion-up</strong>: switch OFF, solo encabezado.
              Variante <strong>accordion-down</strong>: switch ON, campos de porcentaje,
              privacidad y programación.
              Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1196:18742.
            </p>
          </div>

          <GroupLabel>Section-accordion-up — toggle apagado (colapsado)</GroupLabel>
          <div style={{ maxWidth: 687, marginBottom: 28 }}>
            <Section
              title="Descendente"
              description="El jefe directo evalúa al colaborador."
              open={false}
            />
          </div>

          <Divider />

          <GroupLabel>Section-accordion-down — toggle encendido (expandido)</GroupLabel>
          <div style={{ maxWidth: 687, marginBottom: 28 }}>
            <Section
              title="Descendente"
              description="El jefe directo evalúa al colaborador."
              open={true}
              percentage="30"
              isPrivate={false}
              onToggle={() => {}}
              onPercentageChange={() => {}}
              onPrivateChange={() => {}}
            />
          </div>

          <Divider />

          <GroupLabel>Section expandida — estado disabled</GroupLabel>
          <div style={{ maxWidth: 687, marginBottom: 28 }}>
            <Section
              title="Par"
              description="Un compañero de trabajo evalúa al colaborador."
              open={true}
              percentage="20"
              disabled
              onToggle={() => {}}
            />
          </div>

          <Divider />

          <GroupLabel>Demo interactivo — grupo de 3 secciones</GroupLabel>
          <SectionGroupDemo />
        </section>

        {/* ══════════════════════════════════════════════
            15. TOTALIZADOR
        ══════════════════════════════════════════════ */}
        <section id="totalizador" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Totalizador</h2>
            <p style={sectionDescStyle}>
              Totalizador — pill que muestra la suma de porcentajes de las secciones activas.
              Variante <strong>default</strong>: borde rojo, mensaje de error cuando la suma ≠ 100%.
              Variante <strong>100%</strong>: borde verde, check cuando la suma = 100%.
              Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1196:18821.
            </p>
          </div>

          <GroupLabel>Totalizador-default — suma incorrecta</GroupLabel>
          <div style={{ ...rowStyle, marginBottom: 28, flexWrap: 'wrap' }}>
            <ShowcaseItem label="0%">
              <Totalizador total={0} />
            </ShowcaseItem>
            <ShowcaseItem label="50%">
              <Totalizador total={50} />
            </ShowcaseItem>
            <ShowcaseItem label="110%">
              <Totalizador total={110} />
            </ShowcaseItem>
          </div>

          <Divider />

          <GroupLabel>Totalizador-100% — suma correcta</GroupLabel>
          <div style={{ marginBottom: 28 }}>
            <Totalizador total={100} />
          </div>

          <Divider />

          <GroupLabel>Demo interactivo — slider de porcentaje</GroupLabel>
          <TotalizadorDemo />
        </section>

        {/* ══════════════════════════════════════════════
            16. TABLA DE DATOS
        ══════════════════════════════════════════════ */}
        <section id="tabla" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Tabla de datos</h2>
            <p style={sectionDescStyle}>
              DataTable — columnas tipo checkbox, avatar-text, text, progress, check-icon y actions.
              Incluye buscador, filtros y paginación.
            </p>
          </div>

          <DataTable
            columns={TABLE_COLUMNS}
            rows={TABLE_ROWS}
            total={3}
            currentPage={1}
          />
        </section>

        {/* ══════════════════════════════════════════════
            17. NAVEGACIÓN
        ══════════════════════════════════════════════ */}
        <section id="navegacion" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Navegación</h2>
            <p style={sectionDescStyle}>MenuPortal (barra lateral) y FilterApp (panel de filtros)</p>
          </div>

          <GroupLabel>MenuPortal — barra lateral colapsable</GroupLabel>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ ...tocItemStyle, border: `1px solid ${c.primario.$value}`, padding: '4px 12px', borderRadius: '16px', fontSize: '12px' }}
            >
              {menuOpen ? 'Colapsar' : 'Expandir'}
            </button>
            <button
              onClick={() => setMenuType((v) => (v === 'Supervisor' ? 'Colaborador' : 'Supervisor'))}
              style={{ ...tocItemStyle, border: `1px solid ${c.primario.$value}`, padding: '4px 12px', borderRadius: '16px', fontSize: '12px' }}
            >
              Tipo: {menuType}
            </button>
          </div>
          <div style={{ marginBottom: '36px' }}>
            <div
              style={{
                display: 'inline-block',
                height: 440,
                border: `1px solid ${c.auxiliar.$value}`,
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <MenuPortal
                open={menuOpen}
                type={menuType}
                onToggle={() => setMenuOpen((v) => !v)}
              />
            </div>
          </div>

          <Divider />

          <GroupLabel>FilterApp — trigger colapsado y panel expandido</GroupLabel>
          <div style={rowStyle}>
            <ShowcaseItem label="colapsado (trigger)">
              <FilterApp expanded={false} />
            </ShowcaseItem>
            <ShowcaseItem label="expandido (panel)">
              <FilterApp
                expanded={true}
                fields={[
                  { key: 'empresa',         label: 'Empresa'         },
                  { key: 'centro-de-costo', label: 'Centro de costo' },
                  { key: 'por-tipo',        label: 'Por tipo'        },
                ]}
              />
            </ShowcaseItem>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            BREADCRUMB
        ══════════════════════════════════════════════ */}
        <section id="breadcrumb" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Breadcrumb</h2>
            <p style={sectionDescStyle}>
              Encabezado de página con ruta de migas, título H5, badge de estado y subtítulo.
              Soporta flecha de volver opcional.
            </p>
          </div>

          <GroupLabel>Con todas las partes (breadcrumb + título + badge + subhead + flecha)</GroupLabel>
          <div style={{ marginBottom: '32px', background: c.fondo.$value, padding: '24px', borderRadius: '12px' }}>
            <Breadcrumb
              breadcrumb="/ Evaluaciones /"
              title="Evaluación de Desempeño Anual"
              badge="Borrador"
              subhead={`04/01/2026 → 31/01/2026  - Evaluación 180°`}
              onBack={() => {}}
            />
          </div>

          <Divider />

          <GroupLabel>Sin flecha de volver</GroupLabel>
          <div style={{ marginBottom: '32px', background: c.fondo.$value, padding: '24px', borderRadius: '12px' }}>
            <Breadcrumb
              breadcrumb="/ Evaluaciones /"
              title="Evaluación de Desempeño Anual"
              badge="Activo"
              subhead={`01/03/2026 → 30/04/2026  - Evaluación 360°`}
            />
          </div>

          <Divider />

          <div style={rowStyle}>
            <ShowcaseItem label="Solo título">
              <div style={{ background: c.fondo.$value, padding: '16px', borderRadius: '8px' }}>
                <Breadcrumb title="Evaluaciones" onBack={() => {}} />
              </div>
            </ShowcaseItem>
            <ShowcaseItem label="Sin badge ni subhead">
              <div style={{ background: c.fondo.$value, padding: '16px', borderRadius: '8px' }}>
                <Breadcrumb
                  breadcrumb="/ Evaluaciones /"
                  title="Nueva evaluación"
                  onBack={() => {}}
                />
              </div>
            </ShowcaseItem>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            19. BLOQUES DE SELECCIÓN
        ══════════════════════════════════════════════ */}
        <section id="bloques-seleccion" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Bloques de Selección</h2>
            <p style={sectionDescStyle}>
              Panel dual de selección de competencias. Panel izquierdo: disponibles con buscador
              y checkboxes. Panel derecho: seleccionadas con selector de escala y acción eliminar.
            </p>
          </div>

          <GroupLabel>Interactivo — haz clic en un checkbox para seleccionar</GroupLabel>
          <BloquesSeleccionDemo />
        </section>

        {/* ══════════════════════════════════════════════
            18. UTILIDADES
        ══════════════════════════════════════════════ */}
        <section id="utilidades" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Utilidades</h2>
            <p style={sectionDescStyle}>Toggle — interruptor on/off con estado deshabilitado</p>
          </div>

          <div style={rowStyle}>
            <ShowcaseItem label={`interactivo (${toggleA ? 'on' : 'off'})`}>
              <Toggle checked={toggleA} onChange={setToggleA} />
            </ShowcaseItem>
            <ShowcaseItem label="disabled off">
              <Toggle checked={false} onChange={() => {}} disabled />
            </ShowcaseItem>
            <ShowcaseItem label="disabled on">
              <Toggle checked={true} onChange={() => {}} disabled />
            </ShowcaseItem>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            20. RESUMEN SECCIÓN
        ══════════════════════════════════════════════ */}
        <section id="resumen-seccion" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Resumen Sección</h2>
            <p style={sectionDescStyle}>
              Tarjeta de sección para la vista "Resumen y activación". Provee el contenedor
              externo con título, subtítulo opcional y botones de acción (Vista previa, Editar,
              Eliminar). ResumenSeccionContent añade el contenedor interior con borde auxiliar.
              ResumenCampo presenta pares etiqueta/valor dentro de ese contenedor.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <GroupLabel>Con botón Editar — Datos del proceso</GroupLabel>
            <ResumenSeccion
              title="Datos del proceso"
              onEdit={() => {}}
            >
              <ResumenSeccionContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <ResumenCampo label="Nombre">Evaluación de Desempeño Anual 2026</ResumenCampo>
                  <ResumenCampo label="Período">04/01/2026 → 31/01/2026</ResumenCampo>
                  <ResumenCampo label="Plantilla">Evaluación "180°"</ResumenCampo>
                  <ResumenCampo label="Privacidad">Estándar</ResumenCampo>
                  <ResumenCampo label="Alcance">Toda la organización</ResumenCampo>
                  <ResumenCampo label="Responsables">Gonzalo Rivas, María González</ResumenCampo>
                </div>
              </ResumenSeccionContent>
            </ResumenSeccion>

            <GroupLabel>Con subtítulo y botón Editar — Notificaciones</GroupLabel>
            <ResumenSeccion
              title="Notificaciones configuradas"
              subtitle="Al activar el proceso se enviarán las siguientes notificaciones."
              onEdit={() => {}}
            >
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { title: 'Evaluación iniciada', desc: 'Esta notificación se enviará una vez que el proceso de evaluación haya sido iniciado.' },
                  { title: 'Formulario respondido', desc: 'Esta notificación se enviará una vez que el formulario de evaluación haya sido respondido.' },
                ].map(n => (
                  <div key={n.title} style={{
                    background: c.fondo.$value,
                    borderRadius: '12px',
                    padding: '16px',
                    flex: '1 1 200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}>
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#333333', margin: 0 }}>{n.title}</p>
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '12px', color: '#666666', margin: 0 }}>{n.desc}</p>
                  </div>
                ))}
              </div>
            </ResumenSeccion>

            <GroupLabel>Con Vista previa + Editar — Formulario</GroupLabel>
            <ResumenSeccion
              title="Formulario"
              onPreview={() => {}}
              onEdit={() => {}}
            >
              <ResumenSeccionContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <ResumenCampo label="Tipo formulario">
                    <span style={{ display: 'inline-block', border: '1px solid #B6CEE7', borderRadius: '20px', padding: '2px 12px', fontSize: '13px', color: '#333333' }}>
                      Formulario único
                    </span>
                  </ResumenCampo>
                  <ResumenCampo label="Justificación por objetivos">No requerida</ResumenCampo>
                  <ResumenCampo label="Justificación por competencia">No requerida</ResumenCampo>
                  <ResumenCampo label="Peso objetivos individuales">100%</ResumenCampo>
                  <ResumenCampo label="Funcionales">50%</ResumenCampo>
                  <ResumenCampo label="Transversales">50%</ResumenCampo>
                </div>
              </ResumenSeccionContent>
            </ResumenSeccion>

            <GroupLabel>Con botón Eliminar — Participantes</GroupLabel>
            <ResumenSeccion
              title="Participantes"
              onDelete={() => {}}
              deleteLabel="Eliminar formularios masivamente"
            >
              <div style={{ background: c.fondo.$value, borderRadius: '8px', padding: '12px 16px' }}>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#333333' }}>
                  <strong>(7)</strong> colaboradores incluidos en el proceso
                </span>
              </div>
            </ResumenSeccion>

          </div>
        </section>

        {/* ══════════════════════════════════════════════
            21. GRUPO EVALUACIÓN
        ══════════════════════════════════════════════ */}
        <section id="grupo-evaluacion" style={sectionStyle}>
          <div style={sectionHeadStyle}>
            <h2 style={sectionTitleStyle}>Grupo Evaluación</h2>
            <p style={sectionDescStyle}>
              Acordeón colapsable para grupos de formularios múltiples en la sección "Formulario"
              del paso Resumen y activación. Muestra dos columnas: competencias y objetivos,
              con su tabla de ítems (Item, Ponderado, Justificación) y totales.
              Haz clic en el título para colapsar/expandir.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <GroupLabel>Expandido (defaultExpanded=true)</GroupLabel>
            <GrupoEvaluacion
              title="Grupo evaluación 1"
              competencyWeight={100}
              competencias={[
                { name: 'Descendente',    weight: '25%', justification: 'No' },
                { name: 'Auto evaluación',weight: '25%', justification: 'No' },
                { name: 'Pares',          weight: '25%', justification: 'No' },
                { name: 'Ascendente',     weight: '25%', justification: 'No' },
              ]}
              objectiveWeight={100}
              objetivos={[
                { name: 'Descendente',    weight: '25%', justification: 'No' },
                { name: 'Auto evaluación',weight: '25%', justification: 'No' },
                { name: 'Pares',          weight: '25%', justification: 'No' },
                { name: 'Ascendente',     weight: '25%', justification: 'No' },
              ]}
              defaultExpanded={true}
            />

            <GroupLabel>Colapsado (defaultExpanded=false)</GroupLabel>
            <GrupoEvaluacion
              title="Grupo evaluación 2"
              competencyWeight={100}
              competencias={[
                { name: 'Descendente', weight: '50%', justification: 'No' },
                { name: 'Pares',       weight: '50%', justification: 'No' },
              ]}
              objectiveWeight={100}
              objetivos={[
                { name: 'Descendente', weight: '50%', justification: 'No' },
                { name: 'Pares',       weight: '50%', justification: 'No' },
              ]}
              defaultExpanded={false}
            />

            <GroupLabel>Solo competencias (sin objetivos)</GroupLabel>
            <GrupoEvaluacion
              title="Grupo evaluación 3"
              competencyWeight={100}
              competencias={[
                { name: 'Integridad',     weight: '40%', justification: 'Sí' },
                { name: 'Adaptabilidad',  weight: '35%', justification: 'No' },
                { name: 'Innovación',     weight: '25%', justification: 'No' },
              ]}
              defaultExpanded={true}
            />

          </div>
        </section>

      </main>
    </div>
  );
}
