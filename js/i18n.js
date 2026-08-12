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
    Tenho 10 anos de tecnologia. Comecei no suporte e fui automatizando o que era
    manual até que construir software virou o próprio trabalho. No QuintoAndar isso
    me levou do help desk à identidade de mais de 2.000 pessoas; quando mudei de
    função, um time de cinco pessoas assumiu as plataformas internas que eu cuidava.`,
  "about.p2":
    `Hoje sou o primeiro engenheiro de uma empresa de varejo. Construí o PDV deles
    (<strong>processou R$ 513 mil em 3.404 pedidos num evento de três dias</strong>),
    os dashboards que os donos olham todo dia e os sistemas que rodam a fábrica,
    usados por uns 30 operadores diariamente. Tudo roda na AWS e sobe por CI, sem
    nenhuma chave guardada. Quatro sistemas em produção nos meus primeiros seis meses.`,
  "work.h2": "<span>##</span> projetos",
  "work.pos":
    `Um PDV que estou construindo aberto. Os meios de pagamento são plugins: PIX,
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
    `<strong>Primeiro Engenheiro</strong> · tech de varejo. Construo e opero tudo:
    infra, backend, frontend, o PDV, os sistemas da fábrica.`,
  "xp.2":
    `<strong>Desenvolvedor Full-Stack</strong> · Itaú, via consultoria. Portal interno
    de operações do datacenter. Python e Flask.`,
  "xp.3":
    `<strong>Engenheiro de Software</strong> · QuintoAndar. Dono da identidade no
    Keycloak (350 → 2.000+ usuários, sincronizada com AD e Google Workspace).
    Migrei 2.500 pessoas pro Slack Enterprise Grid, em inglês, com o time do Slack.`,
  "xp.4":
    `<strong>Suporte → Tech Partner</strong> · QuintoAndar. Construí os service desks
    internos que cinco áreas usavam (200–300 chamados por dia). Um time de cinco
    pessoas assumiu esse trabalho depois.`,
  "contact.h2": "<span>##</span> contato",
  "contact.p":
    `Procuro vagas remotas e freelas, de qualquer lugar do mundo. Estou em
    São Paulo (UTC−3). E-mail é o jeito mais rápido de falar comigo.`,
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
    // the resume itself is a different file per language
    for (const a of document.querySelectorAll("[data-resume]")) {
      a.href = lang === "pt" ? "curriculo.pdf" : "resume.pdf";
    }
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
