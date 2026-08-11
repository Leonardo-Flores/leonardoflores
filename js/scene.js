// 3D stage: a minimal modern laptop whose screen is the live desktop DOM.
//
// One timeline parameter u drives everything:
//   u = 0     camera docked on the screen (interactive desktop, shard tunnel)
//   u ≈ 0.3   overview of the open laptop
//   u ≈ 0.75  lid closed, centered product shot
//   u → 1     text content scrolls over the stage
//
// On load an intro animates u from "closed" down to 0 (open → boot → dive in).
// After that, u simply follows the page scroll — so scrolling down flies out
// of the screen, closes the lid and hands over to the text version; scrolling
// back up dives back in.

import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "../vendor/CSS3DRenderer.js";
import { RoomEnvironment } from "../vendor/RoomEnvironment.js";
import { RoundedBoxGeometry } from "../vendor/RoundedBoxGeometry.js";

const SCREEN_W = 1280;
const SCREEN_H = 800;
const LID_W = 1380;
const LID_H = 880;
const LID_T = 16;
const BASE_W = 1380;
const BASE_T = 24;
const BASE_D = 920;

const LID_OPEN = THREE.MathUtils.degToRad(-12);
const LID_CLOSED = THREE.MathUtils.degToRad(90.6); // flush against the base — no gap

export function initScene({ desktopEl, term, reducedMotion }) {
  const stage = document.getElementById("stage");
  const cssLayer = document.getElementById("css3d-layer");

  // --- renderers -------------------------------------------------------------

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.prepend(renderer.domElement);

  const cssRenderer = new CSS3DRenderer({ element: cssLayer });

  const scene = new THREE.Scene();
  const cssScene = new THREE.Scene();

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.9;

  const camera = new THREE.PerspectiveCamera(35, 1, 10, 30000);

  // --- laptop ----------------------------------------------------------------

  const laptop = new THREE.Group();
  scene.add(laptop);

  const alu = new THREE.MeshStandardMaterial({ color: 0x474b5e, metalness: 0.7, roughness: 0.35 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x181922, metalness: 0.25, roughness: 0.65 });

  const base = new THREE.Mesh(new RoundedBoxGeometry(BASE_W, BASE_T, BASE_D, 4, 10), alu);
  base.position.y = BASE_T / 2;
  base.castShadow = base.receiveShadow = true;
  laptop.add(base);

  const well = new THREE.Mesh(new THREE.BoxGeometry(BASE_W - 160, 4, 420), dark);
  well.position.set(0, BASE_T + 1, -170);
  laptop.add(well);

  const keyGeo = new RoundedBoxGeometry(72, 8, 66, 2, 3);
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x1b1c26, metalness: 0.1, roughness: 0.62 });
  const COLS = 14, ROWS = 5;
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, COLS * ROWS + 1);
  const m = new THREE.Matrix4();
  let ki = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      m.setPosition(-BASE_W / 2 + 130 + c * 86, BASE_T + 6, -340 + r * 82);
      keys.setMatrixAt(ki++, m);
    }
  }
  const sm = new THREE.Matrix4().makeScale(5.4, 1, 1);
  sm.setPosition(0, BASE_T + 6, -340 + 5 * 82);
  keys.setMatrixAt(ki, sm);
  keys.castShadow = true;
  laptop.add(keys);

  const trackpad = new THREE.Mesh(new RoundedBoxGeometry(420, 4, 260, 2, 6), dark);
  trackpad.position.set(0, BASE_T + 1, 250);
  laptop.add(trackpad);

  // hinge barrels — the fold has to look like it happens around something
  const barrelGeo = new THREE.CylinderGeometry(15, 15, 210, 24);
  for (const x of [-400, 400]) {
    const barrel = new THREE.Mesh(barrelGeo, dark);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(x, BASE_T - 2, -BASE_D / 2 + 14);
    laptop.add(barrel);
  }

  // subtle thumb scoop on the front lip
  const scoop = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 200, 20), dark);
  scoop.rotation.z = Math.PI / 2;
  scoop.position.set(0, BASE_T + 1, BASE_D / 2 - 1);
  laptop.add(scoop);

  // side ports
  const portGeo = new THREE.BoxGeometry(6, 8, 42);
  for (const side of [-1, 1]) {
    for (const z of [-210, -140, -70]) {
      const port = new THREE.Mesh(portGeo, dark);
      port.position.set(side * (BASE_W / 2 - 1), BASE_T / 2 + 1, z);
      laptop.add(port);
    }
  }

  const hinge = new THREE.Group();
  hinge.position.set(0, BASE_T - 4, -BASE_D / 2 + 14);
  hinge.rotation.x = LID_CLOSED;
  laptop.add(hinge);

  const lid = new THREE.Mesh(new RoundedBoxGeometry(LID_W, LID_H, LID_T, 4, 10), alu);
  lid.position.set(0, LID_H / 2 - 6, -LID_T / 2);
  lid.castShadow = true;
  hinge.add(lid);

  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(LID_W - 36, LID_H - 36), dark);
  bezel.position.set(0, LID_H / 2 - 6, 0.6);
  hinge.add(bezel);

  // webcam dot on the bezel
  const cam = new THREE.Mesh(
    new THREE.CircleGeometry(6, 20),
    new THREE.MeshBasicMaterial({ color: 0x0a0a12 }),
  );
  cam.position.set(0, LID_H - 34, 0.8);
  hinge.add(cam);

  // the "~" mark on the lid back — visible when the laptop is closed
  const logoCanvas = document.createElement("canvas");
  logoCanvas.width = logoCanvas.height = 256;
  const lg = logoCanvas.getContext("2d");
  lg.fillStyle = "#cba6f7";
  lg.font = "700 200px 'JetBrains Mono', monospace";
  lg.textAlign = "center";
  lg.textBaseline = "middle";
  lg.fillText("~", 128, 140);
  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(170, 170),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(logoCanvas), transparent: true, toneMapped: false, opacity: 0.92 }),
  );
  logo.rotation.y = Math.PI;
  logo.position.set(0, LID_H / 2 - 6, -LID_T - 0.8);
  hinge.add(logo);

  // stickers — a dev laptop is not a dev laptop without them
  function makeSticker(draw, size = 130) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    draw(c.getContext("2d"));
    const s = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, toneMapped: false }),
    );
    s.rotation.y = Math.PI;
    return s;
  }
  const roundRect = (g, x, y, w, h, r, fill) => {
    g.fillStyle = fill;
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    g.fill();
  };

  const archSticker = makeSticker((g) => {
    g.fillStyle = "#89b4fa";
    g.beginPath(); g.moveTo(128, 26); g.lineTo(230, 230); g.lineTo(26, 230); g.closePath(); g.fill();
    g.fillStyle = "#2a2c3a";
    g.beginPath(); g.moveTo(128, 104); g.lineTo(184, 216); g.lineTo(72, 216); g.closePath(); g.fill();
  }, 120);
  archSticker.position.set(-425, 655, -LID_T - 0.9);
  archSticker.rotation.z = Math.PI + 0.18; // upright in the closed (main) view
  hinge.add(archSticker);

  const promptSticker = makeSticker((g) => {
    roundRect(g, 20, 20, 216, 216, 36, "#11111b");
    g.fillStyle = "#a6e3a1";
    g.font = "700 110px 'JetBrains Mono', monospace";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(">_", 128, 138);
  }, 110);
  promptSticker.position.set(415, 205, -LID_T - 0.9);
  promptSticker.rotation.z = Math.PI - 0.14;
  hinge.add(promptSticker);

  const btwSticker = makeSticker((g) => {
    roundRect(g, 16, 78, 224, 100, 50, "#fab387");
    g.fillStyle = "#11111b";
    g.font = "700 72px 'JetBrains Mono', monospace";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("btw", 128, 130);
  }, 125);
  btwSticker.position.set(360, 610, -LID_T - 0.9);
  btwSticker.rotation.z = Math.PI - 0.26;
  hinge.add(btwSticker);

  const anchor = new THREE.Object3D();
  anchor.position.set(0, LID_H / 2 - 6, 1.8);
  hinge.add(anchor);

  const cssObj = new CSS3DObject(desktopEl);
  cssScene.add(cssObj);
  desktopEl.style.pointerEvents = "none";

  let openness = 0;

  function syncScreen() {
    anchor.updateWorldMatrix(true, false);
    anchor.getWorldPosition(cssObj.position);
    anchor.getWorldQuaternion(cssObj.quaternion);
    // the screen powers down as the lid closes — no glowing sliver at the edge
    const power = Math.min(1, Math.max(0, (openness - 0.45) / 0.3));
    desktopEl.style.opacity = String(power);
    desktopEl.style.visibility = power <= 0 ? "hidden" : "visible";
  }

  // --- environment -----------------------------------------------------------

  scene.add(new THREE.HemisphereLight(0x9aa0c8, 0x14151f, 1.2));

  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(-900, 1600, 1200);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = sc.bottom = -1600;
  sc.right = sc.top = 1600;
  sc.far = 6000;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x89b4fa, 0.5);
  rim.position.set(1200, 600, -1400);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xbfc7ff, 0.55);
  fill.position.set(500, 900, 2200);
  scene.add(fill);

  const glow = new THREE.PointLight(0xcba6f7, 18000, 2200, 1.8);
  glow.position.set(0, 420, 260);
  scene.add(glow);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(24000, 24000),
    new THREE.ShadowMaterial({ opacity: 0.42 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // --- timeline --------------------------------------------------------------

  const CAM_OPEN = { pos: new THREE.Vector3(-540, 520, 1900), tgt: new THREE.Vector3(0, 380, -60) };
  const CAM_CLOSED = { pos: new THREE.Vector3(-360, 1450, 3050), tgt: new THREE.Vector3(0, 0, -80) };

  const scrollSpace = document.getElementById("scroll-space");
  const enterHint = document.getElementById("enter-hint");
  const backHint = document.getElementById("back-hint");
  const skipLink = document.getElementById("skip-link");

  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  let u = 0; // 0 = docked on the screen; 1 = closed, content arriving
  let focused = false;

  const camGoal = new THREE.Vector3();
  const targetGoal = new THREE.Vector3();
  const camNow = new THREE.Vector3();
  const targetNow = new THREE.Vector3();
  const mouse = { x: 0, y: 0 };

  function runwayPx() {
    return Math.max(1, scrollSpace.offsetTop + scrollSpace.offsetHeight - window.innerHeight);
  }

  function focusDistance() {
    const vFit = SCREEN_H / 0.82 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    const hFit = SCREEN_W / 0.92 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    return Math.max(vFit, hFit);
  }

  function setFocus(next) {
    if (focused === next) return;
    focused = next;
    document.body.classList.toggle("focused", focused);
    desktopEl.style.pointerEvents = focused ? "auto" : "none";
    backHint.classList.toggle("hidden", !focused);
    if (focused) term.focus();
    else term.blur();
  }

  function updateFromU() {
    openness = u <= 0.32 ? 1 : u >= 0.72 ? 0 : 1 - easeInOut((u - 0.32) / 0.4);

    setFocus(u < 0.05);

    // page chrome (menu, header links) belongs to the text act — it only
    // appears once the laptop has fully closed; the skip link does the reverse
    document.body.classList.toggle("chrome-visible", u > 0.74);

    const showEnter = !focused && u > 0.06 && u < 0.65;
    enterHint.classList.toggle("hidden", !showEnter);
  }

  window.addEventListener("scroll", () => {
    u = clamp01(window.scrollY / runwayPx());
    updateFromU();
  }, { passive: true });

  // interactions
  backHint.style.pointerEvents = "none";

  enterHint.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });
  for (const ev of ["pointerdown", "click"]) {
    renderer.domElement.addEventListener(ev, () => {
      if (!focused && u > 0.05 && u < 0.7) {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      }
    });
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && focused) {
      window.scrollTo({ top: runwayPx() * 0.35, behavior: reducedMotion ? "auto" : "smooth" });
    }
  });
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // --- resize / render loop --------------------------------------------------

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    cssRenderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();
  const damp = reducedMotion ? 1 : 0.075;
  const tmpN = new THREE.Vector3();
  const tmpV = new THREE.Vector3();
  const focusPos = new THREE.Vector3();

  function tick() {
    const t = clock.getElapsedTime();

    hinge.rotation.x = LID_CLOSED + (LID_OPEN - LID_CLOSED) * openness;
    // real hinges lift the lid at the very end of the fold, so it rests ON the
    // keyboard instead of clipping through the base — no floating mid-close
    hinge.position.y = (BASE_T - 4) + 22 * clamp01((0.25 - openness) / 0.25);

    const idleFloat = !focused && u > 0.1 && u < 0.6;
    if (!reducedMotion && idleFloat) {
      laptop.position.y = Math.sin(t * 0.9) * 7;
      laptop.rotation.y = Math.sin(t * 0.35) * 0.03;
    } else {
      laptop.position.y = 0;
      laptop.rotation.y = 0;
    }

    syncScreen();

    // camera along the timeline
    tmpN.set(0, 0, 1).applyQuaternion(cssObj.quaternion);
    focusPos.copy(cssObj.position).addScaledVector(tmpN, focusDistance());

    if (u <= 0.3) {
      const k = easeInOut(u / 0.3);
      camGoal.lerpVectors(focusPos, CAM_OPEN.pos, k);
      targetGoal.lerpVectors(cssObj.position, CAM_OPEN.tgt, k);
    } else {
      const k = easeInOut(clamp01((u - 0.3) / 0.45));
      camGoal.lerpVectors(CAM_OPEN.pos, CAM_CLOSED.pos, k);
      targetGoal.lerpVectors(CAM_OPEN.tgt, CAM_CLOSED.tgt, k);
    }

    const px = idleFloat ? mouse.x * 60 : 0;
    const py = idleFloat ? -mouse.y * 40 : 0;

    camNow.lerp(tmpV.set(camGoal.x + px, camGoal.y + py, camGoal.z), damp);
    targetNow.lerp(targetGoal, damp);
    camera.position.copy(camNow);
    camera.lookAt(targetNow);

    renderer.render(scene, camera);
    cssRenderer.render(cssScene, camera);
    requestAnimationFrame(tick);
  }

  // start docked on the screen — unless a deep link (#c-about etc.) landed us
  // mid-page, in which case pick the timeline up from wherever the scroll is
  if (location.hash) {
    u = clamp01(window.scrollY / runwayPx());
  } else {
    window.scrollTo(0, 0);
    u = 0;
  }
  updateFromU();
  // pose the hinge before reading the screen transform — otherwise the camera
  // frames the lid in its closed construction pose
  hinge.rotation.x = LID_CLOSED + (LID_OPEN - LID_CLOSED) * openness;
  hinge.position.y = (BASE_T - 4) + 22 * clamp01((0.25 - openness) / 0.25);
  hinge.updateWorldMatrix(true, true);
  syncScreen();
  {
    const n = new THREE.Vector3(0, 0, 1).applyQuaternion(cssObj.quaternion);
    focusPos.copy(cssObj.position).addScaledVector(n, focusDistance());
    if (u <= 0.3) {
      const k = easeInOut(u / 0.3);
      camGoal.lerpVectors(focusPos, CAM_OPEN.pos, k);
      targetGoal.lerpVectors(cssObj.position, CAM_OPEN.tgt, k);
    } else {
      const k = easeInOut(clamp01((u - 0.3) / 0.45));
      camGoal.lerpVectors(CAM_OPEN.pos, CAM_CLOSED.pos, k);
      targetGoal.lerpVectors(CAM_OPEN.tgt, CAM_CLOSED.tgt, k);
    }
    camNow.copy(camGoal);
    if (u === 0) camNow.addScaledVector(n, focusDistance() * 0.12); // gentle settle-in
    targetNow.copy(targetGoal);
    camera.position.copy(camNow);
    camera.lookAt(targetNow);
  }
  tick();
}
