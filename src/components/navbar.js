export function renderNavbar(container) {
  const el = typeof container === 'string' ? document.querySelector(container) : container;
  el.innerHTML = `
    <nav class="navbar">
      <span class="navbar-logo">DevShelf</span>
      <div class="navbar-links">
        <a href="#/">Inicio</a>
        <a href="#/recursos">Mis recursos</a>
        <a href="#/nuevo">Nuevo recurso</a>
      </div>
    </nav>
  `;
}

export function setActiveLink(hash) {
  const currentHash = (!hash || hash === '#') ? '#/' : hash;
  const links = document.querySelectorAll('.navbar a');
  links.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === currentHash);
  });
}
