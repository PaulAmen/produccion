import { fieldsByType } from './fields';
import { normalizeCareerValues } from './careers';

export function createInitialValues(type) {
  return Object.fromEntries(
    fieldsByType[type].map((field) => [field.name, field.defaultValue || ''])
  );
}

export function createValuesFromRecord(record) {
  const values = {};
  for (const field of fieldsByType[record.publicationType]) {
    values[field.name] = record.values?.[field.name] || field.defaultValue || '';
  }

  if (!values.TITULO_PROYECTO_INVESTIGACION && record.values?.TITULO_PROYECTO && record.values?.['RESULTADO DE PROYECTO DE INVESTIGACION'] === 'SI') {
    values.TITULO_PROYECTO_INVESTIGACION = record.values.TITULO_PROYECTO;
  }
  if (!values.TITULO_PROYECTO_VINCULACION && record.values?.TITULO_PROYECTO && record.values?.['RESULTADO DE PROYECTO DE VINCULACION'] === 'SI') {
    values.TITULO_PROYECTO_VINCULACION = record.values.TITULO_PROYECTO;
  }

  return normalizeCareerValues(values);
}

export function normalizeFieldValue(field, rawValue) {
  const normalizedNumber = field.type === 'number' && field.min
    ? String(Math.max(Number(rawValue || field.min), field.min))
    : rawValue;
  return field.uppercase ? normalizedNumber.toUpperCase() : normalizedNumber;
}
