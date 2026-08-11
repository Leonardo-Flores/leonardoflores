// Interactive shell for the desktop terminal. No dependencies.

const LINKS = {
  "open-pos": "https://github.com/Leonardo-Flores/open-pos",
  "oidc-starter": "https://github.com/Leonardo-Flores/terraform-aws-oidc-starter",
  vilavest: "https://github.com/Leonardo-Flores/vilavest",
  dotfiles: "https://github.com/Leonardo-Flores/dotfiles",
  github: "https://github.com/Leonardo-Flores",
  linkedin: "https://www.linkedin.com/in/leonardo-g-flores",
  resume: "resume.pdf",
};

const SECRET_LS = `<span class="t-dim">definitely-not-secrets/:</span>
<span class="t-blue">hire-leonardo.txt</span>  <span class="t-blue">world-domination-roadmap.md</span>  <span class="t-blue">salary-expectations.pdf.gpg</span>
<span class="t-dim">try: cat hire-leonardo.txt</span>`;

const SECRET_FILES = {
  "hire-leonardo.txt": `<span class="t-green">you actually explored the file system. I like you already.</span>
email <a href="mailto:leonardogoncalves.flores@gmail.com">leonardogoncalves.flores@gmail.com</a> and mention this file —
you'll skip the small talk and go straight to the good conversation.`,
  "world-domination-roadmap.md": `<span class="t-peach">step 1:</span> ship.
<span class="t-peach">step 2:</span> ship again.
<span class="t-peach">step 3:</span> <span class="t-red">[REDACTED]</span>`,
  "salary-expectations.pdf.gpg": `<span class="t-red">gpg: decryption failed</span> — that one gets discussed on a call. 😉`,
};

const NEOFETCH = `<span class="t-blue">        /\\</span>         <span class="t-mauve">leo</span>@<span class="t-mauve">arch</span>
<span class="t-blue">       /  \\</span>        ─────────────
<span class="t-blue">      /\\   \\</span>       <span class="t-peach">os</span>      arch linux, btw
<span class="t-blue">     /  __  \\</span>      <span class="t-peach">wm</span>      hyprland
<span class="t-blue">    /  (  )  \\</span>     <span class="t-peach">shell</span>   zsh + tmux
<span class="t-blue">   / __|  |__ \\</span>    <span class="t-peach">editor</span>  neovim
<span class="t-blue">  /.\`        \`.\\</span>   <span class="t-peach">theme</span>   catppuccin mocha
                   <span class="t-peach">uptime</span>  10 years in tech
                   <span class="t-peach">stack</span>   ts · react · node · python · aws`;

const COMMANDS = {
  help: () =>
    `<span class="t-dim">available commands:</span>
  <span class="t-green">whoami</span>      who is this guy
  <span class="t-green">projects</span>    what I've built
  <span class="t-green">open</span> <span class="t-dim">&lt;x&gt;</span>    open-pos · oidc-starter · vilavest · dotfiles · github · linkedin · resume
  <span class="t-green">ws</span> <span class="t-dim">&lt;1·2·3&gt;</span>  switch workspace (2 = projects, 3 = about)
  <span class="t-green">neofetch</span>    system info
  <span class="t-green">contact</span>     reach me
  <span class="t-green">clear</span>       clean this mess`,

  whoami: () =>
    `<span class="t-mauve">Leonardo Flores</span> — full-stack software engineer, São Paulo (remote worldwide).
10 years in tech: started in infrastructure, moved into development.
Currently the sole engineer behind a retail company's entire platform —
POS with live payments, factory-floor Rust/Tauri + RFID, keyless CI/CD on AWS.
<span class="t-dim">4 products shipped to production in 6 months.</span>`,

  projects: () =>
    `<span class="t-blue">open-pos</span>                    POS with pluggable payment providers
<span class="t-blue">terraform-aws-oidc-starter</span>  keyless AWS deploys, zero static credentials
<span class="t-blue">vilavest</span>                    e-commerce — Go + React + PostgreSQL
<span class="t-blue">dotfiles</span>                    this desktop, for real
<span class="t-dim">try:</span> open open-pos`,

  neofetch: () => NEOFETCH,

  contact: () =>
    `<span class="t-peach">email</span>     <a href="mailto:leonardogoncalves.flores@gmail.com">leonardogoncalves.flores@gmail.com</a>
<span class="t-peach">linkedin</span>  <a href="${LINKS.linkedin}" target="_blank" rel="noreferrer">linkedin.com/in/leonardo-g-flores</a>
<span class="t-peach">github</span>    <a href="${LINKS.github}" target="_blank" rel="noreferrer">github.com/Leonardo-Flores</a>`,

  ls: () => `<span class="t-blue">projects</span>  <span class="t-blue">dotfiles</span>  about.md  resume.pdf  <span class="t-dim">definitely-not-secrets/</span>`,

  pwd: () => `/home/leo`,

  "definitely-not-secrets": () => SECRET_LS,

  hyprctl: () => `<span class="t-dim">3 windows · gaps_in 0 · gaps_out 0 · rounding 0 — as it should be</span>`,

  vim: () => `<span class="t-dim">this terminal is fake, but the vim addiction is real. (:q to imagine leaving)</span>`,

  exit: () => `<span class="t-dim">nice try. there is no escape from the portfolio.</span>`,
};

function runCommand(raw, { setWs }) {
  const input = raw.trim();
  if (!input) return null;

  const [cmd, ...args] = input.split(/\s+/);
  const lower = cmd.toLowerCase();

  if (lower === "clear") return { clear: true };

  if (/^ws[123]$/.test(lower)) {
    setWs?.(lower.slice(2));
    return { html: `<span class="t-dim">switched to workspace ${lower.slice(2)}</span>` };
  }

  if (lower === "ls" && (args[0] || "").toLowerCase().includes("secret")) {
    return { html: SECRET_LS };
  }

  if (lower === "ws" || lower === "workspace") {
    const n = args[0];
    if (setWs?.(n)) {
      return { html: `<span class="t-dim">switched to workspace ${n}</span>` };
    }
    return { html: `usage: <span class="t-green">ws 1</span> (terminal) · <span class="t-green">ws 2</span> (projects) · <span class="t-green">ws 3</span> (about)` };
  }

  if (lower === "open") {
    const target = (args[0] || "").toLowerCase();
    if (LINKS[target]) {
      window.open(LINKS[target], "_blank", "noopener");
      return { html: `<span class="t-dim">opening ${target}…</span>` };
    }
    return { html: `open: unknown target <span class="t-red">${escapeHtml(args[0] || "")}</span> — try: ${Object.keys(LINKS).join(" · ")}` };
  }

  if (lower === "sudo") {
    if (input.toLowerCase().includes("hire")) {
      return { html: `<span class="t-green">[sudo] permission granted.</span> email me: <a href="mailto:leonardogoncalves.flores@gmail.com">leonardogoncalves.flores@gmail.com</a>` };
    }
    return { html: `<span class="t-red">leo is not in the sudoers file. this incident will be reported.</span>` };
  }

  if (lower === "rm") {
    return { html: `<span class="t-red">rm: refusing to delete the portfolio you're standing on.</span>` };
  }

  if (lower === "cd") {
    const target = (args[0] || "").toLowerCase();
    if (target.includes("secret")) {
      return { html: `<span class="t-red">cd: permission denied.</span> ...fine, since you insist:\n${SECRET_LS}` };
    }
    return { html: `cd: this shell only has one directory, and it's <span class="t-blue">~</span>. try <span class="t-green">ls</span>` };
  }

  if (lower === "cat") {
    const f = (args[0] || "").toLowerCase();
    if (f.includes("about")) return { html: COMMANDS.whoami() };
    if (f.includes("resume")) return { html: `<a href="resume.pdf" target="_blank" rel="noreferrer">resume.pdf</a> — opening… <span class="t-dim">(or try: open resume)</span>` };
    for (const [name, content] of Object.entries(SECRET_FILES)) {
      if (f && name.toLowerCase().startsWith(f.replace(/^definitely-not-secrets\//, ""))) {
        return { html: content };
      }
    }
    if (f.includes("secret")) return { html: SECRET_LS };
    return { html: `cat: ${escapeHtml(args[0] || "")}: no such file` };
  }

  const fn = COMMANDS[lower];
  if (fn) return { html: fn() };

  return { html: `${escapeHtml(cmd)}: command not found — try <span class="t-green">help</span>` };
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function initTerminal({ setWs } = {}) {
  const out = document.getElementById("term-out");
  const input = document.getElementById("term-input");
  const echo = document.getElementById("term-echo");
  const term = document.getElementById("term");
  const history = [];
  let histIdx = -1;

  const PROMPT_HTML =
    `<span class="p-user">leo@arch</span><span class="p-sep">:</span><span class="p-path">~</span><span class="p-sym">$</span> `;

  function print(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    out.appendChild(div);
    term.scrollTop = term.scrollHeight;
  }

  function submit() {
    const value = input.value;
    print(PROMPT_HTML + escapeHtml(value));
    const result = runCommand(value, { setWs });
    if (result?.clear) out.innerHTML = "";
    else if (result?.html) print(result.html);
    if (value.trim()) { history.push(value); }
    histIdx = history.length;
    input.value = "";
    echo.textContent = "";
    term.scrollTop = term.scrollHeight;
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); submit(); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; input.value = history[histIdx] ?? ""; echo.textContent = input.value; }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      histIdx = Math.min(histIdx + 1, history.length);
      input.value = history[histIdx] ?? "";
      echo.textContent = input.value;
    }
  });
  input.addEventListener("input", () => { echo.textContent = input.value; });

  for (const ev of ["pointerdown", "click"]) {
    term.addEventListener(ev, () => {
      // pull focus without scrolling the page in flat mode
      input.focus({ preventScroll: true });
    });
  }

  // greeting
  print(`<span class="t-mauve">welcome.</span> this desktop is my actual rice — and my portfolio.`);
  print(`type <span class="t-green">help</span> to look around, or click things.`);
  print("");

  return {
    focus: () => input.focus({ preventScroll: true }),
    blur: () => input.blur(),
  };
}
