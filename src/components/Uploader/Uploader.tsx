import React, { useId, useRef, useState } from 'react';
import styles from './Uploader.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface UploaderFile {
  /** Nombre del archivo a mostrar */
  name: string;
  /** Tamaño formateado a mostrar. Ej.: "0.1 MB" */
  size: string;
}

export interface UploaderProps {
  /** Título del encabezado. Default: "Formato esperado del archivo" */
  title?: string;
  /**
   * Líneas de descripción del formato esperado.
   * Acepta string (una línea) o string[] (varias líneas).
   */
  description?: string | string[];
  /** Texto de soporte debajo de la zona de carga. Default: "Excel, PDF, Word / 5mb máximo." */
  supportText?: string;
  /** Texto dentro de la zona drag-drop vacía. */
  dropzoneText?: string;
  /**
   * Archivo actualmente cargado (modo controlado).
   * Pasar `null` para mostrar el estado vacío.
   */
  file?: UploaderFile | null;
  /** Callback al seleccionar o soltar un archivo. Recibe el `File` nativo del navegador. */
  onFileChange?: (file: File) => void;
  /** Callback al hacer clic en el botón de eliminar archivo. */
  onFileRemove?: () => void;
  /** Callback al hacer clic en "Descargar plantilla". */
  onDownloadTemplate?: () => void;
  /** Tipos de archivo aceptados (atributo HTML `accept`). Default: ".xlsx,.xls,.pdf,.doc,.docx" */
  accept?: string;
  /** Deshabilita toda interacción. Default: false */
  disabled?: boolean;
  className?: string;
}

/* ─── Íconos inline SVG ──────────────────────────────────────────────────── */

/** Ícono de descarga (16×16) — heredera el color del contenedor (currentColor) */
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2v8M5 7.5l3 3.5 3-3.5M2 13h12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Nube con flecha hacia arriba — estado vacío del dropzone.
 *  Fuente: src/assets/icons/Cloud.svg
 */
function CloudUploadIcon() {
  return (
    <svg width="56" height="37" viewBox="0 0 56 37" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.6377 9.30113C15.3028 3.10038 20.4283 0 28.0139 0C39.3925 0 44.6639 8.01097 44.6639 13.5977C47.9515 13.5977 53.9984 15.5975 55.5488 21.8383C57.0732 27.974 54.7348 33.0279 48.5337 37C32.3929 37 20.693 37 13.434 37C2.54543 37 -2.28448 24.0186 1.02991 17.2521C3.23951 12.741 7.10877 10.0907 12.6377 9.30113Z"
        fill="#B6CEE7"
      />
      <path
        d="M27.7099 14.0463C27.5029 14.1043 26.5819 14.9813 24.1139 17.4723C22.2919 19.3113 22.1219 19.4933 22.0589 19.6833C21.8739 20.2413 22.2669 20.9033 22.8289 20.9783C23.0909 21.0133 23.3709 20.9523 23.5399 20.8233C23.6179 20.7633 24.4269 19.9763 25.3389 19.0743L26.9959 17.4343L27.0099 21.3273C27.0209 24.4093 27.0349 25.2533 27.0759 25.3803C27.1349 25.5583 27.3689 25.7963 27.5939 25.9063C27.7899 26.0023 28.2099 26.0023 28.4059 25.9063C28.6309 25.7963 28.8649 25.5583 28.9239 25.3803C28.9649 25.2533 28.9789 24.4083 28.9899 21.3253L29.0039 17.4293L30.6119 19.0273C31.4959 19.9063 32.3269 20.7053 32.4569 20.8033C32.6859 20.9743 32.7039 20.9803 32.9769 20.9783C33.1859 20.9773 33.3019 20.9553 33.4199 20.8923C33.7479 20.7183 33.9969 20.3413 33.9989 20.0173C34.0009 19.6023 34.0289 19.6353 31.8449 17.4323C29.7059 15.2733 28.6019 14.2043 28.4059 14.1033C28.2489 14.0223 27.8979 13.9933 27.7099 14.0463Z"
        fill="white"
      />
    </svg>
  );
}

/** Círculo con check verde — archivo cargado correctamente (24×24) */
function CheckCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.25" stroke="#ACCA54" strokeWidth="1.5" />
      <path
        d="M7.5 12L10.5 15L16.5 9"
        stroke="#ACCA54"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Ícono de papelera (24×24) — eliminar archivo */
function TrashIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6H20M8 6V4H16V6M18 6L16.5 19.5H7.5L6 6"
        stroke="#E24C4C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10V16M14 10V16"
        stroke="#E24C4C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * Uploader del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1194:18475.
 *
 * Tarjeta de carga de archivos con dos variantes:
 * - **Uploader-default**: zona drag-drop vacía con nube + instrucción.
 * - **Uploader-load**: muestra el archivo cargado (nombre, tamaño, botón eliminar).
 *
 * El componente funciona en modo controlado (prop `file` + callbacks `onFileChange`
 * / `onFileRemove`). Para uso sin estado externo, omitir `file` y manejar los callbacks
 * en el padre.
 *
 * @example
 * // Modo controlado
 * const [file, setFile] = useState<UploaderFile | null>(null);
 *
 * <Uploader
 *   file={file}
 *   onFileChange={(f) => setFile({ name: f.name, size: formatSize(f.size) })}
 *   onFileRemove={() => setFile(null)}
 *   onDownloadTemplate={() => window.open('/plantilla.xlsx')}
 * />
 */
export const Uploader = React.forwardRef<HTMLDivElement, UploaderProps>(
  function Uploader(
    {
      title = 'Formato esperado del archivo',
      description = [
        'Columnas requeridas: nombre · Opcionales: rut empresa cargo familia_cargo',
        'Separador: punto y coma (;) o coma (,) · Codificación: UTF-8',
      ],
      supportText = 'Excel, PDF, Word / 5mb máximo.',
      dropzoneText = 'Arrastra y suelta un archivo aquí o haz clic para seleccionarlo',
      file = null,
      onFileChange,
      onFileRemove,
      onDownloadTemplate,
      accept = '.xlsx,.xls,.pdf,.doc,.docx',
      disabled = false,
      className,
    },
    ref,
  ) {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const descLines = Array.isArray(description) ? description : [description];
    const hasFile = !!file;

    function openFilePicker() {
      if (!disabled) inputRef.current?.click();
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      const f = e.target.files?.[0];
      if (f) {
        onFileChange?.(f);
        e.target.value = ''; // permite volver a seleccionar el mismo archivo
      }
    }

    function handleDragOver(e: React.DragEvent) {
      e.preventDefault();
      if (!disabled) setDragOver(true);
    }

    function handleDragLeave(e: React.DragEvent) {
      // solo quitar el estado si el cursor sale del dropzone (no de un hijo)
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setDragOver(false);
      }
    }

    function handleDrop(e: React.DragEvent) {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const f = e.dataTransfer.files?.[0];
      if (f) onFileChange?.(f);
    }

    function handleDropzoneKeyDown(e: React.KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFilePicker();
      }
    }

    const rootClass = [styles.card, disabled ? styles.isDisabled : '', className ?? '']
      .filter(Boolean)
      .join(' ');

    const dropzoneClass = [
      styles.dropzone,
      hasFile ? styles.hasFile : '',
      dragOver ? styles.dragOver : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={rootClass}>
        {/* ── Encabezado ── */}
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>

          <button
            type="button"
            className={styles.downloadBtn}
            onClick={onDownloadTemplate}
            disabled={disabled}
          >
            <DownloadIcon />
            <span>Descargar plantilla</span>
          </button>
        </div>

        {/* ── Descripción del formato ── */}
        {descLines.length > 0 && (
          <div className={styles.description}>
            {descLines.map((line, i) => (
              <p key={i} className={styles.descLine}>
                {line}
              </p>
            ))}
          </div>
        )}

        {/* ── Zona de carga ── */}
        <div className={styles.uploadSection}>
          {/* Input nativo oculto */}
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={accept}
            className={styles.hiddenInput}
            onChange={handleInputChange}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
          />

          {/* Dropzone */}
          <div
            className={dropzoneClass}
            onClick={!hasFile ? openFilePicker : undefined}
            onDragOver={!hasFile ? handleDragOver : undefined}
            onDragLeave={!hasFile ? handleDragLeave : undefined}
            onDrop={!hasFile ? handleDrop : undefined}
            role={!hasFile ? 'button' : undefined}
            tabIndex={!hasFile && !disabled ? 0 : undefined}
            aria-label={!hasFile ? 'Zona de carga de archivo. Pulsa Enter para abrir el selector.' : undefined}
            onKeyDown={!hasFile ? handleDropzoneKeyDown : undefined}
          >
            {!hasFile ? (
              /* Estado vacío */
              <div className={styles.emptyState}>
                <CloudUploadIcon />
                <p className={styles.dropzoneText}>{dropzoneText}</p>
              </div>
            ) : (
              /* Estado cargado */
              <div className={styles.fileRow}>
                <div className={styles.fileInfo}>
                  <CheckCircleIcon />
                  <div className={styles.fileText}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>{file.size}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={onFileRemove}
                  aria-label={`Eliminar archivo ${file.name}`}
                  disabled={disabled}
                >
                  <TrashIcon />
                </button>
              </div>
            )}
          </div>

          {/* Texto de soporte — solo en estado vacío */}
          {!hasFile && <p className={styles.supportText}>{supportText}</p>}
        </div>
      </div>
    );
  },
);
