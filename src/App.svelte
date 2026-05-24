<script>
  import { onMount } from 'svelte';
  import { BookOpen, FileText, LibraryBig, LogOut, Plus, RefreshCw, Save } from 'lucide-svelte';
  import carreras from './data/carreras.json';
  import { ALLOWED_DOMAIN, GOOGLE_CLIENT_ID } from './config';
  import { createPublication, listPublications } from './lib/api';
  import { fieldsByType, publicationTypes } from './lib/fields';

  let user = null;
  let idToken = '';
  let activeType = 'articulo';
  let values = {};
  let records = [];
  let loading = false;
  let saving = false;
  let error = '';
  let message = '';

  const icons = {
    articulo: FileText,
    libro: BookOpen,
    capitulo: LibraryBig
  };

  $: activeFields = fieldsByType[activeType];
  $: selectedCareer = carreras.find((item) => item.carrera === values.CARRERA);

  onMount(() => {
    resetForm();
    initGoogle();
  });

  function initGoogle() {
    if (!GOOGLE_CLIENT_ID) {
      error = 'Falta configurar VITE_GOOGLE_CLIENT_ID.';
      return;
    }

    const timer = setInterval(() => {
      if (!window.google?.accounts?.id) return;
      clearInterval(timer);
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        hosted_domain: ALLOWED_DOMAIN
      });
      window.google.accounts.id.renderButton(document.getElementById('googleSignIn'), {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 280
      });
    }, 150);
  }

  function decodeJwt(token) {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(window.atob(payload))));
  }

  async function handleCredential(response) {
    error = '';
    message = '';
    const profile = decodeJwt(response.credential);
    if (profile.hd !== ALLOWED_DOMAIN || !profile.email?.endsWith(`@${ALLOWED_DOMAIN}`)) {
      error = `Solo se permite el ingreso con cuentas del dominio ${ALLOWED_DOMAIN}.`;
      return;
    }
    idToken = response.credential;
    user = profile;
    await loadRecords();
  }

  function signOut() {
    user = null;
    idToken = '';
    records = [];
    message = '';
    resetForm();
  }

  async function loadRecords() {
    loading = true;
    error = '';
    try {
      const data = await listPublications(idToken);
      records = data.records;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function resetForm() {
    const nextValues = {};
    for (const field of fieldsByType[activeType]) {
      nextValues[field.name] = field.defaultValue || '';
    }
    values = nextValues;
  }

  function setType(type) {
    activeType = type;
    message = '';
    resetForm();
  }

  function updateValue(field, rawValue) {
    const value = field.uppercase ? rawValue.toUpperCase() : rawValue;
    values = { ...values, [field.name]: value };
    if (field.type === 'career') {
      const career = carreras.find((item) => item.carrera === value);
      values = { ...values, CARRERA: value, FACULTAD: career?.facultad || '' };
    }
  }

  async function submitForm() {
    saving = true;
    error = '';
    message = '';
    try {
      await createPublication(idToken, activeType, values);
      message = 'Registro guardado correctamente.';
      resetForm();
      await loadRecords();
    } catch (err) {
      error = err.message;
    } finally {
      saving = false;
    }
  }
</script>

<main>
  <header class="topbar">
    <div>
      <p class="eyebrow">UNESUM</p>
      <h1>Produccion cientifica docente</h1>
    </div>
    {#if user}
      <div class="userbox">
        <div>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
        <button class="icon-button" type="button" title="Cerrar sesion" on:click={signOut}>
          <LogOut size={18} />
        </button>
      </div>
    {/if}
  </header>

  {#if !user}
    <section class="login">
      <div>
        <h2>Ingreso con Google Workspace</h2>
        <p>Use su cuenta institucional @{ALLOWED_DOMAIN} para registrar y consultar su produccion.</p>
        <div id="googleSignIn"></div>
      </div>
    </section>
  {:else}
    <section class="workspace">
      <aside class="panel sidebar">
        <p class="label">Tipo de publicacion</p>
        <div class="type-list">
          {#each publicationTypes as type}
            <button class:active={activeType === type.id} type="button" on:click={() => setType(type.id)}>
              <svelte:component this={icons[type.id]} size={18} />
              <span>{type.label}</span>
            </button>
          {/each}
        </div>
      </aside>

      <section class="panel form-panel">
        <div class="section-title">
          <div>
            <p class="label">Nuevo registro</p>
            <h2>{publicationTypes.find((type) => type.id === activeType).label}</h2>
          </div>
          <button class="ghost" type="button" on:click={resetForm}>
            <Plus size={17} />
            Limpiar
          </button>
        </div>

        <form on:submit|preventDefault={submitForm}>
          <div class="form-grid">
            {#each activeFields as field}
              <label>
                <span>{field.label}</span>
                {#if field.type === 'readonly'}
                  <input value={values[field.name] || ''} readonly required />
                {:else if field.type === 'career'}
                  <select value={values.CARRERA || ''} required on:change={(event) => updateValue(field, event.currentTarget.value)}>
                    <option value="" disabled>Seleccione una carrera</option>
                    {#each carreras as item}
                      <option value={item.carrera}>{item.carrera}</option>
                    {/each}
                  </select>
                {:else if field.options}
                  <select value={values[field.name] || ''} required on:change={(event) => updateValue(field, event.currentTarget.value)}>
                    <option value="" disabled>Seleccione</option>
                    {#each field.options as option}
                      <option value={option}>{option}</option>
                    {/each}
                  </select>
                {:else}
                  <input
                    type={field.type || 'text'}
                    value={values[field.name] || ''}
                    required
                    on:input={(event) => updateValue(field, event.currentTarget.value)}
                  />
                {/if}
              </label>
            {/each}
          </div>
          {#if selectedCareer}
            <p class="career-note">Facultad asignada: <strong>{selectedCareer.facultad}</strong></p>
          {/if}
          <button class="primary" type="submit" disabled={saving}>
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar publicacion'}
          </button>
        </form>
      </section>

      <section class="panel records-panel">
        <div class="section-title">
          <div>
            <p class="label">Mis registros</p>
            <h2>{records.length} publicaciones</h2>
          </div>
          <button class="icon-button" type="button" title="Actualizar" on:click={loadRecords} disabled={loading}>
            <RefreshCw size={18} />
          </button>
        </div>
        {#if loading}
          <p class="empty">Cargando registros...</p>
        {:else if records.length === 0}
          <p class="empty">Aun no ha registrado publicaciones.</p>
        {:else}
          <div class="records">
            {#each records as record}
              <article>
                <span>{record.type}</span>
                <h3>{record.title}</h3>
                <p>{record.date || 'Sin fecha'} · {record.career || 'Sin carrera'}</p>
              </article>
            {/each}
          </div>
        {/if}
      </section>
    </section>
  {/if}

  {#if error}
    <div class="toast error">{error}</div>
  {/if}
  {#if message}
    <div class="toast success">{message}</div>
  {/if}
</main>
