import { useEvaluation } from '../../../context/EvaluationContext';
import { Checkbox } from '../../Checkbox';
import { Button } from '../../Button';
import { ArrowRightIcon } from '../../../assets/icons/ArrowRightIcon';

/*
 * Tokens Zafiro usados (src/tokens/tokens.json):
 *   panel:       #5780AD  — títulos de sección
 *   negro-textos:#333333  — label activo (vía Checkbox CSS)
 *   gris-oscuro: #666666  — descripción bajo checkbox
 *   neutral-99:  #999999  — descripción sub-opción dependiente
 *   elevation-2: 0px 5px 8px 0px rgba(0,0,0,0.15)
 */

export default function Step6Feedback() {
  const {
    currentEval,
    updateCurrentEval,
    saveCurrentEval,
    setActiveStep,
    saveDraft,
  } = useEvaluation();

  if (!currentEval) return null;
  const ev = currentEval;

  const mustConfirmReading = ev.feedbackOptions?.collaboratorMustConfirmReading ?? false;
  const requireDigitalSign = ev.advancedOptions?.requireDigitalSignature ?? false;
  const accessesResults    = ev.feedbackOptions?.collaboratorAccessesResults ?? false;
  const enableComments     = ev.advancedOptions?.enableGeneralComments ?? false;

  const updateFeedback = (key, value) =>
    updateCurrentEval(prev => ({
      ...prev,
      feedbackOptions: { ...prev.feedbackOptions, [key]: value },
    }));

  const updateAdvanced = (key, value) =>
    updateCurrentEval(prev => ({
      ...prev,
      advancedOptions: { ...prev.advancedOptions, [key]: value },
    }));

  const handleSaveAndContinue = () => {
    saveCurrentEval(6);
    setActiveStep(7);
  };

  const sectionStyle = {
    background: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.15)',
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
    color: '#5780AD',
    margin: 0,
  };

  const descStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '1',
    color: '#666666',
    margin: 0,
  };

  const subDescStyle = { ...descStyle, color: '#999999' };

  return (
    <>
      {/* ── Sección 1: Acceso a resultados ───────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}>Acceso a resultados</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Opción 1 + sub-opción 1.2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Checkbox
              label={<span style={{ color: '#333333' }}>El colaborador debe confirmar haber leído su evaluación para que quede registrada como entregada</span>}
              checked={mustConfirmReading}
              onChange={val => updateFeedback('collaboratorMustConfirmReading', val)}
            />
            <div style={{ paddingLeft: '32px' }}>
              <p style={descStyle}>
                Cuando el colaborador abra su evaluación en el Portal del Colaborador, deberá aceptar explícitamente que ha leído los resultados.
              </p>
            </div>

            {/* Sub-opción 1.2 — siempre visible, deshabilitada si padre no activo */}
            <div style={{ paddingLeft: '32px', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Checkbox
                label={<span style={{ color: '#666666' }}>El colaborador debe firmar digitalmente para aceptar los resultados.</span>}
                checked={requireDigitalSign}
                disabled
              />
              <div style={{ paddingLeft: '32px' }}>
                <p style={subDescStyle}>Requerido cuando la confirmación de lectura está activa.</p>
              </div>
            </div>
          </div>

          {/* Opción 2 */}
          <Checkbox
            label="El colaborador accede a resultados en confirmacion"
            checked={accessesResults}
            onChange={val => updateFeedback('collaboratorAccessesResults', val)}
          />
        </div>
      </div>

      {/* ── Sección 2: Comentarios generales ─────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}>Comentarios generales</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Checkbox
            label="Habilitar comentarios generales al final del formulario"
            checked={enableComments}
            onChange={val => updateAdvanced('enableGeneralComments', val)}
          />
          <div style={{ paddingLeft: '32px' }}>
            <p style={descStyle}>
              Agrega un campo de texto libre al final del formulario de evaluación para que el evaluador pueda incluir observaciones generales.
            </p>
          </div>
        </div>
      </div>

      {/* ── Botones de acción ─────────────────────────────────────────── */}
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
          icon={<ArrowRightIcon size={16} color="#B6CEE7" />}
          iconPosition="right"
        >
          Guardar y continuar
        </Button>
      </div>
    </>
  );
}
