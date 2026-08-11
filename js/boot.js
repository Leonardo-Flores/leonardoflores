// Boot sequence typed on the laptop screen itself, before the desktop shows.

const LINES = [
  ["b-dim", "leo-os (arch linux) 10.2026"],
  ["b-ok", ":: running early hook [udev]"],
  ["b-ok", "/dev/nvme0n1p2: clean, 512340/12206976 files"],
  ["b-ok", ":: reached target graphical interface"],
  ["b-mauve", ":: starting hyprland"],
];

export function runScreenBoot(desktopEl, { instant = false } = {}) {
  const bootEl = document.getElementById("boot");

  return new Promise((resolve) => {
    const finish = () => {
      desktopEl.classList.remove("off");
      bootEl.classList.remove("booting");
      resolve();
    };

    if (instant) {
      finish();
      return;
    }

    bootEl.classList.add("booting");

    let i = 0;
    const step = () => {
      if (i < LINES.length) {
        const [cls, text] = LINES[i++];
        const div = document.createElement("div");
        div.className = cls;
        div.textContent = text;
        bootEl.appendChild(div);
        setTimeout(step, 180 + Math.random() * 140);
      } else {
        setTimeout(finish, 550);
      }
    };
    setTimeout(step, 450);
  });
}
