/**
 * REDLINE Cart System (Drawer + LocalStorage + Event Delegation)
 * Versão 2026.3 - Totalmente compatível com todos os navegadores
 */
(function() {
  'use strict';

  var Cart = {
    STORAGE_KEY: 'redline_cart',

    getItems: function() {
      try {
        var raw = localStorage.getItem(this.STORAGE_KEY);
        var parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.warn('Erro ao ler carrinho do localStorage:', e);
        return [];
      }
    },

    saveItems: function(items) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Erro ao salvar carrinho no localStorage:', e);
      }
      this.updateUI();
    },

    addItem: function(product) {
      if (!product || product.id == null) return;
      var items = this.getItems();
      var prodId = String(product.id);
      var existing = null;

      for (var i = 0; i < items.length; i++) {
        if (String(items[i].id) === prodId) {
          existing = items[i];
          break;
        }
      }

      if (existing) {
        existing.qty = (parseInt(existing.qty, 10) || 1) + 1;
      } else {
        items.push({
          id: product.id,
          title: product.title || 'Produto REDLINE',
          price: parseFloat(product.price) || 0,
          image: product.image || 'assets/images/redline-logo.png?v=2026',
          qty: 1
        });
      }

      this.saveItems(items);
      this.openDrawer();
      this.showToast('Produto adicionado ao carrinho! 🛒');
    },

    removeItem: function(id) {
      if (id == null) return;
      var idStr = String(id);
      var items = this.getItems();
      var filtered = [];

      for (var i = 0; i < items.length; i++) {
        if (String(items[i].id) !== idStr) {
          filtered.push(items[i]);
        }
      }

      this.saveItems(filtered);
      this.showToast('Item removido do carrinho.');
    },

    clear: function() {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (e) {}
      this.updateUI();
    },

    updateQty: function(id, delta) {
      if (id == null) return;
      var idStr = String(id);
      var deltaNum = parseInt(delta, 10) || 0;
      var items = this.getItems();
      var targetItem = null;

      for (var i = 0; i < items.length; i++) {
        if (String(items[i].id) === idStr) {
          targetItem = items[i];
          break;
        }
      }

      if (!targetItem) return;

      var currentQty = parseInt(targetItem.qty, 10) || 1;
      var newQty = currentQty + deltaNum;

      if (newQty <= 0) {
        this.removeItem(id);
      } else {
        targetItem.qty = newQty;
        this.saveItems(items);
      }
    },

    getTotal: function() {
      var items = this.getItems();
      var total = 0;
      for (var i = 0; i < items.length; i++) {
        var price = parseFloat(items[i].price) || 0;
        var qty = parseInt(items[i].qty, 10) || 1;
        total += price * qty;
      }
      return total;
    },

    getCount: function() {
      var items = this.getItems();
      var count = 0;
      for (var i = 0; i < items.length; i++) {
        count += parseInt(items[i].qty, 10) || 1;
      }
      return count;
    },

    formatMoney: function(val) {
      return 'R$ ' + (Number(val) || 0).toFixed(2).replace('.', ',');
    },

    openDrawer: function() {
      var drawer = document.getElementById('cart-drawer');
      var backdrop = document.getElementById('cart-backdrop');
      if (drawer) drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      if (document.body) document.body.style.overflow = 'hidden';
    },

    closeDrawer: function() {
      var drawer = document.getElementById('cart-drawer');
      var backdrop = document.getElementById('cart-backdrop');
      if (drawer) drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      if (document.body) document.body.style.overflow = '';
    },

    updateUI: function() {
      var count = this.getCount();
      var total = this.getTotal();

      // Atualiza badges
      var badges = document.querySelectorAll('.cart-badge');
      for (var i = 0; i < badges.length; i++) {
        badges[i].textContent = count;
        badges[i].style.display = count > 0 ? 'flex' : 'none';
      }

      // Atualiza valor total
      var totalEl = document.getElementById('cart-total-value');
      if (totalEl) totalEl.textContent = this.formatMoney(total);

      // Atualiza lista de itens
      var body = document.getElementById('cart-items-body');
      if (!body) return;

      var items = this.getItems();
      if (items.length === 0) {
        body.innerHTML = [
          '<div class="cart-empty">',
          '  <div class="cart-empty-icon">🛒</div>',
          '  <h4>Seu carrinho está vazio</h4>',
          '  <p>Escolha um plano ou otimização no catálogo e turbine seu FPS!</p>',
          '  <button type="button" onclick="Cart.closeDrawer(); if(typeof switchTab===\'function\')switchTab(\'loja\');" class="btn-buy-now" style="margin-top:0.5rem; border:none; cursor:pointer;">Ver Catálogo</button>',
          '</div>'
        ].join('\n');
      } else {
        var html = [];
        for (var j = 0; j < items.length; j++) {
          var item = items[j];
          var itemImg = item.image || 'assets/images/redline-logo.png?v=2026';
          var itemQty = item.qty || 1;
          var itemId = String(item.id);

          html.push(
            '<div class="cart-item" data-cart-id="' + itemId + '">' +
            '  <img src="' + itemImg + '" alt="' + item.title + '" class="cart-item-img" onerror="this.src=\'assets/images/redline-logo.png?v=2026\'">' +
            '  <div class="cart-item-details">' +
            '    <div class="cart-item-title" title="' + item.title + '">' + item.title + '</div>' +
            '    <div class="cart-item-price">' + this.formatMoney(item.price) + '</div>' +
            '    <div class="cart-item-controls">' +
            '      <button type="button" class="cart-qty-btn" data-action="decrease" data-id="' + itemId + '" title="Diminuir quantidade">-</button>' +
            '      <span class="cart-qty-val">' + itemQty + '</span>' +
            '      <button type="button" class="cart-qty-btn" data-action="increase" data-id="' + itemId + '" title="Aumentar quantidade">+</button>' +
            '    </div>' +
            '  </div>' +
            '  <button type="button" class="cart-item-remove" data-action="remove" data-id="' + itemId + '" title="Remover item do carrinho">' +
            '    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="pointer-events:none;"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>' +
            '  </button>' +
            '</div>'
          );
        }
        body.innerHTML = html.join('\n');
      }
    },

    showToast: function(msg) {
      try {
        if (typeof window.Toastify === 'function') {
          window.Toastify({
            text: msg,
            duration: 2500,
            gravity: 'bottom',
            position: 'right',
            style: {
              background: 'linear-gradient(135deg, #182030, #ff3344)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }
          }).showToast();
        }
      } catch (e) {}
    }
  };

  // Delegação Global de Cliques (garante 100% de funcionamento independente de innerHTML ou escopo)
  document.addEventListener('click', function(e) {
    var target = e.target;
    if (!target) return;

    // 1. Botão diminuir quantidade
    var decBtn = target.closest('[data-action="decrease"]');
    if (decBtn) {
      e.preventDefault();
      e.stopPropagation();
      var decId = decBtn.getAttribute('data-id');
      Cart.updateQty(decId, -1);
      return;
    }

    // 2. Botão aumentar quantidade
    var incBtn = target.closest('[data-action="increase"]');
    if (incBtn) {
      e.preventDefault();
      e.stopPropagation();
      var incId = incBtn.getAttribute('data-id');
      Cart.updateQty(incId, 1);
      return;
    }

    // 3. Botão remover item
    var remBtn = target.closest('[data-action="remove"]');
    if (remBtn) {
      e.preventDefault();
      e.stopPropagation();
      var remId = remBtn.getAttribute('data-id');
      Cart.removeItem(remId);
      return;
    }

    // 4. Fechar ao clicar no backdrop do carrinho
    if (target.id === 'cart-backdrop') {
      Cart.closeDrawer();
      return;
    }
  });

  // Exporta globalmente no window
  window.Cart = Cart;

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { Cart.updateUI(); });
  } else {
    Cart.updateUI();
  }
})();
