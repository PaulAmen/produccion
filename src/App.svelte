<script>
  import { onMount } from 'svelte';
  import { BookOpen, FileText, LibraryBig, LogOut, Pencil, Plus, RefreshCw, Save } from 'lucide-svelte';
  import { ALLOWED_DOMAIN, GOOGLE_CLIENT_ID } from './config';
  import { createPublication, listPublications } from './lib/api';
  import { decodeJwt, initGoogleSignIn, isAllowedProfile } from './lib/auth';
  import { applyCareerChange, applyFacultyChange, faculties, findCareer, getCareersByFaculty } from './lib/careers';
  import { fieldsByType, publicationTypes } from './lib/fields';
  import { createInitialValues, createValuesFromRecord, normalizeFieldValue } from './lib/form-state';

  let user = null;
  let idToken = '';
  let activeType = 'articulo';
  let currentRecordId = '';
  let values = {};
  let records = [];
  let loading = false;
  let saving = false;
  let draftSaving = false;
  let error = '';
  let message = '';

  const icons = {
    articulo: FileText,
    libro: BookOpen,
    capitulo: LibraryBig
  };

  $: activeFields = fieldsByType[activeType];
  $: selectedCareer = findCareer(values.CARRERA);
  $: filteredCarreras = getCareersByFaculty(values.FACULTAD);

  onMount(() => {
    resetForm();
    initGoogle();
  });

  function initGoogle() {
    initGoogleSignIn({
      clientId: GOOGLE_CLIENT_ID,
      buttonId: 'googleSignIn',
      callback: handleCredential
    }).catch((err) => {
      error = err.message;
    });
  }

  async function handleCredential(response) {
    error = '';
    message = '';
    const profile = decodeJwt(response.credential);
    if (!isAllowedProfile(profile)) {
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

  function resetForm(type = activeType) {
    values = createInitialValues(type);
    currentRecordId = '';
  }

  function setType(type) {
    activeType = type;
    message = '';
    resetForm(type);
  }

  function editRecord(record) {
    activeType = record.publicationType;
    currentRecordId = record.id;
    values = createValuesFromRecord(record);
    message = 'Registro cargado para edicion.';
    error = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateValue(field, rawValue) {
    const value = normalizeFieldValue(field, rawValue);
    if (field.type === 'faculty') {
      values = applyFacultyChange(values, value);
      return;
    }
    if (field.type === 'career') {
      values = applyCareerChange(values, value);
      return;
    }
    values = { ...values, [field.name]: value };
  }

  async function submitForm(status = 'COMPLETO') {
    if (status === 'INCOMPLETO') draftSaving = true;
    else saving = true;
    error = '';
    message = '';
    try {
      const data = await createPublication(idToken, activeType, { ...values, ID: currentRecordId }, status);
      currentRecordId = data.id || currentRecordId;
      message = status === 'INCOMPLETO'
        ? 'Formulario incompleto guardado como borrador.'
        : 'Registro completo guardado correctamente.';
      if (status === 'COMPLETO') resetForm();
      await loadRecords();
    } catch (err) {
      error = err.message;
    } finally {
      draftSaving = false;
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

        <form on:submit|preventDefault={() => submitForm('COMPLETO')}>
          <div class="form-grid">
            {#each activeFields as field, index}
              {#if field.section && field.section !== activeFields[index - 1]?.section}
                <div class="field-section">
                  <h3>{field.section}</h3>
                </div>
              {/if}
              <label>
                <span>{field.label}</span>
                {#if field.type === 'readonly'}
                  <input value={values[field.name] || ''} readonly />
                {:else if field.type === 'faculty'}
                  <select value={values.FACULTAD || ''} on:change={(event) => updateValue(field, event.currentTarget.value)}>
                    <option value="" disabled>Seleccione una facultad</option>
                    {#each faculties as facultad}
                      <option value={facultad}>{facultad}</option>
                    {/each}
                  </select>
                {:else if field.type === 'career'}
                  <select value={values.CARRERA || ''} on:change={(event) => updateValue(field, event.currentTarget.value)}>
                    <option value="" disabled>Seleccione una carrera</option>
                    {#each filteredCarreras as item}
                      <option value={item.carrera}>{item.carrera}</option>
                    {/each}
                  </select>
                {:else if field.options}
                  <select value={values[field.name] || ''} on:change={(event) => updateValue(field, event.currentTarget.value)}>
                    <option value="" disabled>Seleccione</option>
                    {#each field.options as option}
                      <option value={option}>{option}</option>
                    {/each}
                  </select>
                {:else}
                  <input
                    type={field.type || 'text'}
                    min={field.min}
                    value={values[field.name] || ''}
                    on:input={(event) => updateValue(field, event.currentTarget.value)}
                  />
                {/if}
                {#if field.hint}
                  <small>{field.hint}</small>
                {/if}
              </label>
            {/each}
          </div>
          {#if selectedCareer}
            <p class="career-note">Facultad asignada: <strong>{selectedCareer.facultad}</strong></p>
          {/if}
          <div class="actions">
            <button class="ghost" type="button" disabled={draftSaving || saving} on:click={() => submitForm('INCOMPLETO')}>
              <Save size={18} />
              {draftSaving ? 'Guardando...' : 'Guardar borrador'}
            </button>
            <button class="primary" type="submit" disabled={saving || draftSaving}>
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar completo'}
            </button>
          </div>
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
                <div class="record-head">
                  <span>{record.type} · {record.status}</span>
                  <button class="icon-button small" type="button" title="Editar registro" on:click={() => editRecord(record)}>
                    <Pencil size={16} />
                  </button>
                </div>
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
