import { APPS_SCRIPT_URL } from '../config';

let requestCounter = 0;

async function callBackend(action, idToken, payload = {}) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Falta configurar VITE_APPS_SCRIPT_URL.');
  }

  const data = await postWithIframe({ action, idToken, ...payload });
  if (!data.ok) {
    throw new Error(data.error || 'No se pudo completar la solicitud.');
  }
  return data;
}

function postWithIframe(payload) {
  return new Promise((resolve, reject) => {
    const requestId = `apps_script_${Date.now()}_${requestCounter++}`;
    const iframeName = `${requestId}_frame`;
    const form = document.createElement('form');
    const input = document.createElement('input');
    const iframe = document.createElement('iframe');
    const timeout = window.setTimeout(() => cleanup(new Error('El backend no respondio a tiempo.')), 30000);

    function cleanup(error, data) {
      window.clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      form.remove();
      iframe.remove();
      if (error) reject(error);
      else resolve(data);
    }

    function handleMessage(event) {
      if (event.data?.requestId !== requestId) return;
      cleanup(null, event.data.payload);
    }

    window.addEventListener('message', handleMessage);

    iframe.name = iframeName;
    iframe.hidden = true;

    input.type = 'hidden';
    input.name = 'payload';
    input.value = JSON.stringify({
      ...payload,
      requestId,
      origin: window.location.origin
    });

    form.method = 'POST';
    form.action = APPS_SCRIPT_URL;
    form.target = iframeName;
    form.style.display = 'none';
    form.append(input);

    document.body.append(iframe, form);
    form.submit();
  });
}

export function listPublications(idToken) {
  return callBackend('list', idToken);
}

export function createPublication(idToken, type, values, status = 'COMPLETO') {
  return callBackend('create', idToken, { type, values, status });
}
