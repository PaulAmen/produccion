import { APPS_SCRIPT_URL } from '../config';

async function callBackend(action, idToken, payload = {}) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Falta configurar VITE_APPS_SCRIPT_URL.');
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, idToken, ...payload })
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo completar la solicitud.');
  }
  return data;
}

export function listPublications(idToken) {
  return callBackend('list', idToken);
}

export function createPublication(idToken, type, values) {
  return callBackend('create', idToken, { type, values });
}
