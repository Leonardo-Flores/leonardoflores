import { runScreenBoot } from "./boot.js";
import { initDesktop } from "./desktop.js";
import { initI18n } from "./i18n.js";
import { initTerminal } from "./terminal.js";

const desktopEl = document.getElementById("desktop");
const loader = document.getElementById("loader");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// --- side menu ---------------------------------------------------------------

const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");
const backdrop = document.getElementById("menu-backdrop");

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
}
menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
backdrop.addEventListener("click", () => setMenu(false));
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false);
});
for (const link of sideMenu.querySelectorAll("a[data-nav]")) {
  link.addEventListener("click", (e) => {
    setMenu(false);
    if (link.dataset.nav === "home") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
  });
}

// --- desktop + terminal ------------------------------------------------------

initI18n();
const { setWs } = initDesktop();
const term = initTerminal({ setWs });

// --- boot (the loading screen) then 3D or flat -------------------------------

const use3D = window.innerWidth >= 900 && webglAvailable();

function hideLoader() {
  loader.classList.add("done");
  setTimeout(() => loader.remove(), 650);
}

if (use3D) {
  try {
    const { initScene } = await import("./scene.js");
    await document.fonts.ready;
    initScene({ desktopEl, term, reducedMotion }); // opens already docked on the screen
    hideLoader();
    await runScreenBoot(desktopEl, { instant: reducedMotion });
    term.focus();
  } catch (err) {
    console.error("3D init failed, falling back to flat mode:", err);
    enterFlat();
  }
} else {
  enterFlat();
}

function enterFlat() {
  document.body.classList.add("flat");

  function fitFlat() {
    const scale = Math.min(window.innerWidth / 1280, (window.innerHeight - 60) / 800) * 0.97;
    document.body.style.setProperty("--flat-scale", String(scale));
  }
  fitFlat();
  window.addEventListener("resize", fitFlat);

  hideLoader();
  runScreenBoot(desktopEl, { instant: reducedMotion });
}
