import { ALLOWED_DOMAIN } from '../config';

export function decodeJwt(token) {
  const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(escape(window.atob(payload))));
}

export function isAllowedProfile(profile) {
  return profile.hd === ALLOWED_DOMAIN && profile.email?.endsWith(`@${ALLOWED_DOMAIN}`);
}

export function initGoogleSignIn({ clientId, buttonId, callback }) {
  return new Promise((resolve, reject) => {
    if (!clientId) {
      reject(new Error('Falta configurar VITE_GOOGLE_CLIENT_ID.'));
      return;
    }

    const timer = setInterval(() => {
      if (!window.google?.accounts?.id) return;
      clearInterval(timer);
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback,
        hosted_domain: ALLOWED_DOMAIN
      });
      window.google.accounts.id.renderButton(document.getElementById(buttonId), {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 280
      });
      resolve();
    }, 150);
  });
}
