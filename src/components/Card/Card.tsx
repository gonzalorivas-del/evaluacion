import React from 'react';
import { Button } from '../Button';
import styles from './Card.module.css';

/* ─── Tipos ──────────────────────────────────────────────────────────────── */

interface CardCommon {
  className?: string;
  onClick?: () => void;
}

/** Card genérica: acepta cualquier contenido */
export interface CardDefaultProps extends CardCommon {
  variant?: 'default';
  /** Título opcional en la cabecera */
  title?: string;
  children?: React.ReactNode;
}

/** Card de plataforma Rex+: logo, título, descripción y CTA */
export interface CardPlatformProps extends CardCommon {
  variant: 'platform';
  /** Logo de la plataforma — SVG, img o componente */
  logo: React.ReactNode;
  title: string;
  description: string;
  /** Texto del botón CTA. Default: "Ir a plataforma" */
  ctaLabel?: string;
  /** Callback del botón CTA */
  onCtaClick?: () => void;
}

/** Card de métrica KPI: ícono, título, valor numérico y tendencia */
export interface CardKpiProps extends CardCommon {
  variant: 'kpi';
  /** Ícono representativo de la métrica */
  icon: React.ReactNode;
  /** Nombre de la métrica */
  title: string;
  /** Valor principal a mostrar (ej: "1.240", "98.5%") */
  value: string | number;
  /**
   * Tendencia porcentual. Positivo = sube (verde), negativo = baja (rojo).
   * Omitir para no mostrar tendencia.
   */
  trend?: number;
  /** Etiqueta de contexto de la tendencia. Default: "vs período anterior" */
  trendLabel?: string;
}

export type CardProps = CardDefaultProps | CardPlatformProps | CardKpiProps;

/* ─── Iconos de tendencia ────────────────────────────────────────────────── */

function TrendUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 10L7 4l5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 4l5 6 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendFlat() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Layouts internos ───────────────────────────────────────────────────── */

function PlatformLayout({ logo, title, description, ctaLabel = 'Ir a plataforma', onCtaClick }: Omit<CardPlatformProps, 'variant' | 'className' | 'onClick'>) {
  return (
    <div className={styles.platformLayout}>
      <div className={styles.platformLogoWrap} aria-hidden="true">
        {logo}
      </div>
      <div className={styles.platformBody}>
        <h3 className={styles.platformTitle}>{title}</h3>
        <p className={styles.platformDesc}>{description}</p>
        <Button
          variant="primary"
          size="sm"
          onClick={onCtaClick}
          aria-label={`${ctaLabel} — ${title}`}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}

function KpiLayout({
  icon,
  title,
  value,
  trend,
  trendLabel = 'vs período anterior',
}: Omit<CardKpiProps, 'variant' | 'className' | 'onClick'>) {
  const hasTrend = trend !== undefined;
  const isUp = hasTrend && trend > 0;
  const isDown = hasTrend && trend < 0;
  const isFlat = hasTrend && trend === 0;

  const trendClass = isUp
    ? styles.trendUp
    : isDown
      ? styles.trendDown
      : styles.trendFlat;

  const trendSign = isUp ? '+' : '';
  const trendAriaLabel = hasTrend
    ? `Tendencia: ${trendSign}${trend}% ${trendLabel}`
    : undefined;

  return (
    <div className={styles.kpiLayout}>
      <div className={styles.kpiHeader}>
        <span className={styles.kpiIcon} aria-hidden="true">{icon}</span>
        <span className={styles.kpiTitle}>{title}</span>
      </div>
      <span className={styles.kpiValue} aria-label={`Valor: ${value}`}>
        {value}
      </span>
      {hasTrend && (
        <span className={`${styles.kpiTrend} ${trendClass}`} aria-label={trendAriaLabel}>
          {isUp && <TrendUp />}
          {isDown && <TrendDown />}
          {isFlat && <TrendFlat />}
          <span>
            {trendSign}{trend}%{' '}
            <span className={styles.kpiTrendLabel}>{trendLabel}</span>
          </span>
        </span>
      )}
    </div>
  );
}

/* ─── Componente principal ───────────────────────────────────────────────── */

/**
 * Card del sistema de diseño Zafiro (Rex+).
 * Variantes: default (contenido libre), platform (acceso a plataforma), kpi (métrica).
 */
export function Card(props: CardProps) {
  const { variant = 'default', className, onClick } = props;

  const isInteractive = Boolean(onClick) || variant === 'platform';

  const rootClass = [
    styles.card,
    styles[`variant-${variant}`],
    isInteractive ? styles.interactive : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const Tag = onClick ? 'button' : 'div';
  const tagProps =
    Tag === 'button'
      ? { type: 'button' as const, onClick }
      : {};

  return (
    <Tag className={rootClass} {...tagProps}>
      {variant === 'default' && (
        <>
          {(props as CardDefaultProps).title && (
            <h3 className={styles.defaultTitle}>{(props as CardDefaultProps).title}</h3>
          )}
          {(props as CardDefaultProps).children}
        </>
      )}

      {variant === 'platform' && (
        <PlatformLayout
          logo={(props as CardPlatformProps).logo}
          title={(props as CardPlatformProps).title}
          description={(props as CardPlatformProps).description}
          ctaLabel={(props as CardPlatformProps).ctaLabel}
          onCtaClick={(props as CardPlatformProps).onCtaClick}
        />
      )}

      {variant === 'kpi' && (
        <KpiLayout
          icon={(props as CardKpiProps).icon}
          title={(props as CardKpiProps).title}
          value={(props as CardKpiProps).value}
          trend={(props as CardKpiProps).trend}
          trendLabel={(props as CardKpiProps).trendLabel}
        />
      )}
    </Tag>
  );
}
