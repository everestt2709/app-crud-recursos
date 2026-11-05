import { getStats } from '../services/storage.js';

// Renderiza la vista de bienvenida (Home)
export function renderHome(app) {
  const container = typeof app === 'string' ? document.querySelector(app) : app;
  const stats = getStats();

  container.innerHTML = `
    <div class="container home-view">
      <section class="home-hero">
        <h1>Tu biblioteca de recursos para aprender a programar</h1>
        <p>Guarda, organiza y accede a tus enlaces y materiales de estudio en un solo lugar.</p>
        <a href="#/recursos" class="btn btn-primary">Empezar</a>
      </section>

      <section class="cards-grid">
        <div class="card stat-card">
          <h3>${stats.total}</h3>
          <p>Recursos guardados</p>
        </div>
        <div class="card stat-card">
          <h3>${stats.favoritos}</h3>
          <p>Favoritos</p>
        </div>
        <div class="card stat-card">
          <h3>${stats.temas}</h3>
          <p>Temas</p>
        </div>
      </section>

      <section class="cards-grid">
        <div class="card feature-card">
          <h3>Guardar</h3>
          <p>Almacena enlaces a videos, artículos, cursos y herramientas útiles.</p>
        </div>
        <div class="card feature-card">
          <h3>Organizar</h3>
          <p>Clasifica tus recursos por tipo, tecnología y nivel de dificultad.</p>
        </div>
        <div class="card feature-card">
          <h3>Encontrar</h3>
          <p>Accede rápidamente a tus recursos y mantén al día tus favoritos.</p>
        </div>
      </section>
    </div>
  `;
}
