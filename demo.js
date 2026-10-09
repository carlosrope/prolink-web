// ProLink365 — motor de las demos simuladas tipo WhatsApp.
// Cada demo define nodos: mensajes del asistente, entradas del panel "lo que pasa detrás",
// indicadores y botones de respuesta. Todo el contenido es fijo (sin datos del visitante).
window.ProDemo = (function () {
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const hora = () => new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  function iniciar(cfg) {
    const chat = document.getElementById(cfg.chat || 'chat');
    const quick = document.getElementById(cfg.quick || 'quick');
    const log = document.getElementById(cfg.log || 'log');
    let ocupado = false;

    function burbuja(tipo, html, extra) {
      const m = document.createElement('div');
      m.className = 'msg ' + tipo + (extra ? ' ' + extra : '');
      m.innerHTML = html + '<span class="meta">' + hora() + (tipo === 'out' ? ' ✓✓' : '') + '</span>';
      chat.appendChild(m);
      chat.scrollTop = chat.scrollHeight;
      return m;
    }

    function registrar(entrada) {
      if (!log) return;
      const vacio = log.querySelector('.vacio');
      if (vacio) vacio.remove();
      const li = document.createElement('li');
      if (entrada.warn) li.className = 'warn';
      li.innerHTML = entrada.text;
      log.appendChild(li);
    }

    function kpis(valores) {
      Object.entries(valores || {}).forEach(([id, v]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = v;
      });
    }

    async function nodo(id) {
      const n = cfg.nodos[id];
      if (!n) return;
      ocupado = true;
      quick.innerHTML = '';
      if (n.run) n.run(api);
      for (const b of (n.bot || [])) {
        const escribiendo = burbuja('in', 'escribiendo…', 'typing');
        await espera(b.espera || 900);
        escribiendo.remove();
        const contenido = typeof b.html === 'function' ? b.html(api) : (b.html || b.text);
        burbuja('in', contenido, b.tarjeta ? 'card-msg' : '');
        if (b.log) b.log.forEach(registrar);
        if (b.kpi) kpis(b.kpi);
        if (b.despues) b.despues(api);
        await espera(250);
      }
      (n.log || []).forEach(registrar);
      kpis(n.kpi);
      opciones(n.opciones || [], n.fin);
      ocupado = false;
    }

    function opciones(lista, fin) {
      quick.innerHTML = '';
      lista.forEach(o => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = o.label;
        b.addEventListener('click', () => {
          if (ocupado) return;
          quick.querySelectorAll('button').forEach(x => x.disabled = true);
          burbuja('out', o.user || o.label);
          if (o.accion) o.accion(api);
          setTimeout(() => nodo(o.next), 350);
        });
        quick.appendChild(b);
      });
      if (fin || !lista.length) {
        const r = document.createElement('button');
        r.type = 'button';
        r.textContent = '↺ Reiniciar demo';
        r.addEventListener('click', reiniciar);
        quick.appendChild(r);
      }
    }

    function reiniciar() {
      chat.innerHTML = '';
      if (log) log.innerHTML = '<li class="vacio">Aquí verás lo que hace el sistema en cada paso.</li>';
      kpis(cfg.kpiInicial);
      if (cfg.alReiniciar) cfg.alReiniciar(api);
      nodo(cfg.inicio || 'inicio');
    }

    const api = { burbuja, registrar, kpis, nodo, reiniciar };
    reiniciar();
    return api;
  }

  const pesos = n => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return { iniciar, pesos };
})();
