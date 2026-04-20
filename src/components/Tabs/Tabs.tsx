import React from 'react';
import styles from './Tabs.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type TabsVariant = 'text' | 'icon';

export interface TabDef {
  /** Identificador único del tab */
  key: string;
  /** Etiqueta visible */
  label: string;
  /** Deshabilita el tab (no clickable). Default: false */
  disabled?: boolean;
}

export interface TabsProps {
  /** Lista de tabs a renderizar */
  tabs: TabDef[];
  /**
   * Key del tab actualmente activo.
   * Solo aplica en variant='text'. El tab activo muestra texto e indicador en `importante` (#00B4FF).
   */
  activeKey?: string;
  /**
   * Variante visual.
   * - `'text'`  — barra de tabs con indicador subrayado; uno es activo, el resto en gris.
   *               Equivale a `Tabs-default` del diseño Figma.
   * - `'icon'`  — todos los tabs muestran ícono de check completado (verde) + texto panel.
   *               Equivale a `Tabs-icon` del diseño Figma. Úsalo para pasos completados.
   * Default: 'text'
   */
  variant?: TabsVariant;
  /**
   * Keys de tabs completados. Estos tabs se renderizan con ícono de check (Tabs-icon)
   * independientemente de la variante general. Permite mezcla: pasos completados con
   * ícono y el paso activo/pendiente con indicador de texto.
   */
  completedKeys?: string[];
  /**
   * Callback al hacer clic en un tab habilitado.
   * Recibe el `key` del tab pulsado.
   */
  onTabClick?: (key: string) => void;
  className?: string;
}

/* ─── Ícono check fill (Icon/Check fill — Figma Zafiro) ──────────────────── */
// Círculo relleno verde (exito: #ACCA54) con check blanco. 24×24px.

function CheckFillIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="11.25" fill="#acca54" /* exito */ />
      <path
        d="M7 12.5L10.5 16L17 8.5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Sub-componente: tab de texto ───────────────────────────────────────── */

function TextTab({
  tab,
  isActive,
  onClick,
}: {
  tab: TabDef;
  isActive: boolean;
  onClick: () => void;
}) {
  const stateClass = tab.disabled
    ? styles.disabled
    : isActive
      ? styles.active
      : styles.default;

  return (
    <button
      type="button"
      className={`${styles.tab} ${stateClass}`}
      onClick={onClick}
      disabled={tab.disabled}
      aria-selected={isActive}
      role="tab"
    >
      <span className={styles.label}>{tab.label}</span>
      <span className={styles.indicator} aria-hidden="true" />
    </button>
  );
}

/* ─── Sub-componente: tab de ícono ───────────────────────────────────────── */

function IconTab({
  tab,
  onClick,
}: {
  tab: TabDef;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.tabIcon} ${tab.disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={tab.disabled}
      role="tab"
    >
      <span className={styles.iconWrap}>
        <CheckFillIcon />
      </span>
      <span className={styles.iconLabel}>{tab.label}</span>
    </button>
  );
}

/* ─── Componente principal ───────────────────────────────────────────────── */

/**
 * Tabs — Barra de navegación por pasos del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1213:20337.
 *
 * Dos variantes:
 * - `text`  → indicador azul bajo el tab activo; usada durante el flujo del wizard.
 * - `icon`  → ícono check verde en todos los pasos; usada al completar todos los pasos.
 *
 * @example
 * // Variante text con activeKey
 * <Tabs
 *   tabs={[{ key: 'paso1', label: 'Datos del proceso' }, ...]}
 *   activeKey="paso1"
 *   onTabClick={(key) => setStep(key)}
 * />
 *
 * @example
 * // Variante icon (pasos completados)
 * <Tabs variant="icon" tabs={steps} onTabClick={handleClick} />
 */
export function Tabs({
  tabs,
  activeKey,
  variant = 'text',
  completedKeys,
  onTabClick,
  className,
}: TabsProps) {
  function handleClick(key: string, disabled?: boolean) {
    if (!disabled) onTabClick?.(key);
  }

  return (
    <nav
      role="tablist"
      aria-label="Navegación de pasos"
      className={[styles.bar, className ?? ''].filter(Boolean).join(' ')}
    >
      {tabs.map((tab) => {
        const isCompleted = completedKeys?.includes(tab.key);
        return variant === 'icon' || isCompleted ? (
          <IconTab
            key={tab.key}
            tab={tab}
            onClick={() => handleClick(tab.key, tab.disabled)}
          />
        ) : (
          <TextTab
            key={tab.key}
            tab={tab}
            isActive={tab.key === activeKey}
            onClick={() => handleClick(tab.key, tab.disabled)}
          />
        );
      })}
    </nav>
  );
}
