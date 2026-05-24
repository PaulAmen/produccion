import carreraAliases from '../data/carrera-aliases.json';
import carreras from '../data/carreras.json';

export const careers = carreras;
export const faculties = [...new Set(carreras.map((item) => item.facultad))].sort();

export function getCareersByFaculty(faculty) {
  return faculty ? carreras.filter((item) => item.facultad === faculty) : carreras;
}

export function findCareer(careerName) {
  return carreras.find((item) => item.carrera === careerName);
}

export function normalizeCareerName(careerName) {
  return carreraAliases[careerName] || careerName;
}

export function normalizeCareerValues(values) {
  const nextValues = { ...values };
  if (!nextValues.CARRERA) return nextValues;

  nextValues.CARRERA = normalizeCareerName(nextValues.CARRERA);
  const career = findCareer(nextValues.CARRERA);
  nextValues.FACULTAD = career?.facultad || nextValues.FACULTAD;
  return nextValues;
}

export function applyFacultyChange(values, faculty) {
  const career = findCareer(values.CARRERA);
  return {
    ...values,
    FACULTAD: faculty,
    CARRERA: career?.facultad === faculty ? values.CARRERA : ''
  };
}

export function applyCareerChange(values, careerName) {
  const career = findCareer(careerName);
  return {
    ...values,
    CARRERA: careerName,
    FACULTAD: career?.facultad || ''
  };
}
