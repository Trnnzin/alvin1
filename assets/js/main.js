/**
 * REDLINE Performance - SPA Tab-View Engine (Sem Scroll / Navegação Instantânea)
 * 144 FPS Engine - Zero Lag, Visualização Isolada de Abas, Carrinho & Prova Social
 */

// Navegação instantânea em abas estilo software SPA (Sem Scroll entre seções)
function switchTab(tabName) {
  if (!tabName) tabName = 'inicio';
  tabName = tabName.replace('#', '').toLowerCase();

  const validTabs = ['inicio', 'loja', 'recursos', 'avaliacoes', 'faq'];
  if (!validTabs.includes(tabName)) {
    tabName = 'inicio';
  }

  // 1. Oculta todas as abas e ativa apenas a selecionada
  const views = document.querySelectorAll('.app-view');
  views.forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById('view-' + tabName);
  if (targetView) {
    targetView.classList.add('active');
  } else {
    const fallback = document.getElementById('view-inicio');
    if (fallback) fallback.classList.add('active');
  }

  // 2. Reseta o scroll para o topo absoluto da página instantaneamente
  window.scrollTo({ top: 0, behavior: 'instant' });

  // 3. Atualiza os links destacados no header e gaveta mobile
  updateActiveTab(tabName);

  // 4. Atualiza a URL sem causar recarregamento ou saltos
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, null, '#' + tabName);
  }
}

// Mantém retrocompatibilidade caso algo chame scrollToSection
function scrollToSection(tabName) {
  switchTab(tabName);
}

function updateActiveTab(tabName) {
  if (!tabName) return;
  document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
    const isMatch = link.getAttribute('data-tab') === tabName;
    link.classList.toggle('tab-active', isMatch);
  });
  document.querySelectorAll('.mobile-nav-link[data-tab]').forEach(link => {
    const isMatch = link.getAttribute('data-tab') === tabName;
    link.classList.toggle('tab-active', isMatch);
  });
}

// Filtro de produtos da aba Loja
function filterProducts(category, btnElement) {
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || 'todos';
    if (category === 'todos' || cardCat.includes(category)) {
      card.style.display = 'flex';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect com requestAnimationFrame e listener passivo
  const header = document.querySelector('.header-floating');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (header) {
          header.classList.toggle('scrolled', window.scrollY > 20);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 2. Inicializar Módulos de Loja e Auth
  if (typeof Cart !== 'undefined') Cart.updateUI();
  if (typeof initSearch === 'function') initSearch();
  if (typeof initAuth === 'function') initAuth();

  // 3. Mobile Drawer
  const openDrawerBtn = document.getElementById('btn-open-drawer');
  const closeDrawerBtn = document.getElementById('btn-close-drawer');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  function toggleMobileDrawer(open) {
    if (!mobileDrawer || !drawerBackdrop) return;
    if (open) {
      mobileDrawer.classList.add('active');
      drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('active');
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  window.toggleMobileDrawer = toggleMobileDrawer;

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', () => toggleMobileDrawer(true));
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => toggleMobileDrawer(false));
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => toggleMobileDrawer(false));

  // 4. Cart Drawer events
  const cartBackdrop = document.getElementById('cart-backdrop');
  if (cartBackdrop && typeof Cart !== 'undefined') {
    cartBackdrop.addEventListener('click', () => Cart.closeDrawer());
  }

  // Fechar gavetas no ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof Cart !== 'undefined') Cart.closeDrawer();
      toggleMobileDrawer(false);
    }
  });

  // 5. FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // 6. Configurar cliques nos links da navbar, gaveta mobile e rodapé
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      const tab = el.getAttribute('data-tab');
      if (tab) {
        e.preventDefault();
        switchTab(tab);
        toggleMobileDrawer(false);
      }
    });
  });

  // 7. Navegação por abas inicial (caso acesse com #loja, #recursos, etc.)
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && ['inicio', 'loja', 'recursos', 'avaliacoes', 'faq'].includes(initialHash)) {
    switchTab(initialHash);
  } else {
    switchTab('inicio');
  }

  // 8. Suporte aos botões voltar/avançar do navegador
  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && ['inicio', 'loja', 'recursos', 'avaliacoes', 'faq'].includes(currentHash)) {
      switchTab(currentHash);
    }
  });

  // 9. Inicializa Popups de Prova Social (Compras Recentes)
  initRecentSales();
});

// Helper para copiar código de cupom com Toastify
function copyCouponCode(code) {
  if (!code) code = 'REDLINE10';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      if (typeof Cart !== 'undefined' && Cart.showToast) {
        Cart.showToast(`Cupom ${code} copiado! 🚀 Cole no checkout para 10% OFF`);
      } else {
        alert(`Cupom ${code} copiado com sucesso!`);
      }
    });
  } else {
    if (typeof Cart !== 'undefined' && Cart.showToast) {
      Cart.showToast(`Use o cupom ${code} no checkout para 10% OFF!`);
    }
  }
}

// Sistema de Notificações de Vendas Recentes (Prova Social)
function initRecentSales() {
  const container = document.getElementById('recent-sales-container');
  if (!container) return;

  const purchases = [
    { name: 'Gabriel M.', city: 'São Paulo, SP', product: 'Booster Definitivo FiveM &amp; GTA V', time: 'há 3 minutos' },
    { name: 'Lucas R.', city: 'Rio de Janeiro, RJ', product: 'REDLINE Plano Premium (IA)', time: 'há 6 minutos' },
    { name: 'Felipe S.', city: 'Curitiba, PR', product: 'Preset Competitivo CS2 &amp; Valorant', time: 'há 9 minutos' },
    { name: 'Matheus K.', city: 'Belo Horizonte, MG', product: 'Pacote de Tweaks RAW do Windows', time: 'há 14 minutos' },
    { name: 'Thiago B.', city: 'Porto Alegre, RS', product: 'REDLINE Plano Premium (IA)', time: 'há 18 minutos' },
    { name: 'Arthur L.', city: 'Brasília, DF', product: 'Booster Definitivo FiveM &amp; GTA V', time: 'há 22 minutos' }
  ];

  let index = 0;

  function showNextSale() {
    const item = purchases[index % purchases.length];
    index++;

    const card = document.createElement('div');
    card.className = 'recent-sale-card';
    card.innerHTML = `
      <div class="recent-sale-icon">⚡</div>
      <div class="recent-sale-text">
        <div><strong>${item.name}</strong> • ${item.city}</div>
        <div>Comprou <span class="sale-product">${item.product}</span></div>
        <div class="recent-sale-time">
          <span style="color: #10b981;">●</span> ${item.time} via Pix
        </div>
      </div>
      <button class="recent-sale-close" onclick="this.parentElement.remove()" aria-label="Fechar">✕</button>
    `;

    container.innerHTML = '';
    container.appendChild(card);

    requestAnimationFrame(() => {
      card.classList.add('show');
    });

    setTimeout(() => {
      card.classList.remove('show');
      setTimeout(() => card.remove(), 400);
    }, 6500);
  }

  // Primeiro popup após 5s, depois a cada 24s
  setTimeout(showNextSale, 5000);
  setInterval(showNextSale, 24000);
}

// Helper de compra rápida
function buyInstant(id, title, price, image) {
  if (typeof Cart !== 'undefined') {
    Cart.addItem({ id, title, price, image });
  }
  window.location.href = 'checkout.html';
}
