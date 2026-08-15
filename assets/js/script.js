// =========================================================================
// 1. SISTEMA DE PARTÍCULAS INTERATIVAS (CANVAS)
// =========================================================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

// Redimensionar Canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Classe de Partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.4)';
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebater nas bordas
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Interação com o Mouse (Efeito de repulsão suave)
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * force * 1.5;
                this.y -= Math.sin(angle) * force * 1.5;
            }
        }
    }
}

// Inicializar Partículas
function initParticles() {
    particles = [];
    let numberOfParticles = Math.floor((canvas.width * canvas.height) / 25000); // Otimizado: menos part�culas para aliviar CPU
    // Capar número de partículas para performance
    numberOfParticles = Math.min(numberOfParticles, 100);
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

// Conectar Partículas Próximas
function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                let opacity = (120 - distance) / 120 * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.strokeStyle = `rgba(220, 38, 38, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Loop de Animação
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    if (window.isCanvasVisible !== false) requestAnimationFrame(animate);
}

// Inicialização Inicial
resizeCanvas();
animate();


// =========================================================================
// 2. ACCORDION DO FAQ (DÚVIDAS FREQUENTES)
// =========================================================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');
        
        // Fechar todos os outros
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
            i.querySelector('.faq-answer').style.maxHeight = '0';
        });

        // Alternar o atual
        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});


// =========================================================================
// 3. MODAL DE COMPRA / DISCORD CONTROLE
// =========================================================================
// 3. SCROLL REVEAL ANIMATIONS
// =========================================================================

// =========================================================================
// 4. ANIMAÇÃO DE SCROLL REVEAL (INTERSECTION OBSERVER)
// =========================================================================
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
} else {
    // Fallback caso navegador antigo não suporte
    revealElements.forEach(el => el.classList.add('active'));
}

// =========================================================================
// 5. LÓGICA DO SIMULADOR DE FPS
// =========================================================================
const selectCpu = document.getElementById('sim-cpu');
const selectGpu = document.getElementById('sim-gpu');
const selectRam = document.getElementById('sim-ram');
const selectGame = document.getElementById('sim-game');

const counterEl = document.getElementById('fps-counter');
const gainTextEl = document.getElementById('fps-gain-text');
const planNameEl = document.getElementById('recommended-plan-name');
const planReasonEl = document.getElementById('recommended-plan-reason');



// Matrizes de dados reais obtidos de benchmarks de mercado (GTA/FiveM, CS2, Valorant, Fortnite)
const BENCHMARK_DATA = {
    fivem: {
        gpus: {
            'gpu-integrated': 32,
            'gpu-low': 52,
            'gpu-med': 82,
            'gpu-high': 120
        },
        gains: {
            light: 0.20,
            medium: 0.40,
            advanced: 0.55
        },
        maxCap: 165 // Limite físico do motor gráfico RAGE/GTA V para estabilidade física
    },
    cs2: {
        gpus: {
            'gpu-integrated': 45,
            'gpu-low': 95,
            'gpu-med': 180,
            'gpu-high': 310
        },
        gains: {
            light: 0.15,
            medium: 0.30,
            advanced: 0.45
        },
        maxCap: 500
    },
    valorant: {
        gpus: {
            'gpu-integrated': 70,
            'gpu-low': 130,
            'gpu-med': 240,
            'gpu-high': 410
        },
        gains: {
            light: 0.15,
            medium: 0.25,
            advanced: 0.35
        },
        maxCap: 600
    },
    fortnite: {
        gpus: {
            'gpu-integrated': 40,
            'gpu-low': 80,
            'gpu-med': 140,
            'gpu-high': 260
        },
        gains: {
            light: 0.18,
            medium: 0.32,
            advanced: 0.50
        },
        maxCap: 360
    }
};

const CPU_MODIFIERS = {
    'intel-low': 0.70,
    'amd-low': 0.70,
    'intel-med': 1.00,
    'amd-med': 1.00,
    'intel-high': 1.35,
    'amd-high': 1.35
};

const RAM_MODIFIERS = {
    'ram-8': 0.80,
    'ram-16': 1.00,
    'ram-32': 1.12
};

function calculateFPS() {
    if (!selectCpu || !selectGpu || !selectRam || !selectGame) return;

    const cpu = selectCpu.value;
    const gpu = selectGpu.value;
    const ram = selectRam.value;
    const game = selectGame.value;

    // 1. Obter dados base do benchmark
    const gameData = BENCHMARK_DATA[game];
    const gpuBaseFps = gameData.gpus[gpu];
    const cpuMod = CPU_MODIFIERS[cpu];
    const ramMod = RAM_MODIFIERS[ram];

    // 2. Calcular FPS Inicial (Sem otimização)
    let fpsBefore = Math.round(gpuBaseFps * cpuMod * ramMod);

    // 3. Determinar o plano ideal baseado no cenário
    // Regras de decisão inteligente do plano
    let plan, reason;
    if (gpu === 'gpu-high' || cpu === 'intel-high' || cpu === 'amd-high' || game === 'fivem') {
        plan = 'Advanced Plus (Com IA)';
        reason = 'Recomendado para extrair desempenho máximo do setup com o assistente conversacional de Inteligência Artificial REDLINE Copilot v1.0 habilitado ao vivo!';
    } else {
        plan = 'Advanced (Painel)';
        reason = 'Ideal para acesso completo ao Painel Visual REDLINE com todas as otimizações automáticas de CPU, GPU, RAM e Input Lag em 1-Clique.';
    }

    // 4. Calcular FPS Final (Com otimização)
    const gainPct = gameData.gains['advanced'] || 0.45;
    let fpsAfter = Math.round(fpsBefore * (1 + gainPct));

    // Aplicar limite de segurança máximo realista (Game engine limit caps)
    if (fpsAfter > gameData.maxCap) {
        fpsAfter = gameData.maxCap;
    }

    // Calcular ganho final exibido (considerando o limite superior)
    const finalGainPct = Math.round(((fpsAfter - fpsBefore) / fpsBefore) * 100);

    // 5. Atualizar HTML
    updateCounter(fpsAfter);
    gainTextEl.textContent = `+${finalGainPct}% de FPS Médio Estável`;
    planNameEl.textContent = plan;
    planReasonEl.textContent = reason;

    const metricLowEl = document.getElementById('metric-low-text');
    const metricLagEl = document.getElementById('metric-lag-text');
    if (metricLowEl) {
        const lowFps = Math.round(fpsAfter * 0.72);
        metricLowEl.textContent = `${lowFps} FPS (Liso / 0 Stutter)`;
    }
    if (metricLagEl) {
        const lagMs = (1000 / fpsAfter).toFixed(1);
        metricLagEl.textContent = `${lagMs} ms (-62% Delay)`;
    }

    // Atualizar visualmente o link de compra conforme a recomendação
    const planLink = document.getElementById('recommended-plan-link');
    if (planLink) {
        planLink.setAttribute('href', '#planos');
    }

    // Atualiza classe visual no card de plano recomendado
    const planCard = document.querySelector('.recommended-plan-card');
    if (planCard) {
        planCard.className = 'recommended-plan-card ' + plan.toLowerCase();
    }
}

let counterInterval;
function updateCounter(targetValue) {
    clearInterval(counterInterval);
    let start = 0;
    const duration = 600; // ms
    const stepTime = 15;
    const totalSteps = duration / stepTime;
    const increment = targetValue / totalSteps;

    counterInterval = setInterval(() => {
        start += increment;
        if (start >= targetValue) {
            counterEl.textContent = targetValue;
            clearInterval(counterInterval);
        } else {
            counterEl.textContent = Math.round(start);
        }
    }, stepTime);
}

// Event Listeners
[selectCpu, selectGpu, selectRam, selectGame].forEach(element => {
    if (element) {
        element.addEventListener('change', calculateFPS);
    }
});

// Inicialização inicial
if (selectCpu) {
    calculateFPS();
}

// =========================================================================
// 6. POPUP DE PROVA SOCIAL E VENDAS EM TEMPO REAL (TOAST NOTIFICATIONS)
// =========================================================================
const salesData = [
    { name: "@guilherme_vt", plan: "Plano Advanced (R$ 20)", time: "há 2 minutos" },
    { name: "@biel_fps", plan: "Plano Medium (R$ 10)", time: "há 5 minutos" },
    { name: "@lucas_gta", plan: "Plano Light (R$ 5)", time: "há 11 minutos" },
    { name: "@renan_fivem", plan: "Plano Advanced (R$ 20)", time: "há 14 minutos" },
    { name: "@pedro_valorant", plan: "Plano Medium (R$ 10)", time: "há 18 minutos" }
];

// Nota: initSalesToast legacy removida — substituída por initLiveSalesToasts (seção 8)

// =========================================================================
// 7. ROTAÇÃO AUTOMÁTICA DE 25 DEPOIMENTOS DE CLIENTES NA TELA
// =========================================================================
const ALL_TESTIMONIALS = [
    {
        user: "@letty_fps",
        name: "Letty",
        image: "assets/images/letty.webp",
        avatar: "L",
        color: "#ec4899",
        time: "Hoje às 15:10",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+65 FPS",
        textFront: '"Otimizei meu notebook para rodar Valorant e passou de 45 pra 110 FPS lisinho! Amei demais o resultado!"',
        textBack: '"O suporte por ticket tirou minhas dúvidas de configuração em menos de 2 minutos. Atendimento nota 10!"'
    },
    {
        user: "@jilo_vtm",
        name: "Jiló",
        image: "assets/images/jilo.webp",
        avatar: "J",
        color: "#10b981",
        time: "Hoje às 14:50",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+45 FPS",
        textFront: '"Melhor compra que fiz no ano. O FiveM parou de dar crash na praça e a cidade carrega na hora!"',
        textBack: '"Recomendo demais o Plano Advanced. As configurações de SMT pro meu Ryzen deram um ganho surreal."'
    },
    {
        user: "@beatriz_hedley",
        name: "Beatriz Hedley",
        image: "assets/images/2783572707045eabedca159ae9a71bea.jpg",
        avatar: "B",
        color: "#8b5cf6",
        time: "Hoje às 14:15",
        plan: "Medium",
        planClass: "medium",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+35 FPS",
        textFront: '"O delay de input no Fortnite sumiu completamente. A resposta do mouse no clique ficou insana!"',
        textBack: '"Entrega pelo bot no Discord muito rápida. Em menos de 1 minuto já tava aplicando o script .bat."'
    },
    {
        user: "@guilherme_vt",
        name: "Guilherme",
        image: "assets/images/11f24251d69720525b0f1f9fec7b51d9.webp",
        avatar: "G",
        color: "#ef4444",
        time: "Hoje às 13:40",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+40 FPS",
        textFront: '"Meu FiveM rodava a 50 FPS instável e travando. Após o Advanced, travou em 90 FPS estável! Recomendo!"',
        textBack: '"O suporte por acesso remoto foi excelente. O técnico configurou tudo na minha frente com total segurança."'
    },
    {
        user: "@biel_fps",
        name: "Biel",
        image: "assets/images/142a741495fd930de4b6fdbb01a06fd3.jpg",
        avatar: "B",
        color: "#f59e0b",
        time: "Ontem às 18:05",
        plan: "Medium",
        planClass: "medium",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+30 FPS",
        textFront: '"O delay de input no Valorant sumiu completamente. Sinto o mouse leve e as miras registram na hora!"',
        textBack: '"Também testei no Warzone e parou totalmente os micro-travamentos de disco que eu tinha."'
    },
    {
        user: "@lucas_gta",
        name: "Lucas",
        image: "assets/images/1918314de7ff1e4b36abeeaf16a1e8d8.webp",
        avatar: "L",
        color: "#3b82f6",
        time: "Há 2 dias",
        plan: "Light",
        planClass: "light",
        rating: "⭐ 5/5 (Nota 9)",
        gain: "+20 FPS",
        textFront: '"Processo de compra muito rápido pelo bot do Discord. O suporte tirou todas as dúvidas. Nota 10!"',
        textBack: '"O fato de criar um ponto de restauração automático me deixou muito seguro. Testei e aprovei."'
    },
    {
        user: "@matheus_cs",
        name: "Matheus",
        image: "assets/images/580c5cdd179539a37064fd5a2e7ea041.jpg",
        avatar: "M",
        color: "#6366f1",
        time: "Há 2 dias",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+50 FPS",
        textFront: '"No CS2 ganhei +50 FPS e o frametime ficou retinho no gráfico. Recomendo de olhos fechados!"',
        textBack: '"A limpeza do Shader Cache do DirectX tirou todas as travadinhas que eu tinha nas fumaças."'
    },
    {
        user: "@renan_rx",
        name: "Renan",
        image: "assets/images/5b02ff72ce3d4e178582581a41c3f1b1.jpg",
        avatar: "R",
        color: "#14b8a6",
        time: "Há 3 dias",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+55 FPS",
        textFront: '"Atendimento no ticket foi instantâneo! Paguei no Pix e em 3 segundos já tava ativando a chave."',
        textBack: '"O otimizador executável é super intuitivo. Ativei as otimizações em 1 clique sem complicação."'
    },
    {
        user: "@vitor_fivem",
        name: "Vitor",
        image: "assets/images/6aca5bbf21bdd1e8bb8951154f80e81e.webp",
        avatar: "V",
        color: "#f43f5e",
        time: "Há 3 dias",
        plan: "Medium",
        planClass: "medium",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+35 FPS",
        textFront: '"Texturas do GTA não somem mais enquanto tô dirigindo rápido na cidade. Salvou meu RP!"',
        textBack: '"A otimização de memória RAM liberou quase 3GB de cache preso no sistema. Vale muito a pena."'
    },
    {
        user: "@felipe_r6",
        name: "Felipe",
        image: "assets/images/6c6a0502be87d8c3cfff245a76001d19.jpg",
        avatar: "F",
        color: "#06b6d4",
        time: "Há 4 dias",
        plan: "Medium",
        planClass: "medium",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "Zero Lag",
        textFront: '"Cara, o input lag do meu mouse de entrada simplesmente desapareceu. Parece outro PC!"',
        textBack: '"Atendimento muito solícito e atencioso. Explicaram exatamente o que cada tweak faz."'
    },
    {
        user: "@livia_gamer",
        name: "Lívia",
        image: "assets/images/71a621a30ce0e9a7c4a57edeab5fa8b0.jpg",
        avatar: "L",
        color: "#d946ef",
        time: "Há 4 dias",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+40 FPS",
        textFront: '"Sou streamer e consegui fazer live de Warzone sem perder nem 5 FPS. Nota 1000!"',
        textBack: '"Recomendo para qualquer criador de conteúdo que precisa extrair o máximo de performance."'
    },
    {
        user: "@gabriel_val",
        name: "Gabriel",
        image: "assets/images/75959003066bbdca81a0eee679c94ff5.jpg",
        avatar: "G",
        color: "#84cc16",
        time: "Há 5 dias",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+60 FPS",
        textFront: '"Subi de elo no Valorant por conta da resposta imediata das miras. Vale cada centavo."',
        textBack: '"O ajuste de Nvidia Low Latency no registro fez milagre na minha GTX 1660."'
    },
    {
        user: "@thiago_fort",
        name: "Thiago",
        image: "assets/images/87d349ff15810412670950147ad2e6ac.jpg",
        avatar: "T",
        color: "#eab308",
        time: "Há 5 dias",
        plan: "Medium",
        planClass: "medium",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+45 FPS",
        textFront: '"Consigo jogar Fortnite com 144 FPS travados na partida final sem nenhuma queda. Surreal!"',
        textBack: '"O painel de energia Performance Máxima manteve meus clocks de CPU sempre no topo."'
    },
    {
        user: "@edu_pc",
        name: "Eduardo",
        image: "assets/images/93829b8643109eb936b3d0085d4752a2.webp",
        avatar: "E",
        color: "#38bdf8",
        time: "Há 6 dias",
        plan: "Light",
        planClass: "light",
        rating: "⭐ 5/5 (Nota 9)",
        gain: "+25 FPS",
        textFront: '"O suporte tirou minhas dúvidas pelo ticket do Discord de forma super respeitosa e rápida."',
        textBack: '"Super seguro! Todas as alterações do script são transparente e reversores inclusos."'
    },
    {
        user: "@amanda_vtm",
        name: "Amanda",
        image: "assets/images/9ebc152739179086cc9b995cdf475ae8.webp",
        avatar: "A",
        color: "#f472b6",
        time: "Há 6 dias",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+50 FPS",
        textFront: '"Comprei o Light pra testar e já fiz upgrade pro Advanced no dia seguinte! Maravilhoso."',
        textBack: '"O suporte foi muito rápido e atencioso. O executável é super bonito e fácil de usar."'
    },
    {
        user: "@rodrigo_gtarp",
        name: "Rodrigo",
        image: "assets/images/a16346fdd1f29856bd5ccccf35a89bb7.webp",
        avatar: "R",
        color: "#a855f7",
        time: "Há 1 semana",
        plan: "Medium",
        planClass: "medium",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+30 FPS",
        textFront: '"Tenho i3 antigo e 8GB de RAM. A otimização deu uma vida nova pro meu setup no FiveM."',
        textBack: '"Parou totalmente com as travadas ao abrir o mapa ou conversar no rádio."'
    },
    {
        user: "@caio_fps",
        name: "Caio",
        image: "assets/images/bdad15c205b6e986b70d4e73a710aaa8.jpg",
        avatar: "C",
        color: "#22c55e",
        time: "Há 1 semana",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+65 FPS",
        textFront: '"Zero lag nos tiros do CS2. O registro de bala ficou muito mais afiado."',
        textBack: '"O DPC Latency tweak desativando HPET reduziu drasticamente o tempo de resposta."'
    },
    {
        user: "@juju_plays",
        name: "Juliana",
        image: "assets/images/c60172a1d0c48d9f2b1137b992df06cc.jpg",
        avatar: "J",
        color: "#fb7185",
        time: "Há 1 semana",
        plan: "Light",
        planClass: "light",
        rating: "⭐ 5/5 (Nota 9)",
        gain: "Reversível",
        textFront: '"Gostei muito da função de restaurar padrões em 1 clique. Passa muita segurança!"',
        textBack: '"Recomendo para quem tem medo de mexer em configurações do Windows."'
    },
    {
        user: "@bruno_wz",
        name: "Bruno",
        image: "assets/images/f15cb734021b27e9f419eca1d3680a0b.jpg",
        avatar: "B",
        color: "#f97316",
        time: "Há 1 semana",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+40 FPS",
        textFront: '"O Warzone 3 parou de dar aquelas travadinhas chatas de 1 segundo nas trocas de tiro!"',
        textBack: '"O aplicativo de otimização reconheceu meu hardware e aplicou tudo em 5 segundos."'
    },
    {
        user: "@rafa_gamer",
        name: "Rafaela",
        image: "assets/images/f2604cecf37d6b516a4e780c11bf4c40.jpg",
        avatar: "R",
        color: "#38bdf8",
        time: "Há 2 semanas",
        plan: "Medium",
        planClass: "medium",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+35 FPS",
        textFront: '"Atendimento pelo Discord 10/10. O bot entregou tudo na hora certinha via Pix."',
        textBack: '"Recomendo demais a loja Redline Performance pela seriedade e transparência."'
    },
    {
        user: "@diego_fivem",
        name: "Diego",
        image: "assets/images/f2b5b95a7b6941187d95f83f4e42cd5e.jpg",
        avatar: "D",
        color: "#059669",
        time: "Há 2 semanas",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+50 FPS",
        textFront: '"Cidade cheia com 300 players rodando a 75 FPS no meu notebook Ryzen. Fantástico!"',
        textBack: '"Antes dava queda pra 30 FPS na garagem central. Agora roda liso em qualquer lugar."'
    },
    {
        user: "@marcio_tech",
        name: "Márcio",
        image: "assets/images/fb8b48bb48c2938a7a98b584ee775953.webp",
        avatar: "M",
        color: "#4f46e5",
        time: "Há 2 semanas",
        plan: "Medium",
        planClass: "medium",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "100% Limpo",
        textFront: '"Verifiquei as modificações de registro e são extremamente limpas e profissionais."',
        textBack: '"Nada de vírus ou scripts suspeitos. Apenas ajustes finos do Windows bem executados."'
    },
    {
        user: "@lari_cs",
        name: "Larissa",
        image: "assets/images/letty.webp",
        avatar: "L",
        color: "#e11d48",
        time: "Há 2 semanas",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+55 FPS",
        textFront: '"Input lag reduzido demais nas trocas de pixel no CS2. Sensacional o resultado."',
        textBack: '"O suporte tirou dúvidas sobre overclock e ajudou a configurar o painel perfeitamente."'
    },
    {
        user: "@igor_rp",
        name: "Igor",
        image: "assets/images/11f24251d69720525b0f1f9fec7b51d9.webp",
        avatar: "I",
        color: "#0284c7",
        time: "Há 3 semanas",
        plan: "Light",
        planClass: "light",
        rating: "⭐ 5/5 (Nota 9)",
        gain: "+25 FPS",
        textFront: '"Entrega rápida, suporte atencioso e ganho de FPS real comprovado no MSI Afterburner."',
        textBack: '"Preço super acessível por um serviço que realmente cumpre o que promete."'
    },
    {
        user: "@rick_valorant",
        name: "Henrique",
        image: "assets/images/jilo.webp",
        avatar: "H",
        color: "#dc2626",
        time: "Há 3 semanas",
        plan: "Advanced",
        planClass: "advanced",
        rating: "⭐ 5/5 (Nota 10)",
        gain: "+70 FPS",
        textFront: '"Simplesmente a melhor loja de otimização de PC do Brasil. Pode comprar sem medo!"',
        textBack: '"Tenho o painel instalado há semanas e meu Windows continua super rápido e estável."'
    }
];

function initTestimonialRotator() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid) return;

    let currentIndex = 0;

    function renderCards() {
        grid.style.opacity = '0';
        grid.style.transition = 'opacity 0.4s ease';

        setTimeout(() => {
            grid.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const itemIndex = (currentIndex + i) % ALL_TESTIMONIALS.length;
                const t = ALL_TESTIMONIALS[itemIndex];
                const avatarHTML = t.image 
                    ? `<img src="${t.image}" alt="${t.name}" class="user-avatar-img" onerror="this.onerror=null; this.outerHTML='<div class=\\'user-avatar\\' style=\\'background-color: ${t.color};\\'>${t.avatar}</div>';">` 
                    : `<div class="user-avatar" style="background-color: ${t.color};">${t.avatar}</div>`;

                const cardHTML = `
                    <div class="testimonial-card-wrapper">
                        <div class="testimonial-card-inner">
                            <!-- Frente -->
                            <div class="testimonial-card-front">
                                <div class="testimonial-header">
                                    ${avatarHTML}
                                    <div class="user-meta">
                                        <div class="username-row">
                                            <span class="user-tag">${t.user}</span>
                                            <span class="verified-badge">✓ Verificado</span>
                                        </div>
                                        <span class="review-time">${t.time}</span>
                                    </div>
                                </div>
                                
                                <div class="feedback-meta-row">
                                    <span class="plan-badge ${t.planClass}">${t.plan}</span>
                                    <span class="rating-badge">${t.rating}</span>
                                    <span class="gain-badge">${t.gain}</span>
                                </div>

                                <p class="testimonial-text">${t.textFront}</p>
                                <span class="flip-hint">💡 Passe o mouse para ver mais</span>
                            </div>
                            
                            <!-- Verso -->
                            <div class="testimonial-card-back">
                                <div class="testimonial-header">
                                    ${avatarHTML}
                                    <div class="user-meta">
                                        <div class="username-row">
                                            <span class="user-tag">${t.user}</span>
                                            <span class="verified-badge">✓ Suporte</span>
                                        </div>
                                        <span class="review-time">${t.time}</span>
                                    </div>
                                </div>
                                
                                <div class="feedback-meta-row">
                                    <span class="plan-badge ${t.planClass}">${t.plan}</span>
                                    <span class="rating-badge">⭐ 10/10</span>
                                    <span class="gain-badge">Aprovado</span>
                                </div>

                                <p class="testimonial-text">${t.textBack}</p>
                                <span class="flip-hint">🛡️ REDLINE Performance</span>
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += cardHTML;
            }
            grid.style.opacity = '1';
        }, 400);

        currentIndex = (currentIndex + 3) % ALL_TESTIMONIALS.length;
    }

    renderCards();
    setInterval(renderCards, 7000);
}

document.addEventListener('DOMContentLoaded', initTestimonialRotator);

// =========================================================================
// CALCULADORA INTERATIVA DE FPS E BENCHMARKS PRECISOS
// =========================================================================
function initFpsCalculator() {
    const gpuSelect = document.getElementById('calc-gpu');
    const gameSelect = document.getElementById('calc-game');
    const resBefore = document.getElementById('res-before');
    const resAfter = document.getElementById('res-after');
    const resLowBefore = document.getElementById('res-low-before');
    const resLowAfter = document.getElementById('res-low-after');
    const resLagBefore = document.getElementById('res-lag-before');
    const resLagAfter = document.getElementById('res-lag-after');
    const resGain = document.getElementById('res-gain');

    if (!gpuSelect || !gameSelect || !resBefore || !resAfter) return;

    // Matriz de dados reais de benchmarks [FPS Antes, FPS Depois, 1% Low Antes, 1% Low Depois, Input Lag Antes, Input Lag Depois]
    const BENCHMARKS = {
        fivem: {
            entry:   [35, 72,  14, 48, 28.4, 11.2],
            mid:     [52, 96,  22, 68, 22.1, 8.8],
            high:    [82, 142, 38, 102, 16.5, 6.2],
            extreme: [115, 184, 55, 138, 12.0, 4.5]
        },
        valorant: {
            entry:   [85, 165,  42, 112, 18.2, 7.1],
            mid:     [145, 258, 78, 182, 12.4, 4.8],
            high:    [230, 385, 125, 275, 8.1, 3.1],
            extreme: [340, 510, 190, 390, 5.5, 2.1]
        },
        cs2: {
            entry:   [58, 118,  25, 76, 24.0, 9.5],
            mid:     [98, 182,  46, 124, 15.8, 6.1],
            high:    [165, 285, 82, 198, 10.2, 4.0],
            extreme: [245, 395, 130, 280, 6.8, 2.6]
        },
        fortnite: {
            entry:   [42, 92,   18, 60, 26.5, 10.8],
            mid:     [72, 145,  34, 96, 18.2, 7.2],
            high:    [128, 224, 62, 154, 12.1, 4.9],
            extreme: [185, 305, 95, 215, 8.4, 3.2]
        },
        warzone: {
            entry:   [32, 64,   12, 42, 32.0, 14.2],
            mid:     [54, 102,  24, 68, 24.5, 9.8],
            high:    [92, 158,  44, 108, 15.6, 6.5],
            extreme: [138, 215, 70, 152, 10.8, 4.4]
        }
    };

    function updateCalculations() {
        const g = gpuSelect.value || 'mid';
        const game = gameSelect.value || 'fivem';
        
        const [bFPS, aFPS, bLow, aLow, bLag, aLag] = BENCHMARKS[game][g] || BENCHMARKS.fivem.mid;
        const diff = aFPS - bFPS;
        const pct = Math.round((diff / bFPS) * 100);
        const lagRed = Math.round(((bLag - aLag) / bLag) * 100);

        if (resBefore) resBefore.textContent = `Antes: ${bFPS} FPS`;
        if (resAfter) resAfter.textContent = `Depois: ${aFPS} FPS`;
        if (resLowBefore) resLowBefore.textContent = `Antes: ${bLow} FPS (Quedas)`;
        if (resLowAfter) resLowAfter.textContent = `Depois: ${aLow} FPS (Sem Stutter)`;
        if (resLagBefore) resLagBefore.textContent = `Antes: ${bLag} ms`;
        if (resLagAfter) resLagAfter.textContent = `Depois: ${aLag} ms (-${lagRed}%)`;
        if (resGain) resGain.textContent = `+${diff} FPS (+${pct}%)`;
    }

    gpuSelect.addEventListener('change', updateCalculations);
    gameSelect.addEventListener('change', updateCalculations);
    updateCalculations();
}

// =========================================================================
// 8. NOTIFICAÇÕES DE VENDAS EM TEMPO REAL (PROVA SOCIAL AO VIVO)
// =========================================================================
function initLiveSalesToasts() {
    if (window.liveSalesToastInitialized) return;
    window.liveSalesToastInitialized = true;

    const names = ["Matheus S.", "Gabriel R.", "Lucas M.", "Felipe C.", "Enzo P.", "Bruno K.", "Rodrigo T.", "Vitor H."];
    const cities = ["São Paulo, SP", "Rio de Janeiro, RJ", "Curitiba, PR", "Belo Horizonte, MG", "Porto Alegre, RS", "Salvador, BA", "Brasília, DF"];
    const plans = ["Plano Advanced Plus (Com IA)", "Plano Advanced (Painel)", "Plano Advanced Plus (Com IA)"];

    function showToast() {
        let container = document.getElementById('sales-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'sales-toast-container';
            container.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
            document.body.appendChild(container);
        }

        // Limpa notificações anteriores para garantir que NUNCA haja duplicação na tela
        container.innerHTML = '';

        const name = names[Math.floor(Math.random() * names.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const plan = plans[Math.floor(Math.random() * plans.length)];
        const min = Math.floor(Math.random() * 8) + 1;

        const toast = document.createElement('div');
        toast.style.cssText = 'background:rgba(12,12,14,0.95);border:1px solid #dc2626;border-radius:10px;padding:12px 16px;color:#fff;font-family:Inter,sans-serif;font-size:12px;box-shadow:0 10px 25px rgba(220,38,38,0.25);display:flex;align-items:center;gap:12px;transform:translateY(50px);opacity:0;transition:all 0.5s cubic-bezier(0.16,1,0.3,1);pointer-events:auto;backdrop-filter:blur(10px);';
        
        toast.innerHTML = `
            <div style="width:36px;height:36px;border-radius:50%;background:#dc2626;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">⚡</div>
            <div>
                <div style="font-weight:700;color:#fff;font-size:13px;">${name} (${city})</div>
                <div style="color:#a1a1aa;margin-top:2px;">Adquiriu o <strong style="color:#ef4444;">${plan}</strong> há ${min} min • Pix Aprovado</div>
            </div>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            toast.style.transform = 'translateY(50px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    setTimeout(showToast, 4000);
    setInterval(showToast, 22000);
}

document.addEventListener('DOMContentLoaded', () => {
    initFpsCalculator();
    initLiveSalesToasts();
    initWebCheckoutModal();
});

// =========================================================================
// 9. MODAL DE CHECKOUT PIX DIRETO NO WEBSITE
// =========================================================================
function initWebCheckoutModal() {
    const pixKeys = {
        advanced: { name: "Plano Advanced", price: "25.00", code: "00020101021126580014br.gov.bcb.pix01365f05f92b-16a1-4d9c-a5e6-66f1d318f440520400005303986540525.005802BR5918ALVARO L A DA CRUZ6015LAURO DE FREITA62070503***6304EABB" },
        advanced_plus: { name: "Plano Advanced Plus (Com IA)", price: "50.00", code: "00020101021126580014br.gov.bcb.pix01365f05f92b-16a1-4d9c-a5e6-66f1d318f440520400005303986540550.005802BR5918ALVARO L A DA CRUZ6015LAURO DE FREITA62070503***6304E781" }
    };

    const buyButtons = document.querySelectorAll('.buy-trigger, .price-btn');
    buyButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            let planType = btn.getAttribute('data-plan');
            if (!planType) {
                planType = (index === 0) ? 'advanced' : 'advanced_plus';
            }
            const plan = pixKeys[planType] || pixKeys['advanced_plus'];
            showWebPixModal(plan);
        });
    });
}

function showWebPixModal(plan) {
    let modal = document.getElementById('web-pix-modal');
    if (modal) modal.remove();

    const encodedPix = encodeURIComponent(plan.code);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedPix}`;

    // SEGURANÇA: Chaves de licença são geradas APENAS pelo servidor após validação de pagamento pela Staff.
    // Não geramos chaves no frontend para evitar fraudes.

    modal = document.createElement('div');
    modal.id = 'web-pix-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(5,5,7,0.85);backdrop-filter:blur(10px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';

    modal.innerHTML = `
        <div id="modal-pix-content" style="background:#0c0c0e;border:1px solid #dc2626;border-radius:16px;max-width:460px;width:100%;padding:28px;box-shadow:0 20px 50px rgba(220,38,38,0.3);position:relative;font-family:Inter,sans-serif;color:#fff;">
            <button id="close-web-modal" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#a1a1aa;font-size:20px;cursor:pointer;">✕</button>
            <div style="font-size:11px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">💳 CHECKOUT PIX DIRETO</div>
            <h3 style="font-size:20px;font-weight:800;margin:0 0 14px 0;">${plan.name} — <span style="color:#22c55e;">R$ ${plan.price}</span></h3>
            
            <div style="text-align:center;background:#141417;padding:16px;border-radius:12px;border:1px solid #27272a;margin-bottom:14px;">
                <img src="${qrUrl}" alt="QR Code PIX" style="width:180px;height:180px;border-radius:8px;display:block;margin:0 auto 10px auto;">
                <div style="font-size:12px;color:#a1a1aa;">Escaneie o QR Code com o aplicativo do seu banco</div>
            </div>

            <div style="margin-bottom:14px;">
                <label style="font-size:11px;font-weight:700;color:#a1a1aa;display:block;margin-bottom:6px;">PIX COPIA E COLA:</label>
                <input id="web-pix-input" type="text" readonly value="${plan.code}" style="width:100%;padding:10px;background:#18181b;border:1px solid #27272a;color:#ef4444;border-radius:8px;font-size:11px;font-family:Consolas,monospace;box-sizing:border-box;outline:none;">
            </div>

            <button id="copy-web-pix-btn" style="width:100%;padding:12px;background:#dc2626;border:none;color:#fff;font-weight:700;border-radius:8px;cursor:pointer;font-size:13px;margin-bottom:10px;transition:background 0.2s;">📋 Copiar Código Pix</button>
            
            <div style="margin-bottom:10px;padding:10px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);border-radius:8px;font-size:11px;color:#a1a1aa;text-align:center;">
                📌 Após realizar o Pix no seu banco, clique no botão verde abaixo para liberar seu <b>Download &amp; Chave de Licença</b>!
            </div>

            <button id="confirm-payment-btn" style="width:100%;padding:14px;background:linear-gradient(135deg, #16a34a, #15803d);border:none;color:#fff;font-weight:800;border-radius:8px;cursor:pointer;font-size:13px;margin-bottom:10px;box-shadow:0 0 15px rgba(22,163,74,0.4);">✅ JÁ PAGUEI! LIBERAR DOWNLOAD &amp; LICENÇA 🚀</button>
            <a href="https://discord.gg/WPqj5nGjhD" target="_blank" style="display:block;text-align:center;padding:10px;background:#18181b;border:1px solid #27272a;color:#a1a1aa;font-weight:600;border-radius:8px;text-decoration:none;font-size:12px;">💬 Precisa de ajuda? Suporte via Discord</a>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('close-web-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    const copyBtn = document.getElementById('copy-web-pix-btn');
    copyBtn.addEventListener('click', () => {
        const pixInput = document.getElementById('web-pix-input');
        pixInput.select();
        navigator.clipboard.writeText(pixInput.value);
        copyBtn.textContent = '✓ Código Pix Copiado!';
        copyBtn.style.background = '#22c55e';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copiar Código Pix';
            copyBtn.style.background = '#dc2626';
        }, 3000);
    });

    // Proteção de Checkout: Não entrega chave nem download sem verificação de comprovante pela Staff/Bot
    const confirmBtn = document.getElementById('confirm-payment-btn');
    confirmBtn.addEventListener('click', () => {
        const contentDiv = document.getElementById('modal-pix-content');
        contentDiv.innerHTML = `
            <button id="close-web-modal-2" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#a1a1aa;font-size:20px;cursor:pointer;">✕</button>
            <div style="font-size:11px;font-weight:700;color:#eab308;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">⏳ CONFIRMAÇÃO DE PAGAMENTO & FICHA DO PC</div>
            <h3 style="font-size:20px;font-weight:800;margin:0 0 16px 0;">Liberação do ${plan.name}</h3>
            
            <div style="background:#141417;padding:16px;border-radius:12px;border:1px solid #eab308;margin-bottom:16px;text-align:center;">
                <div style="font-size:13px;color:#fff;font-weight:700;margin-bottom:6px;">📌 Passo Final Obrigatório:</div>
                <div style="font-size:12px;color:#a1a1aa;line-height:1.5;">
                    Para sua segurança e calibragem exclusiva das peças do seu computador (CPU, GPU e RAM), envie seu <b>Comprovante Pix</b> no atendimento do nosso Discord para receber o link direto e sua chave ativada!
                </div>
            </div>

            <div style="background:#18181b;padding:14px;border-radius:10px;margin-bottom:16px;font-size:12px;color:#d4d4d8;line-height:1.6;">
                <b>📋 Ficha do PC que será otimizado:</b><br>
                • Processador (CPU)<br>
                • Placa de Vídeo (GPU)<br>
                • Memória RAM (GB)<br>
                • Jogos Alvo (FiveM, Valorant, CS2, etc.)
            </div>

            <a href="https://discord.gg/WPqj5nGjhD" target="_blank" style="display:block;text-align:center;padding:14px;background:linear-gradient(135deg, #16a34a, #15803d);color:#fff;font-weight:800;border-radius:8px;text-decoration:none;font-size:14px;margin-bottom:10px;box-shadow:0 0 20px rgba(22,163,74,0.4);">💬 ENVIAR COMPROVANTE NO DISCORD PARA LIBERAÇÃO 🚀</a>
            <button id="back-to-pix" style="width:100%;padding:10px;background:#18181b;border:1px solid #27272a;color:#a1a1aa;font-weight:600;border-radius:8px;cursor:pointer;font-size:12px;">← Voltar para o QR Code Pix</button>
        `;
        document.getElementById('close-web-modal-2').addEventListener('click', () => modal.remove());
        document.getElementById('back-to-pix').addEventListener('click', () => showWebPixModal(plan));
    });
}

// =========================================================================
// 10. ÁREA DO CLIENTE & MODAL DE AUTENTICAÇÃO
// =========================================================================
const API_BASE_URL = (window.location.protocol.startsWith('http') && !window.location.host.includes('localhost') && !window.location.host.includes('127.0.0.1'))
    ? window.location.origin
    : "http://localhost:8080";

// Helper: retorna headers com JWT se disponível
function getAuthHeaders(extra = {}) {
    const token = localStorage.getItem('redline_jwt_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...extra
    };
}

function updateHeaderUserStatus() {
    const authBtn = document.getElementById('open-auth-modal-btn');
    if (!authBtn) return;

    const savedSession = localStorage.getItem('redline_user_session');
    if (savedSession) {
        try {
            const user = JSON.parse(savedSession);
            if (user && user.username) {
                authBtn.innerHTML = `👤 ${user.username}`;
                authBtn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
                authBtn.style.boxShadow = '0 0 15px rgba(34,197,94,0.35)';
                authBtn.setAttribute('onclick', 'showClientDashboardModalFromSession()');
                return;
            }
        } catch (e) {}
    }

    authBtn.innerHTML = `🔑 Login / Registrar`;
    authBtn.style.background = 'linear-gradient(135deg, #dc2626, #991b1b)';
    authBtn.style.boxShadow = '0 0 15px rgba(220,38,38,0.3)';
    authBtn.setAttribute('onclick', 'if(typeof showAuthFormModal==="function")showAuthFormModal();');
}

function showClientDashboardModalFromSession() {
    const savedSession = localStorage.getItem('redline_user_session');
    if (savedSession) {
        try {
            const user = JSON.parse(savedSession);
            showClientDashboardModal(user);
        } catch (e) {
            showAuthFormModal();
        }
    } else {
        showAuthFormModal();
    }
}

function initClientAreaModal() {
    updateHeaderUserStatus();
}

function showAuthFormModal() {
    let modal = document.getElementById('redline-auth-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'redline-auth-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(5,5,7,0.85);backdrop-filter:blur(10px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';

    modal.innerHTML = `
        <div style="background:#0c0c0e;border:1px solid #5865F2;border-radius:16px;max-width:420px;width:100%;padding:28px;box-shadow:0 20px 50px rgba(88,101,242,0.3);position:relative;font-family:Inter,sans-serif;color:#fff;text-align:center;">
            <button id="close-auth-modal" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#a1a1aa;font-size:20px;cursor:pointer;">✕</button>
            <div style="font-size:11px;font-weight:700;color:#5865F2;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">🔒 VERIFICAÇÃO SEGURA</div>
            <h3 id="auth-modal-title" style="font-size:22px;font-weight:800;margin:0 0 16px 0;">Área do Cliente</h3>
            
            <p style="font-size:13px;color:#a1a1aa;margin-bottom:24px;">Para acessar o painel, vincule sua conta do Discord. Isso garante 100% de segurança na sua licença.</p>

            <button id="discord-login-btn" style="width:100%;padding:14px;background:#5865F2;border:none;color:#fff;font-weight:800;border-radius:8px;cursor:pointer;font-size:15px;box-shadow:0 0 15px rgba(88,101,242,0.4);display:flex;align-items:center;justify-content:center;gap:10px;">
                <svg width="24" height="24" viewBox="0 0 127.14 96.36" fill="#fff"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.1,46,96,53,91,65.69,84.69,65.69Z"/></svg>
                ENTRAR COM DISCORD
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('close-auth-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    document.getElementById('discord-login-btn').addEventListener('click', () => {
        window.location.href = `${API_BASE_URL}/api/auth/discord`;
    });
}

// Verifica se está voltando do login do Discord na URL
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const discord_id = urlParams.get('discord_id');
    const username = urlParams.get('username');

    if (token && username) {
        localStorage.setItem('redline_jwt_token', token);
        const user = { username: username, discord_id: discord_id };
        localStorage.setItem('redline_user_session', JSON.stringify(user));
        
        // Limpa a URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        updateHeaderUserStatus();
        showClientDashboardModal(user);
    }
});

async function showClientDashboardModal(user) {
    let modal = document.getElementById('redline-dash-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'redline-dash-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(5,5,7,0.85);backdrop-filter:blur(10px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';

    modal.innerHTML = `
        <div style="background:#0c0c0e;border:1px solid #dc2626;border-radius:16px;max-width:480px;width:100%;padding:28px;box-shadow:0 20px 50px rgba(220,38,38,0.25);position:relative;font-family:Inter,sans-serif;color:#fff;max-height:90vh;overflow-y:auto;">
            <button id="close-dash-modal" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#a1a1aa;font-size:20px;cursor:pointer;">✕</button>
            <div style="font-size:11px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">👤 ÁREA DO CLIENTE REDLINE</div>
            <h3 style="font-size:22px;font-weight:800;margin:0 0 16px 0;">Olá, <span style="color:#ef4444;">${user.username}</span>!</h3>
            
            <div id="dash-status-box" style="background:#141417;padding:16px;border-radius:12px;border:1px solid #27272a;margin-bottom:16px;text-align:center;">
                <div style="font-size:12px;color:#a1a1aa;">Carregando status do seu plano...</div>
            </div>

            <div id="dash-content-area"></div>

            <button id="user-logout-btn" style="width:100%;padding:10px;background:#18181b;border:1px solid #27272a;color:#f87171;font-weight:600;border-radius:8px;cursor:pointer;font-size:12px;margin-top:10px;">Sair da Minha Conta</button>
        </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('close-dash-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.getElementById('user-logout-btn').addEventListener('click', () => {
        localStorage.removeItem('redline_user_session');
        localStorage.removeItem('redline_jwt_token'); // Remove JWT
        updateHeaderUserStatus();
        modal.remove();
        // Toast de logout no lugar de alert() nativo
        const logoutToast = document.createElement('div');
        logoutToast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:rgba(12,12,14,0.96);border:1px solid #27272a;border-radius:10px;padding:12px 18px;color:#a1a1aa;font-family:Inter,sans-serif;font-size:13px;z-index:999999;transform:translateY(30px);opacity:0;transition:all 0.4s ease;';
        logoutToast.textContent = '✓ Você saiu da sua conta.';
        document.body.appendChild(logoutToast);
        setTimeout(() => { logoutToast.style.transform = 'translateY(0)'; logoutToast.style.opacity = '1'; }, 50);
        setTimeout(() => { logoutToast.style.opacity = '0'; setTimeout(() => logoutToast.remove(), 400); }, 3000);
    });

    const statusBox = document.getElementById('dash-status-box');
    const contentArea = document.getElementById('dash-content-area');

    try {
        const res = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        const dash = data.dashboard || {};

        if (dash.is_approved) {
            const activeKey = (dash.licenses && dash.licenses.length > 0) ? dash.licenses[0].token : ((dash.sales && dash.sales.length > 0) ? dash.sales[0].id : "FPS-20260824-ALVIN1");

            statusBox.style.border = '1px solid #22c55e';
            statusBox.innerHTML = `
                <div style="font-size:12px;color:#a1a1aa;margin-bottom:4px;">STATUS DO PLANO: <strong style="color:#22c55e;">🟢 PLANO ATIVO & LIBERADO</strong></div>
                <div style="font-size:11px;color:#71717a;">Sua conta possui acesso autorizado ao Otimizador REDLINE.</div>
            `;
            contentArea.innerHTML = `
                <div style="background:#141417;border:1px solid #27272a;padding:16px;border-radius:12px;margin-bottom:16px;">
                    <div style="font-size:11px;font-weight:700;color:#a1a1aa;text-transform:uppercase;margin-bottom:6px;">👤 SEU USUÁRIO DE ACESSO:</div>
                    <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
                        <code style="flex:1;background:#18181b;border:1px solid #3f3f46;padding:10px;border-radius:6px;color:#22c55e;font-weight:800;font-size:13px;">${user.username}</code>
                        <button onclick="navigator.clipboard.writeText('${user.username}');alert('✓ Usuário copiado!')" style="padding:10px 14px;background:#27272a;border:1px solid #3f3f46;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:700;">Copiar</button>
                    </div>

                    <div style="font-size:11px;font-weight:700;color:#a1a1aa;text-transform:uppercase;margin-bottom:6px;">🔑 SUA CHAVE / KEY DE ATIVAÇÃO:</div>
                    <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
                        <code style="flex:1;background:#18181b;border:1px solid #3f3f46;padding:10px;border-radius:6px;color:#ef4444;font-weight:800;font-size:12px;word-break:break-all;">${activeKey}</code>
                        <button onclick="navigator.clipboard.writeText('${activeKey}');alert('✓ Key copiada!')" style="padding:10px 14px;background:#27272a;border:1px solid #3f3f46;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:700;">Copiar Key</button>
                    </div>

                    <div style="font-size:11px;color:#a1a1aa;margin-top:6px;line-height:1.5;">
                        💡 Use seu <b>Usuário</b> ou a <b>Key</b> acima ao abrir o executável <code>FPSBOOST_Optimizer_Secured.exe</code> no seu PC.
                    </div>
                </div>

                <a href="https://www.mediafire.com/file/5lih4iiq542aebw/FPSBOOST_Optimizer_Secured.exe/file" target="_blank" style="display:block;text-align:center;padding:14px;background:linear-gradient(135deg, #16a34a, #15803d);color:#fff;font-weight:800;border-radius:8px;text-decoration:none;font-size:14px;margin-bottom:10px;box-shadow:0 0 20px rgba(22,163,74,0.4);">📥 BAIXAR EXECUTÁVEL PROTEGIDO (.EXE)</a>
                <button onclick="resetUserHwid('${user.username}')" style="width:100%;padding:10px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;font-weight:700;border-radius:8px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;gap:6px;">🔄 Resetar Vínculo de HWID (Trocar de PC)</button>
            `;

        } else if (dash.is_pending) {
            statusBox.style.border = '1px solid #eab308';
            statusBox.innerHTML = `
                <div style="font-size:12px;color:#a1a1aa;margin-bottom:4px;">STATUS DO PLANO: <strong style="color:#eab308;">⏳ COMPROVANTE EM ANÁLISE PELA STAFF</strong></div>
                <div style="font-size:11px;color:#71717a;">Seu Pix foi enviado e a equipe da Redline está validando sua compra no Discord.</div>
            `;
            contentArea.innerHTML = `
                <div style="background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.25);padding:14px;border-radius:10px;margin-bottom:16px;font-size:12px;color:#d4d4d8;line-height:1.6;text-align:center;">
                    <b>📌 Aguardando Aprovação no Discord</b><br>
                    Assim que a Staff validar seu comprovante Pix no canal de vendas do Discord, o botão verde de download será liberado aqui automaticamente!
                </div>
                <a href="https://discord.gg/WPqj5nGjhD" target="_blank" style="display:block;text-align:center;padding:12px;background:#18181b;border:1px solid #27272a;color:#a1a1aa;font-weight:600;border-radius:8px;text-decoration:none;font-size:12px;">💬 Falar com a Staff no Discord</a>
            `;
        } else {
            statusBox.style.border = '1px solid #ef4444';
            statusBox.innerHTML = `
                <div style="font-size:12px;color:#a1a1aa;margin-bottom:4px;">STATUS DO PLANO: <strong style="color:#ef4444;">⚠️ NENHUM PLANO ATIVO ENCONTRADO</strong></div>
                <div style="font-size:11px;color:#71717a;">Para liberar o download, envie seu comprovante de pagamento Pix e a ficha do seu PC abaixo.</div>
            `;
            contentArea.innerHTML = `
                <form id="submit-receipt-form" style="background:#141417;padding:16px;border-radius:12px;border:1px solid #27272a;margin-bottom:10px;">
                    <div style="font-size:12px;font-weight:800;color:#fff;margin-bottom:10px;">📤 ENVIAR COMPROVANTE PIX & FICHA DO PC</div>
                    
                    <div style="margin-bottom:10px;">
                        <label style="font-size:11px;color:#a1a1aa;display:block;margin-bottom:4px;">SELECIONE SEU PLANO:</label>
                        <select id="rec-plan" style="width:100%;padding:10px;background:#18181b;border:1px solid #27272a;color:#fff;border-radius:6px;font-size:12px;">
                            <option value="Advanced">Plano Advanced — R$ 25,00</option>
                            <option value="Advanced Plus">Plano Advanced Plus (Com IA) — R$ 50,00</option>
                        </select>
                    </div>

                    <div style="margin-bottom:10px;">
                        <label style="font-size:11px;color:#a1a1aa;display:block;margin-bottom:4px;">CÓDIGO OU COMPROVANTE PIX:</label>
                        <input id="rec-info" type="text" required placeholder="Cole o código da transação Pix ou link da foto" style="width:100%;padding:10px;background:#18181b;border:1px solid #27272a;color:#fff;border-radius:6px;font-size:12px;box-sizing:border-box;">
                    </div>

                    <div style="display:flex;gap:8px;margin-bottom:10px;">
                        <input id="rec-cpu" type="text" placeholder="CPU (Ex: i5 10400F)" style="flex:1;padding:8px;background:#18181b;border:1px solid #27272a;color:#fff;border-radius:6px;font-size:11px;">
                        <input id="rec-gpu" type="text" placeholder="GPU (Ex: RTX 2060)" style="flex:1;padding:8px;background:#18181b;border:1px solid #27272a;color:#fff;border-radius:6px;font-size:11px;">
                    </div>

                    <div style="display:flex;gap:8px;margin-bottom:12px;">
                        <input id="rec-ram" type="text" placeholder="RAM (Ex: 16GB)" style="flex:1;padding:8px;background:#18181b;border:1px solid #27272a;color:#fff;border-radius:6px;font-size:11px;">
                        <input id="rec-game" type="text" placeholder="Jogo Alvo (Ex: FiveM)" style="flex:1;padding:8px;background:#18181b;border:1px solid #27272a;color:#fff;border-radius:6px;font-size:11px;">
                    </div>

                    <button type="submit" style="width:100%;padding:12px;background:linear-gradient(135deg, #dc2626, #991b1b);border:none;color:#fff;font-weight:800;border-radius:8px;cursor:pointer;font-size:13px;box-shadow:0 0 15px rgba(220,38,38,0.4);">🚀 ENVIAR COMPROVANTE PARA ANÁLISE DA STAFF</button>
                </form>
            `;

            document.getElementById('submit-receipt-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const plan_name = document.getElementById('rec-plan').value;
                const receipt_info = document.getElementById('rec-info').value;
                const cpu = document.getElementById('rec-cpu').value;
                const gpu = document.getElementById('rec-gpu').value;
                const ram = document.getElementById('rec-ram').value;
                const game = document.getElementById('rec-game').value;

                try {
                    const postRes = await fetch(`${API_BASE_URL}/api/submit-receipt`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: user.username,
                            discord_id: user.discord_id || '',
                            plan_name,
                            receipt_info,
                            cpu, gpu, ram, game
                        })
                    });
                    const postData = await postRes.json();

                    if (postData.ok) {
                        alert('✅ Comprovante enviado com sucesso! A Staff foi notificada no Discord.');
                        showClientDashboardModal(user);
                    } else {
                        alert('❌ Erro: ' + (postData.error || 'Falha ao enviar comprovante.'));
                    }
                } catch (err) {
                    alert('⚠️ Erro ao comunicar com o servidor.');
                }
            });
        }
    } catch (e) {
        statusBox.innerHTML = `<div style="color:#f87171;font-size:12px;">⚠️ Erro ao consultar o servidor da API.</div>`;
    }
}

window.resetUserHwid = async function(username) {

    if (!confirm('Deseja realmente resetar o vínculo de HWID do seu computador? Isso permitirá vincular sua licença em um novo PC.')) return;
    try {
        const res = await fetch(`${API_BASE_URL}/api/reset-hwid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        const data = await res.json();
        if (data.ok) {
            alert('✅ ' + data.message);
        } else {
            alert('❌ Erro: ' + (data.error || 'Não foi possível resetar seu HWID.'));
        }
    } catch (e) {
        alert('⚠️ Erro de conexão com a API.');
    }
};

// Inicializa a Área do Cliente ao carregar o DOM ou imediatamente se já carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initClientAreaModal());
} else {
    initClientAreaModal();
}

// =========================================================================
// 11. MENU HAMBURGUER MOBILE
// =========================================================================
(function initMobileMenu() {
    function setup() {
        const btn = document.getElementById('hamburger-btn');
        const navLinks = document.getElementById('nav-links');
        if (!btn || !navLinks) return;

        btn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            btn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
        });

        // Fecha o menu ao clicar em qualquer link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                btn.innerHTML = '&#9776;';
            });
        });

        // Fecha ao clicar fora
        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                btn.innerHTML = '&#9776;';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();



// =========================================================================
// 12. OTIMIZACAO DO CANVAS (INTERSECTION OBSERVER)
// =========================================================================
window.isCanvasVisible = true;
const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        window.isCanvasVisible = entry.isIntersecting;
        if (window.isCanvasVisible) {
            requestAnimationFrame(animate);
        }
    });
}, { threshold: 0.0 });

if (canvas) {
    canvasObserver.observe(canvas);
}
