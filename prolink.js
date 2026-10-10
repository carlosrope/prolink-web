// ProLink365 — comportamiento compartido: menú móvil, aparición al hacer scroll y año del pie.
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Partículas verdes del fondo (marca ProLink); se omiten si el usuario pide menos movimiento.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const box = document.createElement('div');
    box.setAttribute('aria-hidden', 'true');
    // Van solo dentro del hero (si la página tiene uno), no en toda la página.
    const hero = document.querySelector('.hero');
    box.style.cssText = hero ? 'position:absolute;inset:0;pointer-events:none;z-index:-1;overflow:hidden;' : 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
    for (let p = 0; p < (hero ? 26 : 40); p++) {
      const d = document.createElement('div');
      const size = Math.random() * 3 + 1;
      d.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:#00e87a;border-radius:50%;left:${Math.random() * 100}%;top:${Math.random() * 100}%;opacity:${(Math.random() * 0.3 + 0.45).toFixed(2)};animation:floatDot ${Math.random() * 6 + 4}s ${Math.random() * 6}s infinite ease-in-out alternate;`;
      box.appendChild(d);
    }
    (hero || document.body).appendChild(box);
    document.head.insertAdjacentHTML('beforeend', '<style>@keyframes floatDot{from{transform:translate(0,0)}to{transform:translate(8px,-18px)}}</style>');
  }
})();
