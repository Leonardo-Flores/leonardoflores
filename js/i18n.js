// Tiny i18n: English lives in the HTML; Portuguese overrides live here.
// Elements opt in via data-i18n="key". The toggle persists in localStorage
// and the first visit follows the browser language.

const PT = {
  "menu.home": "início",
  "menu.about": "sobre",
  "menu.projects": "projetos",
  "menu.xp": "experiência",
  "menu.contact": "contato",
  "menu.resume": "currículo (pdf)",
  "hint.enter": "clique na tela para entrar ↵",
  "hint.back": "role ↓ para sair do desktop",
  "hint.skip": "pular para a versão texto ↓",
  "about.h2": "<span>##</span> sobre",
  "about.p1":
    `Sou o <strong>Leonardo Flores</strong>, engenheiro de software full-stack em São
    Paulo — 10 anos em tecnologia. Comecei em infraestrutura e migrei para
    desenvolvimento, o que moldou como eu construo software: confiabilidade,
    performance e manutenibilidade desde o primeiro commit.`,
  "about.p2":
    `Hoje sou o <strong>único engenheiro por trás de toda a plataforma de tecnologia de
    uma empresa de varejo</strong>: um PDV processando pagamentos reais (PIX, cartões,
    TEF), dashboards executivos com leituras de KPI abaixo de 100ms, um app desktop
    Rust/Tauri com RFID no chão de fábrica, e CI/CD 100% sem credenciais estáticas na
    AWS — <strong>4 produtos em produção em 6 meses</strong>. Também levei IA/LLMs para
    produção, incluindo um pipeline de IA/OCR que eliminou digitação manual na fábrica.`,
  "work.h2": "<span>##</span> projetos selecionados",
  "work.pos":
    `Sistema de PDV com provedores de pagamento plugáveis. Padrão adapter para
    PIX/cartões/dinheiro, preços congelados no momento da venda, dinheiro em centavos
    inteiros e um caminho de recusa determinístico para demos. React 19, Hono, PostgreSQL.`,
  "work.tf":
    `Deploys na AWS sem chaves a partir do GitHub Actions: confiança OIDC restrita por
    repositório e branch, plans somente-leitura em PRs, applies protegidos na main.
    Zero credenciais estáticas — use como template.`,
  "work.vila":
    `Plataforma de e-commerce com backend em Go, loja em React e PostgreSQL —
    totalmente dockerizada.`,
  "work.dot":
    `O ambiente Arch + Hyprland que este site recria — Catppuccin Mocha em tudo,
    gerenciado com GNU Stow.`,
  "xp.h2": "<span>##</span> experiência",
  "xp.1":
    `<strong>Engenheiro Full-Stack Fundador</strong> · plataforma de tecnologia para
    moda/varejo — construí a stack inteira da empresa sozinho, do Terraform ao PDV.`,
  "xp.2":
    `<strong>Desenvolvedor Full-Stack</strong> · Itaú Unibanco (via consultoria) —
    portal self-service do datacenter, Python/Flask.`,
  "xp.3":
    `<strong>Engenheiro de Software</strong> · QuintoAndar — automação Python/Node,
    microsserviços na AWS; provisionamento de usuários de ~10 min para menos de 1.`,
  "xp.4":
    `<strong>Analista de Infraestrutura de TI</strong> · QuintoAndar — de onde vêm os
    instintos de infraestrutura.`,
  "contact.h2": "<span>##</span> contato",
  "contact.p":
    `Aberto a vagas remotas no mundo todo (UTC−3, grande sobreposição com fusos dos
    EUA) e a boas conversas sobre problemas difíceis.`,
  "footer.tag": "catppuccin mocha, como tudo deveria ser",
};

export function initI18n() {
  const entries = [...document.querySelectorAll("[data-i18n]")].map((el) => ({
    el,
    key: el.dataset.i18n,
    en: el.innerHTML,
  }));
  const toggles = [...document.querySelectorAll("[data-lang-toggle]")];

  let lang =
    localStorage.getItem("lang") ||
    ((navigator.language || "").toLowerCase().startsWith("pt") ? "pt" : "en");

  function apply() {
    for (const { el, key, en } of entries) {
      el.innerHTML = lang === "pt" && PT[key] ? PT[key] : en;
    }
    for (const b of toggles) b.textContent = lang === "pt" ? "en" : "pt";
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    localStorage.setItem("lang", lang);
  }

  for (const b of toggles) {
    b.addEventListener("click", () => {
      lang = lang === "pt" ? "en" : "pt";
      apply();
    });
  }

  apply();
}
