# Produccion cientifica UNESUM

Frontend Svelte para GitHub Pages con login de Google Workspace y backend gratuito en Google Sheets mediante Apps Script.

## Configuracion

1. Cree un OAuth Client ID web en Google Cloud.
2. Agregue como origen autorizado la URL de GitHub Pages, por ejemplo `https://usuario.github.io`, y para desarrollo local `http://localhost:5173`.
3. Cree una hoja de calculo de Google y abra `Extensiones > Apps Script`.
4. Pegue el contenido de `apps-script/Code.gs`.
5. Despliegue como `Web app` con:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
   - Use la URL publica con formato `https://script.google.com/macros/s/.../exec`, no la URL `/a/macros/...`.
6. En GitHub configure estos secrets:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_APPS_SCRIPT_URL`
7. Active GitHub Pages con fuente `GitHub Actions`.

## Desarrollo local

```bash
npm install
VITE_GOOGLE_CLIENT_ID="..." VITE_APPS_SCRIPT_URL="..." npm run dev
```

Las carreras estan en `src/data/carreras.json`.
