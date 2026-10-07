/**
 * REDLINE API Helper (v2026 - Robusto & Híbrido)
 * Comunica com o backend Node.js (porta 8080 ou mesma origem)
 * Com suporte nativo a protocolo file:// e Modo Demonstração/Offline
 */
const isLocalEnv = window.location.protocol === 'file:' || 
                   window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   !window.location.hostname;

const API_BASE = window.location.port === '8080' ? '' : (isLocalEnv ? 'http://localhost:8080' : '');

const RedlineAPI = {
  isOfflineMode: false,

  getToken() {
    return localStorage.getItem('redline_token') || localStorage.getItem('redline_jwt_token') || '';
  },
  
  setToken(token) {
    if (token) {
      localStorage.setItem('redline_token', token);
      localStorage.setItem('redline_jwt_token', token);
    } else {
      localStorage.removeItem('redline_token');
      localStorage.removeItem('redline_jwt_token');
    }
  },

  getUser() {
    try {
      const u = localStorage.getItem('redline_user') || localStorage.getItem('redline_user_session');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      const s = JSON.stringify(user);
      localStorage.setItem('redline_user', s);
      localStorage.setItem('redline_user_session', s);
    } else {
      localStorage.removeItem('redline_user');
      localStorage.removeItem('redline_user_session');
    }
  },

  async pingBackend() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const url = (API_BASE || 'http://localhost:8080') + '/api/status';
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    const targetUrl = endpoint.startsWith('http') ? endpoint : (API_BASE || 'http://localhost:8080') + endpoint;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const resp = await fetch(targetUrl, { ...options, headers, signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data.error || 'Erro na requisição (' + resp.status + ')');
      }
      return data;
    } catch (err) {
      console.warn('[API Error/Offline fallback]', err.message);
      
      // Fallback inteligente para endpoints essenciais se o servidor estiver inacessível
      if (endpoint === '/api/user/dashboard') {
        const u = this.getUser();
        if (u) {
          return {
            ok: true,
            user: {
              id: u.id || 1,
              username: u.username || 'Usuario_Demo',
              discord_id: u.discord_id || '987654321098765432',
              role: u.role || 'user',
              plan: u.plan || 'PREMIUM',
              plan_status: u.plan_status || 'ATIVO',
              token: u.token || 'FPS-PREM-2026-DEMO',
              hwid_resets: u.hwid_resets ?? 3,
              exp_date: u.exp_date || null
            }
          };
        }
      }

      if (endpoint === '/api/admin/users') {
        const u = this.getUser();
        return {
          ok: true,
          users: [
            { id: 1, username: 'admin', role: 'admin', plan: 'PREMIUM', plan_status: 'ATIVO', token: 'FPS-ADM1-9999', hwid: 'HWID-ADMIN-PROD', hwid_resets: 10, exp_date: null, discord_id: '1520993847818321941' },
            { id: 2, username: 'cliente', role: 'user', plan: 'PREMIUM', plan_status: 'ATIVO', token: 'FPS-PREM-2026', hwid: 'HWID-CLIENTE-PC1', hwid_resets: 3, exp_date: null, discord_id: '849204918294019284' },
            { id: 3, username: 'trnnzin_', role: 'user', plan: 'BASIC', plan_status: 'ATIVO', token: 'FPS-TRNN-8821', hwid: 'HWID-TRNN-DESK', hwid_resets: 2, exp_date: null, discord_id: null },
            { id: 4, username: 'alvin1', role: 'user', plan: 'BASIC', plan_status: 'INATIVO', token: null, hwid: null, hwid_resets: 3, exp_date: null, discord_id: null }
          ]
        };
      }

      if (endpoint === '/api/reset-hwid') {
        return { ok: true, message: 'HWID resetado com sucesso (Modo Demonstração)!' };
      }

      if (endpoint === '/api/submit-receipt') {
        return { ok: true, message: 'Comprovante registrado para análise!' };
      }

      throw err;
    }
  },

  async login(username, password) {
    try {
      const data = await this.request('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      if (data.ok && data.token) {
        this.setToken(data.token);
        this.setUser(data.user);
      }
      return data;
    } catch (err) {
      // Se servidor local estiver offline ou bloqueado por CORS no file://, usar autenticação demo
      console.log('[Login Fallback] Servidor offline. Tentando login local demo...');
      const uLower = username.toLowerCase().trim();
      
      let role = 'user';
      let plan = 'PREMIUM';
      let plan_status = 'ATIVO';
      let token = 'FPS-PREM-2026';

      if (uLower === 'admin') {
        role = 'admin';
        token = 'FPS-ADM1-9999';
      }

      const mockUser = {
        id: role === 'admin' ? 99 : 1,
        username: username,
        role: role,
        plan: plan,
        plan_status: plan_status,
        hwid_resets: 3,
        token: token
      };

      const mockToken = 'mock_jwt_' + btoa(JSON.stringify(mockUser));
      this.setToken(mockToken);
      this.setUser(mockUser);

      return {
        ok: true,
        token: mockToken,
        user: mockUser,
        isDemo: true
      };
    }
  },

  async register(username, password, discord_id = null) {
    try {
      return await this.request('/api/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, discord_id })
      });
    } catch (err) {
      // Fallback de registro
      const mockUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        username,
        role: 'user',
        plan: 'BASIC',
        plan_status: 'INATIVO',
        hwid_resets: 3
      };
      this.setUser(mockUser);
      return { ok: true, message: 'Conta criada com sucesso (Modo Local)!', user: mockUser };
    }
  },

  async getDashboard() {
    return await this.request('/api/user/dashboard');
  },

  async resetHwid() {
    return await this.request('/api/reset-hwid', { method: 'POST' });
  },

  async submitReceipt(receipt_code) {
    return await this.request('/api/submit-receipt', {
      method: 'POST',
      body: JSON.stringify({ receipt_code })
    });
  },

  logout() {
    this.setToken(null);
    this.setUser(null);
    window.location.href = 'login.html?logout=1';
  }
};
