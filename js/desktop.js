// Desktop chrome: workspaces, clock, waybar title.

export function initDesktop() {
  const clock = document.getElementById("wb-clock");
  const title = document.getElementById("wb-title");
  const tiles = document.getElementById("tiles");
  const wsButtons = [...document.querySelectorAll(".wb-ws")];

  function tick() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
  tick();
  setInterval(tick, 15_000);

  function setWs(n) {
    const ws = String(n);
    if (!["1", "2", "3"].includes(ws)) return false;
    tiles.dataset.ws = ws;
    for (const b of wsButtons) b.classList.toggle("active", b.dataset.ws === ws);
    const active = tiles.querySelector(`.ws-${ws}`);
    title.textContent = active?.dataset.title ?? "";
    return true;
  }

  for (const b of wsButtons) {
    for (const ev of ["pointerdown", "click"]) {
      b.addEventListener(ev, (e) => {
        e.stopPropagation();
        setWs(b.dataset.ws);
      });
    }
  }

  // bonus shortcut that no browser claims: ctrl+alt+1/2/3
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && ["1", "2", "3"].includes(e.key)) {
      e.preventDefault();
      setWs(e.key);
    }
  });

  setWs("1");
  return { setWs };
}
