/**
 * REDLINE Main Interactions, Tab Switching & DOM Setup
 */

function switchTab(tabName) {
  if (!tabName) tabName = 'inicio';
  tabName = tabName.replace('#', '').toLowerCase();

  const validTabs = ['inicio', 'loja', 'recursos', 'avaliacoes', 'faq'];
  if (!validTabs.includes(tabName)) {
    tabName = 'inicio';
  }

  // 1. Alterna visualização das abas principais
  const views = document.querySelectorAll('.app-view');
  views.forEach(v => {
    v.classList.remove('active');
  });

  const targetView = document.getElementById('view-' + tabName);
  if (targetView) {
    targetView.classList.add('active');
  }

  // 2. Atualiza destaque ativo nos botões da navbar
  document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
    const isThis = link.getAttribute('data-tab') === tabName;
    link.classList.toggle('tab-active', isThis);
  });

  // 3. Atualiza na gaveta mobile
  document.querySelectorAll('.mobile-nav-link[data-tab]').forEach(link => {
    const isThis = link.getAttribute('data-tab') === tabName;
    link.classList.toggle('tab-active', isThis);
  });

  // 4. Garante que a tela fique no topo da aba sem rolagem residual
  window.scrollTo({ top: 0, behavior: 'instant' });

  // 5. Atualiza URL hash sem recarregar
  if (history.pushState) {
    history.replaceState(null, null, '#' + tabName);
  } else {
    location.hash = '#' + tabName;
  }
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
      card.style.animation = 'viewFadeIn 0.3s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.header-floating');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  // 2. Inicializar Módulos
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

  // 6. Configurar cliques nos links de aba
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = el.getAttribute('data-tab');
      switchTab(tab);
      toggleMobileDrawer(false);
    });
  });

  // 7. Carrega aba inicial da URL hash (ou 'inicio')
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && ['inicio', 'loja', 'recursos', 'avaliacoes', 'faq'].includes(initialHash)) {
    switchTab(initialHash);
  } else {
    switchTab('inicio');
  }

  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (h) switchTab(h);
  });
});

// Helper de compra rápida
function buyInstant(id, title, price, image) {
  if (typeof Cart !== 'undefined') {
    Cart.addItem({ id, title, price, image });
  }
  window.location.href = 'checkout.html';
}
