import { TIPOS, TEMAS, NIVELES } from '../data/options.js';
import { getAll } from '../services/storage.js';

// Obtiene la etiqueta correspondiente a un valor en una lista de opciones
function getLabel(lista, value) {
  const item = lista.find((opt) => opt.value === value);
  return item ? item.label : value;
}

// Renderiza una tarjeta de recurso individual
function renderResourceCard(recurso) {
  let hostname = '';
  try {
    hostname = new URL(recurso.url).hostname;
  } catch {
    hostname = recurso.url;
  }

  const tipoLabel = getLabel(TIPOS, recurso.tipo);
  const temaLabel = getLabel(TEMAS, recurso.tema);
  const nivelLabel = getLabel(NIVELES, recurso.nivel);
  const fecha = recurso.fechaCreacion
    ? new Date(recurso.fechaCreacion).toLocaleDateString('es-SV')
    : '';

  return `
    <article class="card resource-card">
      <div class="resource-card__header">
        <span class="badge badge--${recurso.tipo}">${tipoLabel}</span>
        ${recurso.favorito ? '<span class="resource-card__favorite" title="Favorito">★</span>' : ''}
      </div>

      <h2 class="resource-card__title">
        <a href="${recurso.url}" target="_blank" rel="noopener">${recurso.titulo}</a>
      </h2>

      <code class="resource-card__domain">${hostname}</code>

      <div class="resource-card__meta">
        <span>${temaLabel}</span>
        <span>•</span>
        <span>${nivelLabel}</span>
      </div>

      <div class="resource-card__footer">
        <time class="resource-card__date">${fecha}</time>
        <a href="#/editar/${recurso.id}" class="btn btn-secondary">Editar</a>
      </div>
    </article>
  `;
}

// Renderiza la vista de listado de recursos
export function renderList(app) {
  const container = typeof app === 'string' ? document.querySelector(app) : app;
  const recursos = getAll();
  const sortedResources = [...recursos].sort(
    (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
  );

  container.innerHTML = `
    <div class="container list-view">
      <header class="list-header">
        <h1>Mis recursos</h1>
        <a href="#/nuevo" class="btn btn-primary">+ Nuevo recurso</a>
      </header>

      ${
        sortedResources.length === 0
          ? `
            <div class="empty-state">
              <p>Aún no tienes recursos</p>
              <a href="#/nuevo" class="btn btn-primary">Agregar el primero</a>
            </div>
          `
          : `
            <div class="resource-grid">
              ${sortedResources.map(renderResourceCard).join('')}
            </div>
          `
      }
    </div>
  `;
}
