<script>
  import { onMount } from 'svelte';
  import { BookOpen, FileText, LibraryBig, LogOut, Pencil, Plus, RefreshCw, Save, Sun, Moon, CheckCircle2, AlertCircle } from 'lucide-svelte';
  import { ALLOWED_DOMAIN, GOOGLE_CLIENT_ID } from './config';
  import { createPublication, listPublications } from './lib/api';
  import { decodeJwt, initGoogleSignIn, isAllowedProfile } from './lib/auth';
  import { applyCareerChange, applyFacultyChange, faculties, findCareer, getCareersByFaculty } from './lib/careers';
  import { fieldsByType, publicationTypes } from './lib/fields';
  import { createInitialValues, createValuesFromRecord, normalizeFieldValue } from './lib/form-state';
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Select } from '$lib/components/ui/select';

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
  let isDark = false;
  let searchQuery = '';
  let statusFilter = 'ALL';

  const icons = {
    articulo: FileText,
    libro: BookOpen,
    capitulo: LibraryBig
  };

  $: activeFields = fieldsByType[activeType];
  $: selectedCareer = findCareer(values.CARRERA);
  $: filteredCarreras = getCareersByFaculty(values.FACULTAD);

  // Dynamic progress calculation for form completion
  $: requiredFields = activeFields.filter(f => {
    if (f.type === 'readonly') return false;

    if (f.name === 'TITULO_PROYECTO_INVESTIGACION' || f.name === 'ESTADO_PROYECTO_INVESTIGACION') {
      return values['RESULTADO DE PROYECTO DE INVESTIGACION'] === 'SI';
    }

    if (f.name === 'TITULO_PROYECTO_VINCULACION' || f.name === 'ESTADO_PROYECTO_VINCULACION') {
      return values['RESULTADO DE PROYECTO DE VINCULACION'] === 'SI';
    }

    return true;
  });

  $: filledFieldsCount = requiredFields.filter(f => {
    const val = values[f.name];
    return val !== undefined && val !== null && String(val).trim() !== '';
  }).length;

  $: completenessPercentage = requiredFields.length > 0
    ? Math.round((filledFieldsCount / requiredFields.length) * 100)
    : 0;

  // Dynamic search and filter logic
  $: filteredRecords = records.filter(record => {
    if (statusFilter !== 'ALL') {
      const isComplete = record.status === 'COMPLETO';
      if (statusFilter === 'COMPLETO' && !isComplete) return false;
      if (statusFilter === 'INCOMPLETO' && isComplete) return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        (record.title || '').toLowerCase().includes(query) ||
        (record.type || '').toLowerCase().includes(query) ||
        (record.career || '').toLowerCase().includes(query) ||
        (record.status || '').toLowerCase().includes(query) ||
        (record.date || '').toLowerCase().includes(query)
      );
    }
    return true;
  });

  onMount(() => {
    resetForm();
    initGoogle();
    
    // Theme sync
    isDark = document.documentElement.classList.contains('dark');
  });

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

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
    message = 'Registro cargado para edición.';
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

  function handleFormSubmit(event) {
    event.preventDefault();
    submitForm('COMPLETO');
  }
</script>

<main>
  <header class="topbar">
    <div class="flex items-center gap-3">
      <div class="bg-[var(--primary-color)] text-white p-2.5 rounded-xl flex items-center justify-center shadow-md">
        <LibraryBig size={24} />
      </div>
      <div>
        <p class="eyebrow">UNESUM</p>
        <h1>Producción Científica Docente</h1>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <Button variant="outline" size="icon" title="Cambiar tema" class="theme-toggle-btn" onclick={toggleTheme}>
        {#if isDark}
          <Sun size={18} class="text-amber-500" />
        {:else}
          <Moon size={18} class="text-emerald-800" />
        {/if}
      </Button>

      {#if user}
        <div class="userbox">
          <div>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <Button variant="outline" size="icon" title="Cerrar sesión" onclick={signOut}>
            <LogOut size={18} class="text-red-500" />
          </Button>
        </div>
      {/if}
    </div>
  </header>

  {#if !user}
    <section class="login">
      <div class="login-card">
        <div class="inline-flex items-center justify-center bg-[var(--primary-color)] text-white p-4.5 rounded-2xl shadow-lg mb-6">
          <LibraryBig size={36} />
        </div>
        <h2>Ingreso con Google</h2>
        <p>Use su cuenta de correo institucional <strong>@{ALLOWED_DOMAIN}</strong> para registrar, consultar y editar su producción científica.</p>
        
        <div class="my-5 border-t border-dashed border-[rgba(255,255,255,0.15)] py-1"></div>
        
        <div id="googleSignIn"></div>
      </div>
    </section>
  {:else}
    <section class="workspace">
      <Card class="sidebar">
        <p class="label">Tipo de publicación</p>
        <div class="type-list">
          {#each publicationTypes as type}
            <button class:active={activeType === type.id} type="button" onclick={() => setType(type.id)}>
              <svelte:component this={icons[type.id]} size={18} />
              <span>{type.label}</span>
            </button>
          {/each}
        </div>
      </Card>

      <Card class="form-panel">
        <div class="section-title">
          <div>
            <p class="label">Nuevo registro</p>
            <h2>{publicationTypes.find((type) => type.id === activeType).label}</h2>
          </div>
          <Button variant="outline" onclick={() => resetForm()}>
            <Plus size={17} />
            Limpiar
          </Button>
        </div>

        <!-- Form Completion Progress Bar -->
        <div class="mb-5">
          <div class="progress-header">
            <span>Completitud del formulario</span>
            <span class="progress-val">{completenessPercentage}%</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar" style="width: {completenessPercentage}%"></div>
          </div>
        </div>

        <form onsubmit={handleFormSubmit}>
          <div class="form-grid">
            {#each activeFields as field, index}
              {#if field.section && field.section !== activeFields[index - 1]?.section}
                <div class="field-section">
                  <h3>{field.section}</h3>
                </div>
              {/if}
              <Label>
                <span>{field.label}</span>
                {#if field.type === 'readonly'}
                  <Input value={values[field.name] || ''} readonly />
                {:else if field.type === 'faculty'}
                  <Select value={values.FACULTAD || ''} onchange={(event) => updateValue(field, event.currentTarget.value)}>
                    <option value="" disabled>Seleccione una facultad</option>
                    {#each faculties as facultad}
                      <option value={facultad}>{facultad}</option>
                    {/each}
                  </Select>
                {:else if field.type === 'career'}
                  <Select value={values.CARRERA || ''} onchange={(event) => updateValue(field, event.currentTarget.value)}>
                    <option value="" disabled>Seleccione una carrera</option>
                    {#each filteredCarreras as item}
                      <option value={item.carrera}>{item.carrera}</option>
                    {/each}
                  </Select>
                {:else if field.options}
                  <Select value={values[field.name] || ''} onchange={(event) => updateValue(field, event.currentTarget.value)}>
                    <option value="" disabled>Seleccione</option>
                    {#each field.options as option}
                      <option value={option}>{option}</option>
                    {/each}
                  </Select>
                {:else}
                  <Input
                    type={field.type || 'text'}
                    min={field.min}
                    value={values[field.name] || ''}
                    oninput={(event) => updateValue(field, event.currentTarget.value)}
                  />
                {/if}
                {#if field.hint}
                  <small>{field.hint}</small>
                {/if}
              </Label>
            {/each}
          </div>
          {#if selectedCareer}
            <p class="career-note">Facultad asignada: <strong>{selectedCareer.facultad}</strong></p>
          {/if}
          <div class="actions">
            <Button variant="outline" disabled={draftSaving || saving} onclick={() => submitForm('INCOMPLETO')}>
              <Save size={18} />
              {draftSaving ? 'Guardando...' : 'Guardar borrador'}
            </Button>
            <Button type="submit" disabled={saving || draftSaving}>
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar completo'}
            </Button>
          </div>
        </form>
      </Card>

      <Card class="records-panel">
        <div class="section-title">
          <div>
            <p class="label">Mis registros</p>
            <h2>{filteredRecords.length} publicaciones</h2>
          </div>
          <Button variant="outline" size="icon" title="Actualizar" onclick={loadRecords} disabled={loading}>
            <RefreshCw size={18} class={loading ? 'animate-spin' : ''} />
          </Button>
        </div>

        <!-- Search and Filter controls -->
        <div class="records-filter-wrapper">
          <div class="search-input-wrapper">
            <Input
              type="text"
              placeholder="Buscar por título, revista, carrera..."
              value={searchQuery}
              oninput={(event) => searchQuery = event.currentTarget.value}
            />
            <svg class="search-icon-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <div class="filter-tabs">
            <button class:active={statusFilter === 'ALL'} onclick={() => statusFilter = 'ALL'}>Todas</button>
            <button class:active={statusFilter === 'COMPLETO'} onclick={() => statusFilter = 'COMPLETO'}>Completas</button>
            <button class:active={statusFilter === 'INCOMPLETO'} onclick={() => statusFilter = 'INCOMPLETO'}>Borradores</button>
          </div>
        </div>

        {#if loading}
          <div class="empty">
            <RefreshCw size={24} class="animate-spin text-[var(--primary-color)]" />
            <p>Cargando registros...</p>
          </div>
        {:else if filteredRecords.length === 0}
          <div class="empty">
            <p>Aún no ha registrado publicaciones con este criterio.</p>
          </div>
        {:else}
          <div class="records">
            {#each filteredRecords as record}
              <article>
                <div class="record-head">
                  <span class="badge {record.status === 'COMPLETO' ? 'badge-completo' : 'badge-borrador'}">
                    {record.status === 'COMPLETO' ? 'Completo' : 'Borrador'}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">{record.type}</span>
                    <Button variant="outline" size="smIcon" title="Editar registro" onclick={() => editRecord(record)}>
                      <Pencil size={14} />
                    </Button>
                  </div>
                </div>
                <h3>{record.title}</h3>
                <p>{record.date || 'Sin fecha'} · {record.career || 'Sin carrera'}</p>
              </article>
            {/each}
          </div>
        {/if}
      </Card>
    </section>
  {/if}

  {#if error}
    <div class="toast error">
      <AlertCircle size={18} />
      <span>{error}</span>
    </div>
  {/if}
  {#if message}
    <div class="toast success">
      <CheckCircle2 size={18} />
      <span>{message}</span>
    </div>
  {/if}
</main>
