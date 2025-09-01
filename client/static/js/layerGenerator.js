// /static/js/layerGenerator.js
// Minimal UI: canvas first, then prompt + two generate buttons.
// Uses createBasicScene() and your existing scene methods/events.

// load layerGenerator.css once
(function loadLayerGeneratorCSS() {
  const href = "/static/css/layerGenerator.css";
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
})();

import { createBasicScene } from "/static/js/basicScene.js";

/** call scene method if present; otherwise dispatch the matching event */
function callScene(sceneEl, methodName, eventName, src) {
  if (typeof sceneEl[methodName] === "function") {
    sceneEl[methodName](src);
  } else {
    sceneEl.dispatchEvent(new CustomEvent(eventName, { detail: { src } }));
  }
}

/** normalize backend shapes to a usable URL */
function adaptGenResponse(json) {
  const id  = json?.id || json?.image_id || json?.result_id || null;
  const url = json?.url || (id ? `/image/${id}` : json?.path || null);
  return { id, url };
}

export function createLayerGenerator({
  initialImage = "/static/img/love.jpeg",
  endpoint = "/generate/image",
  defaultAspect = "1:1",
} = {}) {
  const root = document.createElement("div");
  root.className = "layer-generator";

  // --- 1) Scene first
  const sceneEl = createBasicScene(initialImage);
  root.appendChild(sceneEl);

  // --- 2) Controls stack
  const controls = document.createElement("div");
  controls.className = "ctrl-stack";

  // Prompt card
  const promptCard = document.createElement("div");
  promptCard.className = "ctrl-card prompt";

  const promptLabel = document.createElement("span");
  promptLabel.className = "label";
  promptLabel.textContent = "Prompt:";

  const promptBox = document.createElement("textarea");
  promptBox.rows = 4;
  promptBox.placeholder = "Describe the image…";

  promptCard.append(promptLabel, promptBox);

  // Actions card
  const actionsCard = document.createElement("div");
  actionsCard.className = "ctrl-card actions";

  const genFG = document.createElement("button");
  genFG.textContent = "Generate FG";

  const genBG = document.createElement("button");
  genBG.textContent = "Generate BG";

  const status = document.createElement("span");
  status.className = "status";

  actionsCard.append(genFG, genBG, status);

  // Assemble
  controls.append(promptCard, actionsCard);
  root.appendChild(controls);

  // --- state
  let busy = false;
  function setBusy(on, msg = "") {
    busy = !!on;
    genFG.disabled = busy || !promptBox.value.trim();
    genBG.disabled = busy || !promptBox.value.trim();
    status.textContent = msg;
  }
  function enableIfReady() {
    genFG.disabled = busy || !promptBox.value.trim();
    genBG.disabled = busy || !promptBox.value.trim();
  }
  promptBox.addEventListener("input", enableIfReady);
  enableIfReady();

  // --- generator action
  async function runGenerate(target /* 'fg' | 'bg' */) {
    const prompt = (promptBox.value || "").trim();
    if (!prompt) return;

    setBusy(true, "Generating…");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspect_ratio: defaultAspect,
        }),
      });
      if (!res.ok) throw new Error(`Generate failed (${res.status})`);
      const json = await res.json();

      const { url } = adaptGenResponse(json);
      if (!url) throw new Error("Invalid generator response");

      // cache-bust for reliability
      const src = `${url}?t=${Date.now()}`;

      if (target === "fg") {
        callScene(sceneEl, "setTexture", "basicScene:setTexture", src);
      } else {
        callScene(sceneEl, "setBackground", "basicScene:setBackground", src);
      }

      status.textContent = "Done.";
    } catch (e) {
      status.textContent = e?.message || String(e);
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  genFG.addEventListener("click", () => runGenerate("fg"));
  genBG.addEventListener("click", () => runGenerate("bg"));

  // Optional programmatic hooks
  root.generateForeground = (prompt) => {
    promptBox.value = prompt;
    enableIfReady();
    return runGenerate("fg");
  };
  root.generateBackground = (prompt) => {
    promptBox.value = prompt;
    enableIfReady();
    return runGenerate("bg");
  };

  return root;
}
