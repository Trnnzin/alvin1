/**
 * REDLINE Instant Live Search
 */
const PRODUCTS_CATALOG = [
  {
    id: 1,
    title: 'REDLINE Plano Premium (IA + Otimizador)',
    price: 30.00,
    category: 'planos',
    image: 'assets/images/cat_planos.jpg?v=2026_pro2',
    desc: 'Acesso total ao Painel Desktop, REDLINE Intelligence (IA Gamer), Timer 0.5ms e Tweaks de Latência.'
  },
  {
    id: 2,
    title: 'REDLINE Plano Básico (Sem IA)',
    price: 20.00,
    category: 'planos',
    image: 'assets/images/cat_basico.jpg?v=2026_pro2',
    desc: 'Otimização clássica de FPS, limpeza de processos, ajustes de Registro e estabilização de frametime.'
  },
  {
    id: 3,
    title: 'Booster Definitivo FiveM & GTA V',
    price: 25.00,
    category: 'fivem',
    image: 'assets/images/cat_fivem.jpg?v=2026_pro2',
    desc: 'Eliminação de gargalos na Standby RAM, renderização prioritária e redução de stuttering em cidades cheias.'
  },
  {
    id: 4,
    title: 'Preset Competitivo CS2 & Valorant',
    price: 25.00,
    category: 'competitivo',
    image: 'assets/images/cat_competitivo.jpg?v=2026_pro2',
    desc: 'Sincronização de clock, desativação de Nagle/TCP e prioridade CPU Win32 Quantum para hitreg perfeito.'
  },
  {
    id: 5,
    title: 'Pacote de Tweaks RAW do Windows',
    price: 15.00,
    category: 'tweaks',
    image: 'assets/images/cat_tweaks.jpg?v=2026_pro2',
    desc: 'Desativação de telemetria, Modo Ultimate Performance, limpeza de processos e otimização de RAM.'
  }
];

function initSearch() {
  const input = document.getElementById('search-input');
  const portal = document.getElementById('search-portal');
  if (!input || !portal) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      portal.classList.remove('active');
      portal.innerHTML = '';
      return;
    }

    const filtered = PRODUCTS_CATALOG.filter(p => 
      p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      portal.innerHTML = '<div style="padding: 1rem; color: #94a3b8; font-size: 0.85rem; text-align: center;">Nenhum produto encontrado.</div>';
    } else {
      portal.innerHTML = filtered.map(p => `
        <a href="#store" onclick="Cart.addItem({id:'${p.id}', title:'${p.title}', price:${p.price}, image:'${p.image}'}); document.getElementById('search-portal').classList.remove('active');" class="search-item">
          <img src="${p.image}" class="search-item-img" alt="${p.title}">
          <div class="search-item-info">
            <h5>${p.title}</h5>
            <span>R$ ${p.price.toFixed(2).replace('.', ',')}</span>
          </div>
        </a>
      `).join('');
    }
    portal.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !portal.contains(e.target)) {
      portal.classList.remove('active');
    }
  });
}
