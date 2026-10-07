/**
 * REDLINE Auth State & OAuth Handler
 */
function initAuth() {
  // Verifica se recebeu token do Discord no fragment da URL (#token=...)
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('token');
    const username = params.get('username');

    if (token) {
      RedlineAPI.setToken(token);
      if (username) {
        RedlineAPI.setUser({ username: decodeURIComponent(username), role: 'user' });
      }
      // Limpa o hash da URL para ficar limpo
      window.history.replaceState(null, null, window.location.pathname);
      Cart.showToast('Login com Discord realizado com sucesso! 🚀');
    }
  }

  // Atualiza botão de login no Header
  const user = RedlineAPI.getUser();
  const loginBtn = document.getElementById('header-login-btn');
  if (loginBtn && user) {
    loginBtn.innerHTML = `
      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
      <span>${user.username}</span>
    `;
    loginBtn.href = 'dashboard.html';
    loginBtn.title = 'Acessar meu Painel';
  }
}
