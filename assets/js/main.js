/**
 * REDLINE Performance - Fluid One-Page Interactions & Smooth Scroll
 * 144 FPS Engine - Zero Lag, Passive Event Listeners & IntersectionObserver ScrollSpy
 */

// Navegação fluida para qualquer seção da página
function scrollToSection(sectionId) {
  if (!sectionId) sectionId = 'inicio';
  sectionId = sectionId.replace('#', '').toLowerCase();

  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });

    // Atualiza destaque ativo nas abas
    updateActiveTab(sectionId);

    // Atualiza hash sem causar pulo brusco
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, '#' + sectionId);
    }
  }
}

// Compatibilidade com botões que chamam switchTab('loja')
function switchTab(tabName) {
  scrollToSection(tabName);
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
          header.classList.toggle('scrolled', window.scrollY > 25);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 2. Scroll Spy: ativa a aba correta conforme o usuário rola a página
  const sections = document.querySelectorAll('.app-section');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateActiveTab(entry.target.id);
        }
      });
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(sec => spyObserver.observe(sec));
  }

  // 3. Inicializar Módulos de Loja e Auth
  if (typeof Cart !== 'undefined') Cart.updateUI();
  if (typeof initSearch === 'function') initSearch();
  if (typeof initAuth === 'function') initAuth();

  // 4. Mobile Drawer
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

  // 5. Cart Drawer events
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

  // 6. FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // 7. Configurar cliques nos links da navbar e gaveta
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      const tab = el.getAttribute('data-tab');
      if (tab) {
        e.preventDefault();
        scrollToSection(tab);
        toggleMobileDrawer(false);
      }
    });
  });

  // 8. Rola suavemente para a seção se houver hash na URL inicial (#loja, #recursos, etc.)
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && ['inicio', 'loja', 'recursos', 'avaliacoes', 'faq'].includes(initialHash)) {
    setTimeout(() => scrollToSection(initialHash), 100);
  }
});

// Helper de compra rápida
function buyInstant(id, title, price, image) {
  if (typeof Cart !== 'undefined') {
    Cart.addItem({ id, title, price, image });
  }
  window.location.href = 'checkout.html';
}
