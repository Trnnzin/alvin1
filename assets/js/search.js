/**
 * REDLINE Instant Live Search
 */
const PRODUCTS_CATALOG = [
  {
    id: 'plano-premium',
    title: 'REDLINE Plano Premium (IA + Otimizador)',
    price: 30.00,
    category: 'planos',
    image: 'assets/images/prod_premium.jpg',
    desc: 'Acesso total ao Painel Desktop, REDLINE Intelligence (IA Gamer), Timer 0.5ms e Tweaks de Latência.'
  },
  {
    id: 'plano-basico',
    title: 'REDLINE Plano Básico (Sem IA)',
    price: 20.00,
    category: 'planos',
    image: 'assets/images/prod_basico.jpg',
    desc: 'Otimização clássica de FPS, limpeza de processos, ajustes de Registro e estabilização de frametime.'
  },
  {
    id: 'tweak-fivem',
    title: 'Pacote Especial FiveM & GTA RP',
    price: 25.00,
    category: 'especiais',
    image: 'assets/images/prod_fivem.jpg',
    desc: 'Eliminação de gargalos na Standby RAM, renderização prioritária e redução de stuttering em cidades cheias.'
  },
  {
    id: 'tweak-competitivo',
    title: 'Preset Competitivo Valorant / CS2',
    price: 25.00,
    category: 'especiais',
    image: 'assets/images/cat_competitivo.jpg',
    desc: 'Sincronização de clock, desativação de Nagle/TCP e prioridade CPU Win32 Quantum para hitreg perfeito.'
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
