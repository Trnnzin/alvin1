import re

html_path = 'C:/Users/User/Downloads/loja-otimizacao/website/index.html'
css_path = 'C:/Users/User/Downloads/loja-otimizacao/website/style.css'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will use a simple regex approach but manually crafted strings to be safe.
# Actually, I'll just write the new HTML chunk and replace the old one exactly.

old_chunk = '''                <div class="nav-actions" style="display: flex; align-items: center; gap: 10px;">
                    <button id="open-auth-modal-btn" onclick="if(typeof showAuthFormModal==='function')showAuthFormModal();" style="padding: 10px 18px; font-size: 13px; font-weight: 800; background: linear-gradient(135deg, #dc2626, #991b1b); border-radius: 8px; cursor: pointer; border: none; color: #fff; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 0 15px rgba(220,38,38,0.3); transition: all 0.2s;">?? Login / Registrar</button>
                    <a href="https://discord.gg/WPqj5nGjhD" target="_blank" class="btn-header-discord" style="padding: 10px 16px; font-size: 13px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #e4e4e7; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">?? Discord</a>
                    <button id="hamburger-btn" aria-label="Abrir menu" aria-expanded="false" style="display:none;background:none;border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:8px 10px;cursor:pointer;color:#fff;font-size:18px;line-height:1;">?</button>
                </div>
            </nav>
        </header>

        <!-- Seção Hero -->
        <section class="hero">
            <div class="hero-grid">
                <div class="hero-content">
                    <div
                        style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:20px;font-size:12px;font-weight:800;color:#ef4444;margin-bottom:20px;letter-spacing:0.5px;box-shadow:0 0 15px rgba(239,68,68,0.2);">
                        <span
                            style="width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px #22c55e;display:inline-block;"></span>
                        ? REDLINE PERFORMANCE ULTRA v1.0 AI EDITION
                    </div>
                    <h1
                        style="font-size:3.5rem;font-weight:900;line-height:1.1;letter-spacing:-1px;margin-bottom:20px;">
                        Seu PC Rápido de Verdade.<br>
                        <span
                            style="background:linear-gradient(135deg, #ef4444 0%, #f87171 50%, #ffffff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 25px rgba(239,68,68,0.35));">FPS
                            no Máximo &amp; Delay Zero.</span>
                    </h1>
                    <p style="font-size:1.15rem;color:#a1a1aa;line-height:1.7;margin-bottom:32px;">
                        Eleve o desempenho do seu computador com o otimizador eSports nº 1. Reduza o input lag para
                        0.5ms, elimine engasgos de CPU/GPU e ganhe até +70% de FPS com o assistente conversacional de IA
                        integrado.
                    </p>
                    <div class="hero-buttons">
                        <a href="#planos" class="btn-primary"
                            style="font-size:17px;padding:16px 36px;box-shadow:0 0 25px rgba(239,68,68,0.5);">??
                            GARANTIR FPS AGORA</a>
                        <a href="https://discord.gg/WPqj5nGjhD" target="_blank" class="btn-secondary"
                            style="font-size:15px;padding:16px 28px;">?? Entrar no Discord Oficial</a>
                    </div>

                    <!-- Selo de Garantia e Reversibilidade -->
                    <div class="hero-security-badge"
                        style="margin-top:35px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.25);">
                        <span class="badge-icon">???</span>
                        <span class="badge-text" style="color:#d4d4d8;"><strong style="color:#22c55e;">100% Seguro &amp;
                                Reversível:</strong> O painel cria pontos de restauração automaticamente antes de
                            aplicar qualquer otimização.</span>
                    </div>
                </div>

                <!-- Card de Status Lateral -->
                <div class="hero-card"
                    style="background:rgba(12,12,15,0.85);border:1px solid rgba(239,68,68,0.3);box-shadow:0 20px 50px rgba(239,68,68,0.15);backdrop-filter:blur(20px);border-radius:20px;padding:28px;">
                    <div
                        style="font-size:11px;font-weight:800;color:#ef4444;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;">
                        <span>?? BENCHMARK DE SISTEMA EM TEMPO REAL</span>
                        <span style="color:#22c55e;">v1.0 ONLINE</span>
                    </div>
                    <div class="status-row"
                        style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <div class="status-label" style="font-size:13px;color:#a1a1aa;">Ganho Médio de FPS</div>
                        <div class="status-value accent"
                            style="font-size:24px;font-weight:900;color:#22c55e;text-shadow:0 0 12px rgba(34,197,94,0.4);">
                            +70% FPS</div>
                    </div>
                    <div class="status-row"
                        style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <div class="status-label" style="font-size:13px;color:#a1a1aa;">Input Lag &amp; Timer Resolution
                        </div>
                        <div class="status-value" style="font-size:20px;font-weight:800;color:#ef4444;">0.5 ms (-62%)
                        </div>
                    </div>
                    <div class="status-row"
                        style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <div class="status-label" style="font-size:13px;color:#a1a1aa;">Assistente de IA Copilot</div>
                        <div class="status-value" style="font-size:15px;font-weight:700;color:#3b82f6;">?? Resposta
                            Instantânea</div>
                    </div>
                    <div class="status-row">
                        <div class="status-label" style="font-size:13px;color:#a1a1aa;">Segurança &amp; Reversibilidade
                        </div>
                        <div class="status-value success" style="font-size:15px;font-weight:700;color:#22c55e;">? 100%
                            Protegido</div>
                    </div>
                </div>'''

new_chunk = '''                <div class="nav-actions">
                    <button id="open-auth-modal-btn" onclick="if(typeof showAuthFormModal==='function')showAuthFormModal();">?? Login / Registrar</button>
                    <a href="https://discord.gg/WPqj5nGjhD" target="_blank" class="btn-header-discord">?? Discord</a>
                    <button id="hamburger-btn" aria-label="Abrir menu" aria-expanded="false">?</button>
                </div>
            </nav>
        </header>

        <!-- Seção Hero -->
        <section class="hero">
            <div class="hero-grid">
                <div class="hero-content">
                    <div class="hero-edition-badge">
                        <span class="hero-edition-badge-dot"></span>
                        ? REDLINE PERFORMANCE ULTRA v1.0 AI EDITION
                    </div>
                    <h1 class="hero-title">
                        Seu PC Rápido de Verdade.<br>
                        <span class="hero-title-highlight">FPS no Máximo &amp; Delay Zero.</span>
                    </h1>
                    <p class="hero-desc">
                        Eleve o desempenho do seu computador com o otimizador eSports nº 1. Reduza o input lag para
                        0.5ms, elimine engasgos de CPU/GPU e ganhe até +70% de FPS com o assistente conversacional de IA
                        integrado.
                    </p>
                    <div class="hero-buttons">
                        <a href="#planos" class="btn-primary hero-btn-primary">?? GARANTIR FPS AGORA</a>
                        <a href="https://discord.gg/WPqj5nGjhD" target="_blank" class="btn-secondary hero-btn-secondary">?? Entrar no Discord Oficial</a>
                    </div>

                    <!-- Selo de Garantia e Reversibilidade -->
                    <div class="hero-security-badge-container">
                        <span class="badge-icon">???</span>
                        <span class="badge-text"><strong>100% Seguro &amp; Reversível:</strong> O painel cria pontos de restauração automaticamente antes de aplicar qualquer otimização.</span>
                    </div>
                </div>

                <!-- Card de Status Lateral -->
                <div class="hero-card">
                    <div class="hero-card-header">
                        <span>?? BENCHMARK DE SISTEMA EM TEMPO REAL</span>
                        <span>v1.0 ONLINE</span>
                    </div>
                    <div class="status-row">
                        <div class="status-label">Ganho Médio de FPS</div>
                        <div class="status-value accent">+70% FPS</div>
                    </div>
                    <div class="status-row">
                        <div class="status-label">Input Lag &amp; Timer Resolution</div>
                        <div class="status-value">0.5 ms (-62%)</div>
                    </div>
                    <div class="status-row">
                        <div class="status-label">Assistente de IA Copilot</div>
                        <div class="status-value copilot">?? Resposta Instantânea</div>
                    </div>
                    <div class="status-row no-border">
                        <div class="status-label">Segurança &amp; Reversibilidade</div>
                        <div class="status-value success">? 100% Protegido</div>
                    </div>
                </div>'''

if old_chunk in content:
    content = content.replace(old_chunk, new_chunk)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('HTML updated successfully.')
else:
    print('Chunk not found in HTML.')

# Now append CSS
css_append = '''
/* CSS Adicionado Automáticamente - Limpeza de Inline Styles */
.nav-actions { display: flex; align-items: center; gap: 10px; }
#open-auth-modal-btn { padding: 10px 18px; font-size: 13px; font-weight: 800; background: linear-gradient(135deg, #dc2626, #991b1b); border-radius: 8px; cursor: pointer; border: none; color: #fff; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 0 15px rgba(220,38,38,0.3); transition: all 0.2s; }
.btn-header-discord { padding: 10px 16px; font-size: 13px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #e4e4e7; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
#hamburger-btn { display: none; background: none; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 10px; cursor: pointer; color: #fff; font-size: 18px; line-height: 1; }

.hero-edition-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 20px; font-size: 12px; font-weight: 800; color: #ef4444; margin-bottom: 20px; letter-spacing: 0.5px; box-shadow: 0 0 15px rgba(239,68,68,0.2); }
.hero-edition-badge-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 8px #22c55e; display: inline-block; }
.hero-title { font-size: 3.5rem; font-weight: 900; line-height: 1.1; letter-spacing: -1px; margin-bottom: 20px; }
.hero-title-highlight { background: linear-gradient(135deg, #ef4444 0%, #f87171 50%, #ffffff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 25px rgba(239,68,68,0.35)); }
.hero-desc { font-size: 1.15rem; color: #a1a1aa; line-height: 1.7; margin-bottom: 32px; }
.hero-btn-primary { font-size: 17px; padding: 16px 36px; box-shadow: 0 0 25px rgba(239,68,68,0.5); }
.hero-btn-secondary { font-size: 15px; padding: 16px 28px; }
.hero-security-badge-container { margin-top: 35px; background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.25); border-radius: 12px; padding: 15px; display: flex; align-items: center; gap: 12px; }
.hero-security-badge-container .badge-text { color: #d4d4d8; font-size: 14px; line-height: 1.5; }
.hero-security-badge-container strong { color: #22c55e; }
.hero-card { background: rgba(12,12,15,0.85); border: 1px solid rgba(239,68,68,0.3); box-shadow: 0 20px 50px rgba(239,68,68,0.15); backdrop-filter: blur(20px); border-radius: 20px; padding: 28px; }
.hero-card-header { font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
.hero-card-header span:last-child { color: #22c55e; }
.status-row { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.status-row.no-border { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
.status-label { font-size: 13px; color: #a1a1aa; }
.status-value { font-size: 20px; font-weight: 800; color: #ef4444; margin-top: 4px; }
.status-value.accent { font-size: 24px; font-weight: 900; color: #22c55e; text-shadow: 0 0 12px rgba(34,197,94,0.4); }
.status-value.copilot { font-size: 15px; font-weight: 700; color: #3b82f6; }
.status-value.success { font-size: 15px; font-weight: 700; color: #22c55e; }
'''

with open(css_path, 'a', encoding='utf-8') as f:
    f.write(css_append)
print('CSS updated successfully.')
