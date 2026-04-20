import { useEvaluation } from '../../../context/EvaluationContext';
import { CardOption } from '../../CardOption';
import { Checkbox } from '../../Checkbox';
import { Button } from '../../Button';
import { ArrowRightIcon } from '../../../assets/icons/ArrowRightIcon';

/*
 * Tokens Zafiro usados (src/tokens/tokens.json):
 *   panel:            #5780AD  — títulos de sección, instrucción
 *   primario:         #1E5591  — (via Button primary)
 *   importante:       #00B4FF  — (via CardOption selected border)
 *   negro-textos:     #333333  — texto banner
 *   gris-oscuro:      #666666  — subtexto banner
 *   blanco:           #FFFFFF  — fondo cards
 *   Background/Admin: #EDF2F4  — fondo banner
 *   elevation-1:      0px 2px 4px 0px rgba(0,0,0,0.15)
 *   elevation-2:      0px 5px 8px 0px rgba(0,0,0,0.15)
 *   auxiliar:         #B6CEE7  — color ícono flecha Guardar y continuar
 */

/* ── Ícono chevron abajo ──────────────────────────────────────────────────── */
function ChevronDownIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 13L16 19L22 13" stroke="#5780AD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Ícono chevron arriba ─────────────────────────────────────────────────── */
function ChevronUpIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M22 19L16 13L10 19" stroke="#5780AD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Banner de confirmación de tipo ──────────────────────────────────────── */
function ConfirmationBanner({ typeLabel, subtypeText }) {
  return (
    <div style={{
      background: '#EDF2F4',       /* Background/Administration */
      padding: '8px 16px',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '20px',
        color: '#333333',           /* negro-textos */
        margin: '0 0 2px',
      }}>
        {'Haz seleccionado realizar el proceso de calibración mediante: '}
        <span style={{ fontWeight: 500 }}>{typeLabel}</span>
      </p>
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '1',
        color: '#666666',           /* gris-oscuro */
        margin: 0,
      }}>
        {subtypeText}
      </p>
    </div>
  );
}

/* ── Paso 5: Calibración ─────────────────────────────────────────────────── */
export default function Step5Calibration() {
  const {
    currentEval,
    updateCurrentEval,
    saveCurrentEval,
    setActiveStep,
    saveDraft,
  } = useEvaluation();

  if (!currentEval) return null;
  const ev = currentEval;

  const updateCalibOption = (key, value) => {
    updateCurrentEval(prev => ({
      ...prev,
      calibrationOptions: { ...prev.calibrationOptions, [key]: value },
    }));
  };

  const handleSaveAndContinue = () => {
    if (!ev.calibrationType) return;
    saveCurrentEval(5);
    if (ev.hasFeedback) {
      setActiveStep(6);
    } else {
      setActiveStep(7);
    }
  };

  const isAdvancedExpanded = ev.calibrationOptions._advancedExpanded || false;

  /* ── Estilo compartido para sub-secciones (elevation-2) ──────────────── */
  const subSectionStyle = {
    background: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)', /* elevation-2 */
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const sectionTitleStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '1.3',
    color: '#5780AD',               /* panel */
    margin: 0,
  };

  return (
    <>
      {/* ── Sección 1: selección de tipo de calibración ───────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.15)', /* elevation-1 */
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
      }}>

        {/* Instrucción */}
        <p style={{
          ...sectionTitleStyle,
          width: '768px',
          maxWidth: '100%',
        }}>
          Selecciona el tipo de calibración que utilizarás en el proceso de Evaluación de Desempeño.
        </p>

        {/* Cards de tipo de calibración */}
        <div style={{
          display: 'flex',
          gap: '24px',
          width: '768px',
          maxWidth: '100%',
          alignItems: 'stretch',
        }}>
          <div style={{ flex: '0 0 calc(50% - 12px)', display: 'flex' }}>
            <CardOption
              title="Calibración por Ninebox"
              subtitle=""
              description="Posicionamiento de colaboradores en una matriz 9 cuadrantes que combina desempeño y potencial. Se realiza directamente desde la plataforma de Administración de Desempeño."
              selected={ev.calibrationType === 'ninebox'}
              onClick={() => updateCurrentEval({ calibrationType: 'ninebox' })}
            />
          </div>
          <div style={{ flex: '0 0 calc(50% - 12px)', display: 'flex' }}>
            <CardOption
              title="Calibración vía Portal del Colaborador"
              subtitle=""
              description="Los evaluadores revisan y proponen ajustes a los resultados desde el Portal del Colaborador. Permite la formación de comités de revisión."
              selected={ev.calibrationType === 'portal'}
              onClick={() => updateCurrentEval({ calibrationType: 'portal' })}
            />
          </div>
        </div>

        {/* Texto de ayuda cuando no hay selección */}
        {!ev.calibrationType && (
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '1',
            color: '#5780AD',         /* panel */
            margin: 0,
            width: '768px',
            maxWidth: '100%',
          }}>
            Selecciona un tipo de calibración para continuar.
          </p>
        )}

        {/* ── Estado: Ninebox seleccionado ───────────────────────────────── */}
        {ev.calibrationType === 'ninebox' && (
          <div style={{ width: '768px', maxWidth: '100%' }}>
            <ConfirmationBanner
              typeLabel="Ninebox."
              subtypeText="Este proceso se realiza directamente desde la plataforma de Administración de Desempeño."
            />
          </div>
        )}

        {/* ── Estado: Portal del Colaborador seleccionado ────────────────── */}
        {ev.calibrationType === 'portal' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '768px',
            maxWidth: '100%',
          }}>
            {/* Banner de confirmación */}
            <ConfirmationBanner
              typeLabel="Calibración vía Portal del Colaborador."
              subtypeText="Este proceso se realiza directamente desde el Portal del Colaborador."
            />

            {/* Sección 2: Formación de comités */}
            <div style={subSectionStyle}>
              <p style={sectionTitleStyle}>Formación de comités</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Checkbox
                  label="El jefe del evaluador es integrante"
                  checked={ev.calibrationOptions.bossIsCommitteeMember}
                  onChange={val => updateCalibOption('bossIsCommitteeMember', val)}
                />
                <Checkbox
                  label="El evaluador es coordinador"
                  checked={ev.calibrationOptions.evaluatorIsCoordinator}
                  onChange={val => updateCalibOption('evaluatorIsCoordinator', val)}
                />
              </div>
            </div>

            {/* Sección 3: Configuración avanzada (colapsable) */}
            <div style={{ ...subSectionStyle, gap: 0 }}>
              <button
                type="button"
                onClick={() => updateCalibOption('_advancedExpanded', !isAdvancedExpanded)}
                aria-expanded={isAdvancedExpanded}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <p style={sectionTitleStyle}>Configuración avanzada</p>
                {isAdvancedExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>

              {isAdvancedExpanded && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  paddingTop: '24px',
                }}>
                  <Checkbox
                    label="Se puede proponer sin valor"
                    checked={ev.calibrationOptions.canProposeWithoutValue}
                    onChange={val => updateCalibOption('canProposeWithoutValue', val)}
                  />
                  <Checkbox
                    label="Valor final debe ser validado por Miembro"
                    checked={ev.calibrationOptions.finalValueValidatedByMember}
                    onChange={val => updateCalibOption('finalValueValidatedByMember', val)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Botones de acción ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
        paddingTop: '8px',
      }}>
        <Button variant="secondary" size="md" onClick={saveDraft}>
          Guardar borrador
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveAndContinue}
          disabled={!ev.calibrationType}
          icon={<ArrowRightIcon size={16} color="#B6CEE7" />}
          iconPosition="right"
        >
          Guardar y continuar
        </Button>
      </div>
    </>
  );
}
