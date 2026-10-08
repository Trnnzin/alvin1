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

  // 9. Inicializa Popups de Prova Social (Compras Recentes)
  initRecentSales();
});

// 1. Helper para copiar código de cupom com Toastify
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

// 2. Alternador de visualização no Comparador Interativo Antes x Depois
function toggleBenchmarkMode(mode) {
  const btnBefore = document.getElementById('btn-benchmark-before');
  const btnAfter = document.getElementById('btn-benchmark-after');
  const statFps = document.getElementById('benchmark-fps-val');
  const statDelay = document.getElementById('benchmark-delay-val');
  const statProc = document.getElementById('benchmark-proc-val');
  const statStutter = document.getElementById('benchmark-stutter-val');
  const lineSvg = document.getElementById('frametime-svg-path');
  const statusBadge = document.getElementById('frametime-status-badge');

  if (mode === 'after') {
    if (btnBefore) btnBefore.className = 'btn-toggle-benchmark';
    if (btnAfter) btnAfter.className = 'btn-toggle-benchmark active-green';
    if (statFps) { statFps.textContent = '165 FPS'; statFps.style.color = '#10b981'; }
    if (statDelay) { statDelay.textContent = '0.5 ms'; statDelay.style.color = '#00d2ff'; }
    if (statProc) { statProc.textContent = '62 Proc.'; statProc.style.color = '#10b981'; }
    if (statStutter) { statStutter.textContent = '0% (Nenhum)'; statStutter.style.color = '#10b981'; }
    if (statusBadge) {
      statusBadge.innerHTML = '<span style="color: #10b981;">●</span> Frametime 100% Estabilizado &amp; Sem Quedas';
      statusBadge.style.color = '#10b981';
    }
    if (lineSvg) {
      lineSvg.setAttribute('d', 'M 0 35 L 80 35 L 160 35 L 240 35 L 320 35 L 400 35 L 480 35 L 560 35 L 640 35 L 720 35 L 800 35');
      lineSvg.setAttribute('stroke', '#10b981');
    }
  } else {
    if (btnBefore) btnBefore.className = 'btn-toggle-benchmark active-red';
    if (btnAfter) btnAfter.className = 'btn-toggle-benchmark';
    if (statFps) { statFps.textContent = '78 FPS'; statFps.style.color = '#ef4444'; }
    if (statDelay) { statDelay.textContent = '5.8 ms'; statDelay.style.color = '#ef4444'; }
    if (statProc) { statProc.textContent = '194 Proc.'; statProc.style.color = '#ef4444'; }
    if (statStutter) { statStutter.textContent = 'Quedas Constantes'; statStutter.style.color = '#ef4444'; }
    if (statusBadge) {
      statusBadge.innerHTML = '<span style="color: #ef4444;">●</span> Picos Críticos de Input Lag &amp; Micro-Stutter';
      statusBadge.style.color = '#ef4444';
    }
    if (lineSvg) {
      lineSvg.setAttribute('d', 'M 0 50 L 70 20 L 140 75 L 210 30 L 280 85 L 350 40 L 420 80 L 490 25 L 560 70 L 630 35 L 700 80 L 800 45');
      lineSvg.setAttribute('stroke', '#ef4444');
    }
  }
}

// 3. Sistema de Notificações de Vendas Recentes (Prova Social)
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
