// /static/js/app.js

import { createMenuBar } from "/static/js/menubar.js";
import { createSidebar, addToHistory } from "/static/js/sidebar.js";
import { createImageGenerator } from "/static/js/imageGenerator.js";
import { createImageEditor } from "/static/js/imageEditor.js";
// import { createBasicScene } from "/static/js/basicScene.js"; // keep only this WG GPU scene
import { createLayerGenerator } from "/static/js/layerGenerator.js";

// Mount global UI (sidebar first so menubar's "Toggle Sidebar" can find it)
document.getElementById("sidebar-root").appendChild(createSidebar());

/**
 * MODE REGISTRY (single source of truth)
 * - Add/remove modes here and you’re done.
 * - Each mode: label (for menubar), rootId (where to mount), mount() (returns element).
 */
const MODES = {
  edit: {
    label: "Image Edit",
    rootId: "image-editor-root",
    mount() {
      const el = createImageEditor();
      el.addEventListener("imageEdited", (e) => addToHistory(e.detail.id));
      return el;
    },
  },
  generate: {
    label: "Generate",
    rootId: "image-generator-root",
    mount() {
      const el = createImageGenerator();
      el.addEventListener("imageGenerated", (e) => addToHistory(e.detail.id));
      return el;
    },
  },
  camera: {
    label: "Basic Scene (WebGPU)",
    rootId: "basic-scene-root",
    mount() {
      return createLayerGenerator("/static/img/love.jpeg");
    },
  },
};

// Build and mount the menubar from MODES (no default fallback)
document.getElementById("menubar-root").appendChild(
  createMenuBar({
    modes: Object.entries(MODES).map(([key, m]) => ({ key, label: m.label })),
  })
);

// Wire roots and an instance cache
Object.values(MODES).forEach((m) => {
  m.root = document.getElementById(m.rootId);
  if (!m.root) {
    console.warn(`[app] Missing root #${m.rootId} for mode "${m.label}". UI will not mount.`);
  }
});
const instances = {}; // modeKey -> mounted element

function ensureMounted(modeKey) {
  const m = MODES[modeKey];
  if (!m || !m.root) return;
  if (!instances[modeKey]) {
    const el = m.mount();
    m.root.appendChild(el);
    instances[modeKey] = el;
  }
}

function showRoot(activeKey) {
  Object.entries(MODES).forEach(([key, m]) => {
    if (!m.root) return;
    m.root.style.display = key === activeKey ? "" : "none";
  });
}

// Single source of truth for current mode
let mode = null;
function setMode(next) {
  if (!MODES[next]) {
    console.warn(`[app] Ignoring unknown mode: ${next}`);
    return;
  }
  if (mode === next) return;

  ensureMounted(next);
  showRoot(next);
  mode = next;

  // notify menubar (for aria-checked / ✓)
  window.dispatchEvent(new CustomEvent("app:modeChanged", { detail: { mode } }));
}

// Initial boot
setMode("edit");

// Menubar drives app mode (generic — no manual OR-chain)
window.addEventListener("app:setMode", (e) => {
  const next = e.detail?.mode;
  if (next && MODES[next]) setMode(next);
});
