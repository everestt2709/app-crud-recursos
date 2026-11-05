import { TIPOS, TEMAS, NIVELES } from '../data/options.js';
import { create } from '../services/storage.js';
import { showToast } from '../components/toast.js';

// Renderiza el formulario de creación (y preparado para edición futura) de recursos
export function renderForm(app, resource = null) {
  const container = typeof app === 'string' ? document.querySelector(app) : app;

  container.innerHTML = `
    <div class="container form-view">
      <h1>Nuevo recurso</h1>
      <div class="card">
        <form id="resource-form" novalidate>
          <div class="form-group">
            <label for="titulo">Título</label>
            <input type="text" id="titulo" name="titulo" class="input" placeholder="Ej. Documentación oficial de MDN">
            <span class="form-error" id="error-titulo"></span>
          </div>

          <div class="form-group">
            <label for="url">URL</label>
            <input type="url" id="url" name="url" class="input" placeholder="https://ejemplo.com">
            <span class="form-error" id="error-url"></span>
          </div>

          <div class="form-group">
            <label for="tipo">Tipo</label>
            <select id="tipo" name="tipo" class="select">
              <option value="">Selecciona...</option>
              ${TIPOS.map((tipo) => `<option value="${tipo.value}">${tipo.label}</option>`).join('')}
            </select>
            <span class="form-error" id="error-tipo"></span>
          </div>

          <div class="form-group">
            <label for="tema">Tema</label>
            <select id="tema" name="tema" class="select">
              <option value="">Selecciona...</option>
              ${TEMAS.map((tema) => `<option value="${tema.value}">${tema.label}</option>`).join('')}
            </select>
            <span class="form-error" id="error-tema"></span>
          </div>

          <div class="form-group">
            <label>Nivel</label>
            <div class="form-radios">
              ${NIVELES.map(
                (nivel) => `
                <label class="radio-label">
                  <input type="radio" name="nivel" value="${nivel.value}" ${nivel.value === 'basico' ? 'checked' : ''}>
                  ${nivel.label}
                </label>
              `
              ).join('')}
            </div>
            <span class="form-error" id="error-nivel"></span>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="favorito" name="favorito">
              Favorito
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Guardar</button>
            <a href="#/" class="btn btn-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = container.querySelector('#resource-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos
    form.querySelectorAll('.is-error').forEach((el) => {
      el.classList.remove('is-error');
      el.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.form-error').forEach((el) => {
      el.textContent = '';
    });

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.favorito = Boolean(data.favorito);

    const errors = {};

    // Validar título (obligatorio, mínimo 3 caracteres)
    const trimmedTitle = data.titulo ? data.titulo.trim() : '';
    if (!trimmedTitle || trimmedTitle.length < 3) {
      errors.titulo = 'El título es obligatorio y debe tener al menos 3 caracteres.';
    } else {
      data.titulo = trimmedTitle;
    }

    // Validar URL (válida con new URL en try/catch)
    const rawUrl = data.url ? data.url.trim() : '';
    let isValidUrl = false;
    if (rawUrl) {
      try {
        new URL(rawUrl);
        isValidUrl = true;
      } catch {
        isValidUrl = false;
      }
    }
    if (!isValidUrl) {
      errors.url = 'Ingresa una URL válida (ej. https://ejemplo.com).';
    } else {
      data.url = rawUrl;
    }

    // Validar tipo (obligatorio)
    if (!data.tipo) {
      errors.tipo = 'El tipo es obligatorio.';
    }

    // Validar tema (obligatorio)
    if (!data.tema) {
      errors.tema = 'El tema es obligatorio.';
    }

    // Mostrar errores si existen
    if (Object.keys(errors).length > 0) {
      for (const [field, message] of Object.entries(errors)) {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add('is-error');
          input.setAttribute('aria-invalid', 'true');
        }
        const errorEl = form.querySelector(`#error-${field}`);
        if (errorEl) {
          errorEl.textContent = message;
        }
      }
      return;
    }

    // Crear recurso, notificar, limpiar y redirigir
    create(data);
    showToast('Recurso guardado');
    form.reset();
    window.location.hash = '#/recursos';
  });
}
