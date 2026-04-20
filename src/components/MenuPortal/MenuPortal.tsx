import tokens from '../../tokens/tokens.json';
import styles from './MenuPortal.module.css';

// ─── Asset URLs ──────────────────────────────────────────────────────────────
// NOTE: These are served by the Figma MCP server and expire in 7 days.
// Replace with local assets (e.g. src/assets/icons/) for production.
const ASSETS = {
  // Section icons
  iconSupervisor: 'https://www.figma.com/api/mcp/asset/74633fc6-1a6b-4c34-b727-4e24ad086ee8',
  iconVer: 'https://www.figma.com/api/mcp/asset/62a74ce7-05f0-490a-8bf3-febc4f918cc2',
  iconSolicitudes: 'https://www.figma.com/api/mcp/asset/8e5b390c-7599-4a31-9db4-b0752a7eace7',
  iconFirmas: 'https://www.figma.com/api/mcp/asset/38d44d34-aa51-40e6-8fa5-1f961a02e8ca',
  iconDocumentos: 'https://www.figma.com/api/mcp/asset/862c18ce-d1d5-47e4-aec8-892cac4025f7',
  iconEvaluaciones: 'https://www.figma.com/api/mcp/asset/9dd2200b-6623-4e56-a4c1-9023cfabe3ba',
  iconBitacora: 'https://www.figma.com/api/mcp/asset/79ff1741-68eb-49ac-a7f1-fdc30c7e6b0a',
  iconCapacitaciones: 'https://www.figma.com/api/mcp/asset/5b219192-9016-4de7-8eb9-c5d567d18f17',
  iconAjustes: 'https://www.figma.com/api/mcp/asset/6b5174a9-ae6d-4e37-b0da-841ed881dfe3',
  // Navigation icons
  chevronDown: 'https://www.figma.com/api/mcp/asset/9096476b-6ae1-4edd-918c-842babe4d839',
  chevronRight: 'https://www.figma.com/api/mcp/asset/dcb0649d-f70c-4f24-bde1-3cd2ee7184bc',
  menuHamburger: 'https://www.figma.com/api/mcp/asset/832f18c1-fbf0-4169-b81d-db3e8fe48d50',
  // Logo
  logoRexFull: 'https://www.figma.com/api/mcp/asset/cf58b1ed-0e34-4268-8ae2-49dd3a792691',
  logoRexIcon: 'https://www.figma.com/api/mcp/asset/048d1e13-3527-4aee-8209-bfe3e52a79cc',
  logoFill4: 'https://www.figma.com/api/mcp/asset/d4cfe0be-e88c-4a1d-a90c-387a464a4e80',
  logoFill6: 'https://www.figma.com/api/mcp/asset/b00d33d5-5b21-4356-a173-2e6180fdb29a',
  logoFill8: 'https://www.figma.com/api/mcp/asset/c9df66d0-da1d-419c-b755-a3c7230dfd44',
  // Avatars
  avatarMen: 'https://www.figma.com/api/mcp/asset/1dfb27e7-4ec6-4580-b9f2-4e23f421c571',
  avatarWoman: 'https://www.figma.com/api/mcp/asset/d1dc3167-3271-4a8f-9ac2-d74c41636e5a',
  // Toggle button circles
  toggleOpenCircle: 'https://www.figma.com/api/mcp/asset/d1365547-d5be-4521-a35b-c9a07f5fe42d',
  toggleClosedCircle: 'https://www.figma.com/api/mcp/asset/c46787ec-3ce9-4825-9127-25d69d34f353',
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type MenuPortalType = 'Supervisor' | 'Colaborador';

export interface MenuPortalProps {
  /** Whether the menu is expanded. Default: true */
  open?: boolean;
  /** User type that determines the menu items shown. Default: 'Supervisor' */
  type?: MenuPortalType;
  /** Called when the toggle collapse/expand button is clicked */
  onToggle?: () => void;
  className?: string;
}

// ─── Menu item data ───────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  icon: string;
}

const SUPERVISOR_ITEMS: MenuItem[] = [
  { label: 'Supervisor', icon: ASSETS.iconSupervisor },
  { label: 'Ver', icon: ASSETS.iconVer },
  { label: 'Solicitudes', icon: ASSETS.iconSolicitudes },
  { label: 'Firmas pendientes', icon: ASSETS.iconFirmas },
  { label: 'Documentos', icon: ASSETS.iconDocumentos },
  { label: 'Evaluaciones', icon: ASSETS.iconEvaluaciones },
  { label: 'Mi bitacora', icon: ASSETS.iconBitacora },
  { label: 'Capacitaciones', icon: ASSETS.iconCapacitaciones },
  { label: 'Ajustes', icon: ASSETS.iconAjustes },
];

const COLABORADOR_ITEMS: MenuItem[] = [
  { label: 'Ver', icon: ASSETS.iconVer },
  { label: 'Solicitudes', icon: ASSETS.iconSolicitudes },
  { label: 'Firmas pendientes', icon: ASSETS.iconFirmas },
  { label: 'Documentos', icon: ASSETS.iconDocumentos },
  { label: 'Evaluaciones', icon: ASSETS.iconEvaluaciones },
  { label: 'Mi bitacora', icon: ASSETS.iconBitacora },
  { label: 'Capacitaciones', icon: ASSETS.iconCapacitaciones },
  { label: 'Ajustes', icon: ASSETS.iconAjustes },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo({ open }: { open: boolean }) {
  return (
    <div
      className={[
        styles.logoSection,
        open ? styles.logoOpen : styles.logoClosed,
      ].join(' ')}
    >
      {open ? (
        <img
          src={ASSETS.logoRexFull}
          alt="Rex+"
          className={styles.logoFull}
        />
      ) : (
        /* Closed: icon-only Rex logo (composed of overlaid image layers) */
        <div
          className={styles.logoIconWrapper}
          role="img"
          aria-label="Rex+"
          style={{ width: 30, height: 30, position: 'relative' }}
        >
          <img
            src={ASSETS.logoRexIcon}
            alt=""
            aria-hidden="true"
            className={styles.logoIconLayer}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          <img
            src={ASSETS.logoFill4}
            alt=""
            aria-hidden="true"
            className={styles.logoIconLayer}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
}

function AvatarSection({
  open,
  type,
}: {
  open: boolean;
  type: MenuPortalType;
}) {
  const avatarSrc = type === 'Supervisor' ? ASSETS.avatarMen : ASSETS.avatarWoman;
  const userName =
    type === 'Supervisor' ? 'Gusepe Bonvoltin U.' : 'Charlotte York Goldenblaim';

  if (open) {
    return (
      <div className={[styles.avatarSection, styles.avatarOpen].join(' ')}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: tokens.colors.panel.$value,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 4px',
              border: `2px solid ${tokens.colors['primario-oscuro'].$value}`,
            }}
          >
            <img
              src={avatarSrc}
              alt={`Avatar de ${userName}`}
              className={styles.avatarImg}
            />
          </div>
          <p className={styles.avatarGreeting}>
            <span className={styles.hola}>¡Hola! </span>
            <span className={styles.userName}>{userName}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={[styles.avatarSection, styles.avatarClosed].join(' ')}>
      <div className={styles.avatarPhotoSmall}>
        <img
          src={avatarSrc}
          alt={`Avatar de ${userName}`}
          className={styles.avatarImg}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * MenuPortal — Barra de navegación lateral del portal Zafiro.
 *
 * Variantes:
 *   - Open=true  / Type=Supervisor   → menú expandido con 9 secciones
 *   - Open=true  / Type=Colaborador  → menú expandido con 8 secciones
 *   - Open=false / Type=Supervisor   → barra colapsada con iconos
 *   - Open=false / Type=Colaborador  → barra colapsada con iconos
 */
export function MenuPortal({
  open = true,
  type = 'Supervisor',
  onToggle,
  className,
}: MenuPortalProps) {
  const items = type === 'Supervisor' ? SUPERVISOR_ITEMS : COLABORADOR_ITEMS;

  return (
    <nav
      className={[
        styles.root,
        open ? styles.open : styles.closed,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Menú de navegación"
    >
      {/* ── Sidebar ── */}
      <div className={styles.sidebar}>
        <Logo open={open} />
        <AvatarSection open={open} type={type} />

        {/* Menu items */}
        <ul className={styles.menuList} role="list">
          {items.map((item) =>
            open ? (
              /* Expanded row: [icon] [chevron ▾] [label] */
              <li key={item.label} className={styles.menuItem}>
                <button
                  className={styles.menuItemButton}
                  type="button"
                  aria-label={item.label}
                >
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    className={styles.menuItemIcon}
                  />
                  <div className={styles.menuItemContent}>
                    <img
                      src={ASSETS.chevronDown}
                      alt=""
                      aria-hidden="true"
                      className={styles.chevronIcon}
                    />
                    <span className={styles.menuItemLabel}>{item.label}</span>
                  </div>
                </button>
              </li>
            ) : (
              /* Collapsed row: icon only */
              <li key={item.label} className={styles.menuItem}>
                <button
                  className={styles.menuItemClosed}
                  type="button"
                  aria-label={item.label}
                >
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    className={styles.menuItemIcon}
                  />
                </button>
              </li>
            )
          )}
        </ul>
      </div>

      {/* ── Toggle button ── */}
      <button
        className={styles.toggleButton}
        type="button"
        onClick={onToggle}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
      >
        <div className={styles.toggleCircle}>
          <img
            src={open ? ASSETS.toggleOpenCircle : ASSETS.toggleClosedCircle}
            alt=""
            aria-hidden="true"
            className={styles.toggleBg}
          />
          <img
            src={open ? ASSETS.chevronRight : ASSETS.menuHamburger}
            alt=""
            aria-hidden="true"
            className={styles.toggleIcon}
          />
        </div>
      </button>
    </nav>
  );
}
