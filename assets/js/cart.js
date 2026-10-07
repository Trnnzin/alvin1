/**
 * REDLINE Cart System (Drawer + LocalStorage)
 */
const Cart = {
  STORAGE_KEY: 'redline_cart',

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  saveItems(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateUI();
  },

  addItem(product) {
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || 'assets/images/logo.webp',
        qty: 1
      });
    }
    this.saveItems(items);
    this.openDrawer();
    this.showToast('Produto adicionado ao carrinho! 🛒');
  },

  removeItem(id) {
    const idStr = String(id);
    let items = this.getItems();
    items = items.filter(i => String(i.id) !== idStr);
    this.saveItems(items);
  },

  updateQty(id, delta) {
    const idStr = String(id);
    const items = this.getItems();
    const item = items.find(i => String(i.id) === idStr);
    if (!item) return;

    const currentQty = parseInt(item.qty, 10) || 1;
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      this.removeItem(id);
    } else {
      item.qty = newQty;
      this.saveItems(items);
    }
  },

  getTotal() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  },

  getCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + (item.qty || 1), 0);
  },

  formatMoney(val) {
    return 'R$ ' + Number(val).toFixed(2).replace('.', ',');
  },

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  updateUI() {
    const count = this.getCount();
    const total = this.getTotal();

    // Atualiza badges
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });

    // Atualiza corpo do drawer
    const body = document.getElementById('cart-items-body');
    const totalEl = document.getElementById('cart-total-value');
    if (totalEl) totalEl.textContent = this.formatMoney(total);

    if (!body) return;

    const items = this.getItems();
    if (items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h4>Seu carrinho está vazio</h4>
          <p>Escolha um plano ou otimização no catálogo e turbine seu FPS!</p>
          <a href="#store" onclick="Cart.closeDrawer()" class="btn-buy-now" style="margin-top: 0.5rem; text-decoration: none;">Ver Catálogo</a>
        </div>
      `;
    } else {
      body.innerHTML = items.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img" onerror="this.src='assets/images/redline-logo.png?v=2026'">
          <div class="cart-item-details">
            <div class="cart-item-title" title="${item.title}">${item.title}</div>
            <div class="cart-item-price">${this.formatMoney(item.price)}</div>
            <div class="cart-item-controls">
              <button type="button" class="cart-qty-btn" onclick="Cart.updateQty('${item.id}', -1)" title="Diminuir">-</button>
              <span class="cart-qty-val">${item.qty || 1}</span>
              <button type="button" class="cart-qty-btn" onclick="Cart.updateQty('${item.id}', 1)" title="Aumentar">+</button>
            </div>
          </div>
          <button type="button" class="cart-item-remove" onclick="Cart.removeItem('${item.id}')" title="Remover do carrinho">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
          </button>
        </div>
      `).join('');
    }
  },

  showToast(msg) {
    if (window.Toastify) {
      Toastify({
        text: msg,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
          background: "linear-gradient(135deg, #182030, #ff3344)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }
      }).showToast();
    }
  }
};

window.Cart = Cart;
document.addEventListener('DOMContentLoaded', () => Cart.updateUI());
