// // /static/js/imageGenerator.js
// export function createImageGenerator() {
//   const container = document.createElement("div");
//   container.className = "image-generator";

//   const title = document.createElement("h1");
//   title.textContent = "QWEN IMAGE";
//   container.appendChild(title);

//   const grid = document.createElement("div");
//   grid.className = "grid";
//   container.appendChild(grid);

//   // Prompt
//   const promptLabel = document.createElement("label");
//   promptLabel.className = "span-all";
//   promptLabel.textContent = "Prompt";
//   const promptArea = document.createElement("textarea");
//   promptArea.id = "prompt";
//   promptArea.placeholder = "Describe the image you want…";
//   promptLabel.appendChild(promptArea);
//   grid.appendChild(promptLabel);

//   // Aspect ratio
//   const arLabel = document.createElement("label");
//   arLabel.textContent = "Aspect ratio";
//   const arSelect = document.createElement("select");
//   arSelect.id = "aspect_ratio";
//   ["16:9","9:16","1:1","4:3","3:4","3:2","2:3"].forEach(r => {
//     const opt = document.createElement("option");
//     opt.textContent = r;
//     if (r === "1:1") opt.selected = true;
//     arSelect.appendChild(opt);
//   });
//   arLabel.appendChild(arSelect);
//   grid.appendChild(arLabel);

//   // CFG
//   const cfgLabel = document.createElement("label");
//   cfgLabel.textContent = "CFG (guidance)";
//   const cfgInput = document.createElement("input");
//   cfgInput.type = "number";
//   cfgInput.id = "cfg";
//   cfgInput.step = "0.1";
//   cfgInput.value = "1.0";
//   cfgLabel.appendChild(cfgInput);
//   grid.appendChild(cfgLabel);

//   // Seed
//   const seedLabel = document.createElement("label");
//   seedLabel.textContent = "Seed";
//   const seedInput = document.createElement("input");
//   seedInput.type = "number";
//   seedInput.id = "seed";
//   seedInput.step = "1";
//   seedInput.value = "42";
//   seedLabel.appendChild(seedInput);
//   grid.appendChild(seedLabel);

//   // Controls
//   const controls = document.createElement("div");
//   controls.className = "controls";
//   const genBtn = document.createElement("button");
//   genBtn.id = "genBtn";
//   genBtn.textContent = "Generate";
//   const status = document.createElement("span");
//   status.id = "status";
//   status.className = "small";
//   controls.appendChild(genBtn);
//   controls.appendChild(status);
//   container.appendChild(controls);

//   // Output + image container
//   const output = document.createElement("pre");
//   output.id = "output";
//   container.appendChild(output);

//   const imgContainer = document.createElement("div");
//   imgContainer.id = "image-container";
//   container.appendChild(imgContainer);

//   // --- Logic ---
//   genBtn.addEventListener("click", async () => {
//     genBtn.disabled = true;
//     status.textContent = "generating…";

//     const body = {
//       prompt: promptArea.value,
//       aspect_ratio: arSelect.value,
//       cfg: parseFloat(cfgInput.value || "1.0"),
//       seed: parseInt(seedInput.value || "42", 10),
//     };

//     try {
//       // ✅ correct route
//       const res = await fetch("/generate/image", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       output.textContent = JSON.stringify(data, null, 2);

//       imgContainer.innerHTML = "";
//       if (data.id) {
//         const img = document.createElement("img");
//         // ✅ same retrieval route, with cache-buster
//         img.src = `/image/${data.id}?t=${Date.now()}`;
//         img.alt = "Generated Image";
//         imgContainer.appendChild(img);
//         status.textContent = "done";

//         // 🔥 let app.js update history
//         container.dispatchEvent(
//           new CustomEvent("imageGenerated", { detail: { id: data.id } })
//         );
//       } else {
//         status.textContent = "failed";
//       }
//     } catch (err) {
//       console.error(err);
//       status.textContent = "error";
//     }

//     genBtn.disabled = false;
//   });

//   return container;
// }





// /static/js/imageGenerator.js

// Load component CSS dynamically (keeps styles scoped & swappable)
(function loadImageGeneratorCSS() {
  if (!document.querySelector('link[href="/static/css/imageGenerator.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/static/css/imageGenerator.css";
    document.head.appendChild(link);
  }
})();

function el(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
}

export function createImageGenerator() {
  // ---- state ----
  let busy = false;
  let runAbort = null;
  let resultBitmap = null;

  // ---- root ----
  const container = el("div", "image-generator");
  container.appendChild(el("h1", null, "QWEN IMAGE"));

  // ===== stage: single pane w/ canvas =====
  const stage = el("div", "gen-stage");
  const pane = el("div", "pane");

  const resultCanvas = document.createElement("canvas");
  resultCanvas.className = "preview-canvas";
  pane.appendChild(resultCanvas);

  const placeholder = el("div", "result-placeholder", "Generate to see the result here");
  pane.appendChild(placeholder);

  stage.appendChild(pane);
  container.appendChild(stage);

  // ===== controls =====
  const controls = el("div", "controls");

  // Prompt (multiline)
  const promptField = el("div", "field");
  const promptLabel = el("label", "field-label", "Prompt");
  promptLabel.htmlFor = "genPrompt";
  const promptBox = document.createElement("textarea");
  promptBox.id = "genPrompt";
  promptBox.className = "prompt-box";
  promptBox.rows = 8;
  promptBox.placeholder = "Describe the image you want…\n• hyperreal portrait, soft rim light\n• moody rain-soaked street, neon reflections\n• product packshot on white, crisp shadows";
  promptField.appendChild(promptLabel);
  promptField.appendChild(promptBox);

  // Aspect ratio
  const arField = el("div", "field inline");
  const arLabel = el("label", "field-label", "Aspect ratio");
  arLabel.htmlFor = "aspect_ratio";
  const arSelect = document.createElement("select");
  arSelect.id = "aspect_ratio";
  ["16:9","9:16","1:1","4:3","3:4","3:2","2:3"].forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    if (r === "1:1") opt.selected = true;
    arSelect.appendChild(opt);
  });
  arField.appendChild(arLabel);
  arField.appendChild(arSelect);

  // CFG
  const cfgField = el("div", "field inline");
  const cfgLabel = el("label", "field-label", "CFG (guidance)");
  cfgLabel.htmlFor = "cfg";
  const cfgInput = document.createElement("input");
  cfgInput.type = "number";
  cfgInput.id = "cfg";
  cfgInput.className = "number";
  cfgInput.step = "0.1";
  cfgInput.value = "1.0";
  cfgField.appendChild(cfgLabel);
  cfgField.appendChild(cfgInput);

  // Seed
  const seedField = el("div", "field inline");
  const seedLabel = el("label", "field-label", "Seed");
  seedLabel.htmlFor = "seed";
  const seedInput = document.createElement("input");
  seedInput.type = "number";
  seedInput.id = "seed";
  seedInput.className = "number";
  seedInput.step = "1";
  seedInput.value = "42";
  seedField.appendChild(seedLabel);
  seedField.appendChild(seedInput);

  const row = el("div", "row");
  row.appendChild(arField);
  row.appendChild(cfgField);
  row.appendChild(seedField);

  // Actions
  const actions = el("div", "actions");
  const genBtn = el("button", "btn primary", "Generate");
  genBtn.type = "button";
  genBtn.disabled = true;
  const cancelBtn = el("button", "btn ghost", "Cancel");
  cancelBtn.type = "button";
  cancelBtn.disabled = true;
  actions.appendChild(genBtn);
  actions.appendChild(cancelBtn);

  // Status
  const status = el("div", "status");

  controls.appendChild(promptField);
  controls.appendChild(row);
  controls.appendChild(actions);
  controls.appendChild(status);

  container.appendChild(controls);

  // ===== helpers =====
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function setBusy(on, message = "") {
    busy = !!on;
    container.classList.toggle("is-busy", busy);
    status.textContent = message;
    genBtn.disabled = busy || !promptBox.value.trim();
    cancelBtn.disabled = !busy;
  }

  function enableRunIfReady() {
    genBtn.disabled = busy || !promptBox.value.trim();
  }

  async function loadBitmap(url) {
    const img = new Image();
    img.decoding = "async";
    // If your image endpoint needs cookies/session, do NOT set crossOrigin.
    img.src = url;
    await img.decode();
    if (window.createImageBitmap) {
      try { return await createImageBitmap(img); } catch {}
    }
    return img;
  }

  function drawToCanvas(imgLike, canvas) {
    const w = imgLike.width || imgLike.naturalWidth;
    const h = imgLike.height || imgLike.naturalHeight;

    const paneW = canvas.parentElement?.clientWidth || container.clientWidth || 800;
    const availW = Math.max(1, paneW - 24); // pane padding ~12*2
    const maxW = clamp(availW, 240, 1600);
    const maxH = 700;

    const ratio = Math.min(maxW / w, maxH / h, 1);
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cssW = Math.max(1, Math.round(w * ratio));
    const cssH = Math.max(1, Math.round(h * ratio));

    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgLike, 0, 0, canvas.width, canvas.height);
  }

  function redraw() {
    if (resultBitmap) {
      drawToCanvas(resultBitmap, resultCanvas);
      placeholder.style.display = "none";
    }
  }

  function adaptGenResponse(json) {
    // Normalize varying backend shapes to { id, url }
    const id = json?.id || json?.image_id || json?.result_id || null;
    const url = json?.url || (id ? `/image/${id}` : json?.path || null);
    return { id, url };
  }

  // ===== actions =====
  async function runGenerate() {
    const prompt = promptBox.value.trim();
    if (!prompt) { status.textContent = "Write a prompt."; return; }

    const body = {
      prompt,
      aspect_ratio: arSelect.value,
      cfg: parseFloat(cfgInput.value || "1.0"),
      seed: parseInt(seedInput.value || "42", 10),
    };

    // abort any in-flight call
    runAbort?.abort?.();
    runAbort = new AbortController();

    setBusy(true, "Generating…");
    try {
      const res = await fetch("/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: runAbort.signal,
      });
      if (!res.ok) throw new Error(`Generate failed (${res.status})`);
      const json = await res.json();

      const { id, url } = adaptGenResponse(json);
      if (!id || !url) throw new Error("Invalid JSON from backend");

      // fetch & render image to canvas (cache-busted)
      const bmp = await loadBitmap(`${url}?t=${Date.now()}`);
      resultBitmap = bmp;
      redraw();
      status.textContent = "Done.";

      // notify app.js → history
      container.dispatchEvent(new CustomEvent("imageGenerated", { detail: { id } }));
    } catch (e) {
      if (e?.name === "AbortError") {
        status.textContent = "Canceled.";
      } else {
        status.textContent = e?.message || String(e);
        console.error(e);
      }
    } finally {
      setBusy(false);
    }
  }

  function cancelGenerate() {
    if (!busy) return;
    runAbort?.abort?.();
  }

  // ===== events =====
  promptBox.addEventListener("input", enableRunIfReady);
  genBtn.addEventListener("click", runGenerate);
  cancelBtn.addEventListener("click", cancelGenerate);

  // Cmd/Ctrl+Enter to run
  promptBox.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !genBtn.disabled) {
      runGenerate();
      e.preventDefault();
    }
  });

  // keep canvas sharp on resize
  window.addEventListener("resize", redraw);

  // boot
  enableRunIfReady();

  return container;
}
