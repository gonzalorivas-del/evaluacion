# Reglas de Solicitud — Proyecto pruebads (Zafiro + React)

## Identidad del Proyecto
Este proyecto construye componentes React basados en el sistema de diseño
Zafiro de Rex+. Siempre generar código funcional, no maquetas.

## Reglas Obligatorias

### 1. Siempre revisar manifest.json antes de crear cualquier componente
- Si el componente existe en manifest.json → úsalo o extiéndelo
- Si NO existe → créalo siguiendo las convenciones de Zafiro

### 2. Nunca hardcodear valores de diseño
- ❌ Prohibido: color: "#1E5591", fontSize: "14px", padding: "8px"
- ✅ Correcto: color: tokens.colorPrimary, fontSize: tokens.textBody14, padding: tokens.spacingSm

### 3. Usar siempre los tokens de tokens.json
- Importar tokens al inicio de cada componente
- Para colores: usar el nombre semántico, no el hex

### 4. Nomenclatura de componentes
- PascalCase para componentes: Button, InputField, DataTable
- camelCase para props: isDisabled, isLoading, onClick
- Prefijo "Zafiro" solo si es necesario diferenciarlo: ZafiroButton

### 5. Estructura de archivos
- Un componente por archivo
- Nombre del archivo = nombre del componente: Button.jsx
- Carpeta: src/components/[NombreComponente]/
- Incluir: index.jsx + [Nombre].stories.jsx si corresponde

### 6. Tipografía
- Familia principal: Roboto
- Familia secundaria: Montserrat (solo headings de alto nivel)
- Nunca usar Arial o sans-serif genérico

### 7. Código limpio y comentado
- Comentar props con JSDoc
- Exportar tipos con TypeScript si el proyecto usa TS
- Los componentes deben ser accesibles: labels, aria-*, roles

## Componentes especiales

### BloquesSeleccion
Selector dual para competencias. Layout de cada fila del panel derecho (de izquierda a derecha):
1. `InputField` (flex: 1) — label = nombre competencia, value = porcentaje editable, icon = PercentIcon
2. `Selector` (width: 128px) — escala de evaluación
3. Botón con `TrashIcon` (color error #E24C4C) — eliminar competencia

Props: `available`, `selected` (incluye `percentage`), `onToggle`, `onUpdateScale`, `onUpdatePercentage`, `scaleOptions`, `currentScale`

## Flujo de trabajo
1. Recibo una solicitud de componente o pantalla
2. Verifico en manifest.json si ya existe
3. Aplico los tokens correspondientes de tokens.json
4. Genero el código React funcional
5. Indico qué tokens usé y por qué
