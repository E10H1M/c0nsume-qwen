// /static/js/app.js

import { createMenuBar } from "/static/js/menubar.js";
import { createSidebar, addToHistory } from "/static/js/sidebar.js";
import { createImageGenerator } from "/static/js/imageGenerator.js";
import { createImageEditor } from "/static/js/imageEditor.js";

// mount global UI
document.getElementById("sidebar-root").appendChild(createSidebar());
document.getElementById("menubar-root").appendChild(createMenuBar());

// roots
const roots = {
  editor: document.getElementById("image-editor-root"),
  generator: document.getElementById("image-generator-root"),
};

// instances (lazy)
const instances = {
  editor: null,
  generator: null,
};

function mountEditor() {
  if (!instances.editor) {
    const el = createImageEditor();
    el.addEventListener("imageEdited", (e) => addToHistory(e.detail.id));
    roots.editor.appendChild(el);
    instances.editor = el;
  }
}

function mountGenerator() {
  if (!instances.generator) {
    const el = createImageGenerator();
    el.addEventListener("imageGenerated", (e) => addToHistory(e.detail.id));
    roots.generator.appendChild(el);
    instances.generator = el;
  }
}

// show/hide without destroying (fast & simple)
function showRoot(which) {
  roots.editor.style.display    = (which === "edit") ? "" : "none";
  roots.generator.style.display = (which === "generate") ? "" : "none";
}

// single source of truth
let mode = "edit";
function setMode(next) {
  if (next === mode) return;
  mode = next;

  if (mode === "edit")   mountEditor();
  if (mode === "generate") mountGenerator();

  showRoot(mode);

  // let others (menubar) reflect the active mode
  window.dispatchEvent(new CustomEvent("app:modeChanged", { detail: { mode } }));
}

// initial boot
mountEditor();     // start in editor
showRoot("edit");
window.dispatchEvent(new CustomEvent("app:modeChanged", { detail: { mode: "edit" } }));

// menubar drives app mode
window.addEventListener("app:setMode", (e) => {
  const next = e.detail?.mode;
  if (next === "edit" || next === "generate") setMode(next);
});
