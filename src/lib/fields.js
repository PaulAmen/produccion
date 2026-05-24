const yesNoOptions = ['SI', 'NO'];

const periodOptions = ['PI-2024', 'PII-2024', 'PI-2025', 'PII-2025', 'PI-2026', 'PII-2026'];

const campoDetalladoOptions = [
  '1-4A',
  '1-11A',
  '1-14A',
  '1-16A',
  '1-18A',
  '1-25A',
  '1-28A',
  '1-32A',
  '1-33A',
  '2-14A',
  '2-37A',
  '3-14A',
  '3-19A',
  '4-13A',
  '4-19A',
  '5-110A',
  '8-19A'
];

const lineaInvestigacionOptions = [
  'AMBIENTE Y BIODIVERSIDAD',
  'BIOTECNOLOGIA Y MEJORAMIENTO GENETICO',
  'EDUCACION Y COMUNICACION PARA EL DESARROLLO HUMANO Y SOCIAL',
  'EMPRENDIMIENTO, INNOVACION Y DESARROLLO LOCAL SOSTENIBLE',
  'ESTRUCTURAS E INGENIERIA DE MATERIALES',
  'INTERVENCION SOCIAL EN LA DIVERSIDAD',
  'PLANEAMIENTO ESTRATEGICO Y DIRECCION DE ORGANIZACIONES PRODUCTIVAS Y EMPRESA',
  'PROCESOS ADMINISTRATIVOS Y CONTROL CONTABLE EN LAS ORGANIZACIONES PUBLICAS Y PRIVADAS',
  'RECURSOS HIDRICOS Y OBRAS DE SANEAMIENTO AMBIENTAL',
  'SALUD PUBLICA',
  'SILVICULTURA',
  'SISTEMA INTEGRADO DE PRODUCCION E INOCUIDAD AGROPECUARIA Y AGROSILVICOLA',
  'TECNOLOGIA DE LA INFORMACION E INNOVACION APLICADO AL DESARROLLO SOCIAL, EMPRESARIAL Y AL ENTORNO NATURAL',
  'TURISMO CONSCIENTE'
];

const commonPublicationFields = [
  { name: 'FECHA_PUBLICACION', label: 'Fecha publicacion', type: 'date' },
  { name: 'CAMPO_DETALLADO', label: 'Campo detallado', options: campoDetalladoOptions },
  { name: 'FILIACION', label: 'Filiacion UNESUM', options: yesNoOptions },
  { name: 'IDENTIFICACION_PARTICIPANTE', label: 'Identificacion participante' },
  { name: 'PARTICIPACION', label: 'Participacion', options: ['AUTOR', 'COAUTOR'] },
  { name: 'LINEA_INVESTIGACION', label: 'Linea investigacion', options: lineaInvestigacionOptions },
  { name: 'APELLIDOS_NOMBRES', label: 'Apellidos y nombres', uppercase: true },
  { name: 'PERIODO_ACADEMICO', label: 'Periodo academico', options: periodOptions },
  { name: 'FACULTAD', label: 'Facultad', type: 'readonly' },
  { name: 'CARRERA', label: 'Carrera', type: 'career' },
  { name: 'RESULTADO DE PROYECTO DE INVESTIGACION', label: 'Resultado proyecto investigacion', options: yesNoOptions },
  { name: 'RESULTADO DE PROYECTO DE VINCULACION', label: 'Resultado proyecto vinculacion', options: yesNoOptions },
  { name: 'TITULO_PROYECTO', label: 'Titulo proyecto' },
  { name: 'ESTADO_PROYECTO', label: 'Estado proyecto', options: ['EN EJECUCION', 'FINALIZADO', 'NO APLICA'] },
  { name: 'PDF_AVAL_CARTA_CERTIFICADO-PUBLICACION', label: 'PDF aval / carta / certificado', type: 'url' }
];

export const publicationTypes = [
  { id: 'articulo', label: 'Articulo', sheet: 'REVISTAS' },
  { id: 'libro', label: 'Libro', sheet: 'LIBROS' },
  { id: 'capitulo', label: 'Capitulo de libro', sheet: 'CAPITULOS' }
];

export const fieldsByType = {
  articulo: [
    { name: 'CODIGO_IES', label: 'Codigo IES', defaultValue: '1025', type: 'readonly' },
    { name: 'TIPO_PUBLICACION', label: 'Tipo de publicacion', defaultValue: 'ARTICULO', type: 'readonly' },
    { name: 'TIPO_ARTICULO', label: 'Tipo de articulo', defaultValue: 'REVISTA' },
    { name: 'CODIGO_PUBLICACION', label: 'Codigo publicacion / DOI' },
    { name: 'TITULO_PUBLICACION', label: 'Titulo publicacion', uppercase: true },
    { name: 'BASE_DATOS_INDEXADA', label: 'Base de datos indexada' },
    { name: 'TIPO_BASE_DATOS_INDEXADA', label: 'Tipo base de datos indexada' },
    { name: 'CODIGO_ISSN', label: 'Codigo ISSN' },
    { name: 'NOMBRE_REVISTA', label: 'Nombre revista', uppercase: true },
    { name: 'ESTADO', label: 'Estado', options: ['PUBLICADO', 'ACEPTADO'] },
    { name: 'LINK_PUBLICACION', label: 'Link publicacion', type: 'url' },
    { name: 'LINK_REVISTA', label: 'Link revista', type: 'url' },
    { name: 'CUARTIL', label: 'Cuartil' },
    { name: 'RELACION_LABORAL', label: 'Relacion laboral' },
    { name: 'GRADO ACADEMICO', label: 'Grado academico' },
    { name: 'NUMERO_REVISTA', label: 'Numero revista' },
    { name: 'SJR', label: 'SJR' },
    { name: 'INTERCULTURALIDAD (SI o NO)', label: 'Interculturalidad', options: yesNoOptions },
    { name: 'POSICION', label: 'Posicion', type: 'number' },
    ...commonPublicationFields
  ],
  libro: [
    { name: 'CODIGO_IES', label: 'Codigo IES', defaultValue: '1025', type: 'readonly' },
    { name: 'TIPO_PUBLICACION', label: 'Tipo de publicacion', defaultValue: 'LIBRO', type: 'readonly' },
    { name: 'TITULO_LIBRO', label: 'Titulo libro', uppercase: true },
    { name: 'CODIGO_ISBN', label: 'Codigo ISBN' },
    { name: 'REVISADO_PARES', label: 'Revisado por pares', options: yesNoOptions },
    { name: 'POSICION', label: 'Posicion', type: 'number' },
    { name: 'ENLACE_LIBRO', label: 'Enlace libro', type: 'url' },
    ...commonPublicationFields
  ],
  capitulo: [
    { name: 'CODIGO_IES', label: 'Codigo IES', defaultValue: '1025', type: 'readonly' },
    { name: 'TIPO_PUBLICACION', label: 'Tipo de publicacion', defaultValue: 'CAPITULO', type: 'readonly' },
    { name: 'TITULO_CAPITULO', label: 'Titulo capitulo', uppercase: true },
    { name: 'TITULO_LIBRO', label: 'Titulo libro', uppercase: true },
    { name: 'CODIGO_ISBN', label: 'Codigo ISBN' },
    { name: 'EDITOR_COMPILADOR', label: 'Editor / compilador' },
    { name: 'PAGINAS (DESDE_23-45)', label: 'Paginas' },
    { name: 'LINK DEL CAPITULO DE LIBRO', label: 'Link capitulo de libro', type: 'url' },
    ...commonPublicationFields
  ]
};
