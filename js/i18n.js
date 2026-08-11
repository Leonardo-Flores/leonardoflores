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
    `Sou o <strong>Leonardo Flores</strong>, desenvolvedor full-stack em São Paulo.
    Tenho 10 anos de tecnologia. Comecei em infraestrutura, passei uns anos
    automatizando TI no QuintoAndar e migrei de vez pra desenvolvimento.`,
  "about.p2":
    `Hoje sou o único engenheiro de uma empresa de varejo. Construí o PDV deles
    (que processa pagamento de verdade), os dashboards que os donos olham todo dia
    e os sistemas que rodam a fábrica — incluindo um app desktop em Rust que imprime
    etiquetas RFID. Tudo roda na AWS e sobe por CI, sem nenhuma chave guardada.
    <strong>Foram quatro sistemas em produção nos meus primeiros seis meses.</strong>`,
  "work.h2": "<span>##</span> projetos",
  "work.pos":
    `Um PDV que estou construindo aberto. Os meios de pagamento são plugins — PIX,
    cartão e dinheiro hoje, adquirentes de verdade depois. React, Hono e Postgres.`,
  "work.tf":
    `O setup de Terraform que eu uso pra fazer deploy na AWS pelo GitHub Actions sem
    guardar chave nenhuma. PR recebe um plan somente leitura, a main recebe o apply.
    Dá pra usar como template.`,
  "work.vila":
    `Um e-commerce que fiz pra uma loja de roupas. Go no backend, React na frente,
    Postgres embaixo.`,
  "work.dot":
    `Minha config de Arch + Hyprland, o mesmo desktop que este site recria.
    Catppuccin Mocha em tudo.`,
  "xp.h2": "<span>##</span> experiência",
  "xp.1":
    `<strong>Engenheiro Fundador</strong> · tech de varejo. Construo e opero tudo:
    infra, backend, frontend, o PDV, os sistemas da fábrica.`,
  "xp.2":
    `<strong>Desenvolvedor Full-Stack</strong> · Itaú, via consultoria. Portal interno
    de operações do datacenter. Python e Flask.`,
  "xp.3":
    `<strong>Engenheiro de Software</strong> · QuintoAndar. Automação e microsserviços
    internos na AWS. Provisionamento de usuário caiu de 10 minutos pra menos de 1.`,
  "xp.4":
    `<strong>Analista de Infraestrutura</strong> · QuintoAndar. Onde aprendi como os
    sistemas quebram.`,
  "contact.h2": "<span>##</span> contato",
  "contact.p":
    `Procuro vaga remota, de qualquer lugar do mundo. Também topo freelas.
    Estou em São Paulo (UTC−3). E-mail é o jeito mais rápido de falar comigo.`,
  "footer.tag": "tema: catppuccin mocha",
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
