import selectOptions from '../data/select-options.json';

const commonPublicationFields = [
  { name: 'FECHA_PUBLICACION', label: 'Fecha publicacion', type: 'date', hint: 'Fecha oficial de publicacion.' },
  { name: 'CAMPO_DETALLADO', label: 'Campo detallado', options: selectOptions.campoDetallado, hint: 'Codigo del campo detallado.' },
  { name: 'FILIACION', label: 'Filiacion UNESUM', options: selectOptions.siNo, hint: 'Indique si consta UNESUM.' },
  { name: 'IDENTIFICACION_PARTICIPANTE', label: 'Identificacion participante', hint: 'Cedula o pasaporte.' },
  { name: 'PARTICIPACION', label: 'Participacion', options: selectOptions.participacion, hint: 'Rol en la publicacion.' },
  { name: 'LINEA_INVESTIGACION', label: 'Linea investigacion', options: selectOptions.lineasInvestigacion, hint: 'Linea institucional asociada.' },
  { name: 'APELLIDOS_NOMBRES', label: 'Apellidos y nombres', uppercase: true, hint: 'Apellidos y nombres completos.' },
  { name: 'PERIODO_ACADEMICO', label: 'Periodo academico', options: selectOptions.periodosAcademicos, hint: 'Periodo de registro.' },
  { name: 'FACULTAD', label: 'Facultad', type: 'faculty', hint: 'Seleccione su facultad.' },
  { name: 'CARRERA', label: 'Carrera', type: 'career', hint: 'Seleccione su carrera.' },
  { name: 'RESULTADO DE PROYECTO DE INVESTIGACION', label: 'Resultado proyecto investigacion', options: selectOptions.siNo, section: 'Proyecto de investigacion', hint: 'Marque si aplica.' },
  { name: 'TITULO_PROYECTO_INVESTIGACION', label: 'Titulo proyecto investigacion', section: 'Proyecto de investigacion', hint: 'Llenar si investigacion es SI.' },
  { name: 'ESTADO_PROYECTO_INVESTIGACION', label: 'Estado proyecto investigacion', options: selectOptions.estadoProyecto, section: 'Proyecto de investigacion', hint: 'Estado si aplica.' },
  { name: 'RESULTADO DE PROYECTO DE VINCULACION', label: 'Resultado proyecto vinculacion', options: selectOptions.siNo, section: 'Proyecto de vinculacion', hint: 'Marque si aplica.' },
  { name: 'TITULO_PROYECTO_VINCULACION', label: 'Titulo proyecto vinculacion', section: 'Proyecto de vinculacion', hint: 'Llenar si vinculacion es SI.' },
  { name: 'ESTADO_PROYECTO_VINCULACION', label: 'Estado proyecto vinculacion', options: selectOptions.estadoProyecto, section: 'Proyecto de vinculacion', hint: 'Estado si aplica.' },
  { name: 'PDF_AVAL_CARTA_CERTIFICADO-PUBLICACION', label: 'PDF aval / carta / certificado', type: 'url', hint: 'Enlace a la evidencia.' }
];

export const publicationTypes = [
  { id: 'articulo', label: 'Articulo', sheet: 'REVISTAS' },
  { id: 'libro', label: 'Libro', sheet: 'LIBROS' },
  { id: 'capitulo', label: 'Capitulo de libro', sheet: 'CAPITULOS' }
];

export const fieldsByType = {
  articulo: [
    { name: 'CODIGO_IES', label: 'Codigo IES', defaultValue: '1025', type: 'readonly', hint: 'Codigo institucional.' },
    { name: 'TIPO_PUBLICACION', label: 'Tipo de publicacion', defaultValue: 'ARTICULO', type: 'readonly', hint: 'Asignado automaticamente.' },
    { name: 'TIPO_ARTICULO', label: 'Tipo de articulo', defaultValue: 'REVISTA', type: 'readonly', hint: 'Asignado automaticamente.' },
    { name: 'CODIGO_PUBLICACION', label: 'Codigo publicacion / DOI', hint: 'DOI o codigo equivalente.' },
    { name: 'TITULO_PUBLICACION', label: 'Titulo publicacion', uppercase: true, hint: 'Titulo del articulo.' },
    { name: 'BASE_DATOS_INDEXADA', label: 'Base de datos indexada', hint: 'Base donde esta indexada.' },
    { name: 'TIPO_BASE_DATOS_INDEXADA', label: 'Tipo base de datos indexada', hint: 'Regional, Scopus u otra.' },
    { name: 'CODIGO_ISSN', label: 'Codigo ISSN', hint: 'ISSN de la revista.' },
    { name: 'NOMBRE_REVISTA', label: 'Nombre revista', uppercase: true, hint: 'Nombre de la revista.' },
    { name: 'ESTADO', label: 'Estado', options: selectOptions.estadoArticulo, hint: 'Estado de publicacion.' },
    { name: 'LINK_PUBLICACION', label: 'Link publicacion', type: 'url', hint: 'Enlace directo al articulo.' },
    { name: 'LINK_REVISTA', label: 'Link revista', type: 'url', hint: 'Sitio de la revista.' },
    { name: 'CUARTIL', label: 'Cuartil', options: selectOptions.cuartil, hint: 'Seleccione si corresponde.' },
    { name: 'RELACION_LABORAL', label: 'Relacion laboral', options: selectOptions.relacionLaboral, hint: 'Tipo de relacion docente.' },
    { name: 'GRADO ACADEMICO', label: 'Grado academico', options: selectOptions.gradoAcademico, hint: 'Mayor grado registrado.' },
    { name: 'NUMERO_REVISTA', label: 'Numero revista', hint: 'Formato sugerido: Vol. 5, N° 4.' },
    { name: 'SJR', label: 'SJR', hint: 'Indicador Scimago Journal Rank.' },
    { name: 'INTERCULTURALIDAD (SI o NO)', label: 'Interculturalidad', options: selectOptions.siNo },
    { name: 'POSICION', label: 'Posicion', type: 'number', min: 1, hint: 'Orden de autoria: 1, 2, 3...' },
    ...commonPublicationFields
  ],
  libro: [
    { name: 'CODIGO_IES', label: 'Codigo IES', defaultValue: '1025', type: 'readonly', hint: 'Codigo institucional.' },
    { name: 'TIPO_PUBLICACION', label: 'Tipo de publicacion', defaultValue: 'LIBRO', type: 'readonly', hint: 'Asignado automaticamente.' },
    { name: 'TITULO_LIBRO', label: 'Titulo libro', uppercase: true, hint: 'Titulo completo del libro.' },
    { name: 'CODIGO_ISBN', label: 'Codigo ISBN', hint: 'ISBN sin la palabra ISBN.' },
    { name: 'REVISADO_PARES', label: 'Revisado por pares', options: selectOptions.siNo },
    { name: 'POSICION', label: 'Posicion', type: 'number', min: 1, hint: 'Orden de autoria: 1, 2, 3...' },
    { name: 'ENLACE_LIBRO', label: 'Enlace libro', type: 'url', hint: 'Enlace al libro completo.' },
    ...commonPublicationFields
  ],
  capitulo: [
    { name: 'CODIGO_IES', label: 'Codigo IES', defaultValue: '1025', type: 'readonly', hint: 'Codigo institucional.' },
    { name: 'TIPO_PUBLICACION', label: 'Tipo de publicacion', defaultValue: 'CAPITULO', type: 'readonly', hint: 'Asignado automaticamente.' },
    { name: 'TITULO_CAPITULO', label: 'Titulo capitulo', uppercase: true, hint: 'Titulo del capitulo.' },
    { name: 'TITULO_LIBRO', label: 'Titulo libro', uppercase: true, hint: 'Libro donde aparece.' },
    { name: 'CODIGO_ISBN', label: 'Codigo ISBN', hint: 'ISBN sin la palabra ISBN.' },
    { name: 'EDITOR_COMPILADOR', label: 'Editor / compilador', hint: 'Nombre del editor.' },
    { name: 'PAGINAS (DESDE_23-45)', label: 'Paginas', hint: 'Ejemplo: 23-45.' },
    { name: 'LINK DEL CAPITULO DE LIBRO', label: 'Link capitulo de libro', type: 'url', hint: 'Enlace al capitulo.' },
    ...commonPublicationFields
  ]
};
