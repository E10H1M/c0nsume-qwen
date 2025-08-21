// /static/js/imageEditor.js

(function loadImageEditorCSS() {
  if (!document.querySelector('link[href="/static/css/imageEditor.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/static/css/imageEditor.css";
    document.head.appendChild(link);
  }
})();

function el(t, c, txt) {
  const n = document.createElement(t);
  if (c) n.className = c;
  if (txt != null) n.textContent = txt;
  return n;
}

export function createImageEditor() {
  // ---- state ----
  let lastUid = null;
  let busy = false;

  let originalBitmap = null; // ImageBitmap | HTMLImageElement
  let resultBitmap = null;

  const container = el("div", "image-editor");
  const title = el("h1", null, "QWEN EDIT");
  container.appendChild(title);

  // ===== stage: two panes (both canvas) =====
  const stage = el("div", "ie-stage");

  const leftPane = el("div", "pane");
  const uploadArea = el("div", "upload-area");
  const hint = el("div", "upload-hint");
  hint.appendChild(el("div", "dz-headline", "Drop an image here"));
  hint.appendChild(el("div", "dz-sub", "…or click to choose a file"));
  uploadArea.appendChild(hint);

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.className = "file-input-hidden";
  uploadArea.appendChild(fileInput);

  const originalCanvas = document.createElement("canvas");
  originalCanvas.className = "preview-canvas";
  originalCanvas.style.display = "none";
  uploadArea.appendChild(originalCanvas);

  leftPane.appendChild(uploadArea);

  const rightPane = el("div", "pane");
  const resultCanvas = document.createElement("canvas");
  resultCanvas.className = "preview-canvas";
  rightPane.appendChild(resultCanvas);
  const resultPlaceholder = el("div", "result-placeholder", "Run an edit to see the result here");
  rightPane.appendChild(resultPlaceholder);

  stage.appendChild(leftPane);
  stage.appendChild(rightPane);
  container.appendChild(stage);

  // ===== controls =====
  const controls = el("div", "controls");

  const promptField = el("div", "field");
  const promptLabel = el("label", "field-label", "Prompt");
  promptLabel.htmlFor = "promptBox";
  const promptBox = document.createElement("textarea");
  promptBox.id = "promptBox";
  promptBox.className = "prompt-box";
  promptBox.rows = 8;
  promptBox.placeholder =
    "Describe the edit (multi-line):\n" +
    "• Replace sky with dramatic sunset\n" +
    "• Remove background, add neon alley\n" +
    "• Make subject wear red jacket\n" +
    "• Keep identity; sharpen details";
  promptField.appendChild(promptLabel);
  promptField.appendChild(promptBox);

  const seedField = el("div", "field inline");
  const seedLabel = el("label", "field-label", "Seed");
  seedLabel.htmlFor = "seedInput";
  const seedInput = document.createElement("input");
  seedInput.type = "number";
  seedInput.id = "seedInput";
  seedInput.className = "number";
  seedInput.value = "42";
  seedField.appendChild(seedLabel);
  seedField.appendChild(seedInput);

  const stepsField = el("div", "field inline");
  const stepsLabel = el("label", "field-label", "Steps");
  stepsLabel.htmlFor = "stepsInput";
  const stepsInput = document.createElement("input");
  stepsInput.type = "number";
  stepsInput.id = "stepsInput";
  stepsInput.className = "number";
  stepsInput.min = "1";
  stepsInput.max = "50";
  stepsInput.value = "4";
  stepsField.appendChild(stepsLabel);
  stepsField.appendChild(stepsInput);

  const row = el("div", "row");
  row.appendChild(seedField);
  row.appendChild(stepsField);

  const actions = el("div", "actions");
  const runBtn = el("button", "btn primary", "Run Edit");
  runBtn.type = "button";
  runBtn.disabled = true;
  actions.appendChild(runBtn);

  const status = el("div", "status");

  controls.appendChild(promptField);
  controls.appendChild(row);
  controls.appendChild(actions);
  controls.appendChild(status);
  container.appendChild(controls);

  // ===== helpers =====
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function setBusy(b, msg) {
    busy = b;
    container.classList.toggle("is-busy", b);
    status.textContent = msg || "";
    runBtn.disabled = b || !lastUid || !promptBox.value.trim();
  }

  function enableRunIfReady() {
    runBtn.disabled = busy || !lastUid || !promptBox.value.trim();
  }

  function dimsOf(imgLike) {
    // works for ImageBitmap or HTMLImageElement
    return {
      w: imgLike.width || imgLike.naturalWidth,
      h: imgLike.height || imgLike.naturalHeight,
    };
  }

  function drawToCanvas(imgLike, canvas) {
    const { w, h } = dimsOf(imgLike);
    const paneW = canvas.parentElement?.clientWidth || stage.clientWidth;
    const availW = Math.max(1, paneW - 24); // pane padding ~12*2
    const maxW = clamp(availW, 200, 1600);
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
    if (originalBitmap) {
      drawToCanvas(originalBitmap, originalCanvas);
      originalCanvas.style.display = "";
      uploadArea.classList.add("has-image");
    }
    if (resultBitmap) {
      drawToCanvas(resultBitmap, resultCanvas);
      resultPlaceholder.style.display = "none";
    }
  }

  async function loadBitmap(url) {
    // robust loader that prefers ImageBitmap but falls back to <img>
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous"; // same-origin ok; avoids taint if proxied
    img.src = url;
    await img.decode();
    if (window.createImageBitmap) {
      try { return await createImageBitmap(img); } catch { /* fall through */ }
    }
    return img;
  }

  async function uploadFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      status.textContent = "Provide an image file.";
      return;
    }
    setBusy(true, "Uploading…");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/image/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const json = await res.json();
      if (!json?.id) throw new Error("Invalid server response");
      lastUid = json.id;

      originalBitmap = await loadBitmap(`/upload/${lastUid}?t=${Date.now()}`);
      redraw();
      status.textContent = "Image ready.";
      enableRunIfReady();
    } catch (e) {
      status.textContent = e?.message || String(e);
    } finally {
      setBusy(false);
    }
  }

  async function runEdit() {
    if (!lastUid) return;
    const prompt = promptBox.value.trim();
    if (!prompt) { status.textContent = "Write a prompt."; return; }

    const seed = parseInt(seedInput.value, 10);
    const steps = clamp(parseInt(stepsInput.value, 10) || 4, 1, 50);

    setBusy(true, "Generating…");
    try {
      const res = await fetch("/generate/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_id: lastUid, prompt, seed, steps }),
      });
      if (!res.ok) throw new Error(`Generate failed (${res.status})`);
      const json = await res.json();
      if (!json?.id) throw new Error("Invalid server response");

      resultBitmap = await loadBitmap(`/image/${json.id}?t=${Date.now()}`);
      redraw();
      status.textContent = "Done.";
      container.dispatchEvent(new CustomEvent("imageEdited", { detail: { id: json.id } }));
    } catch (e) {
      status.textContent = e?.message || String(e);
    } finally {
      setBusy(false);
    }
  }

  // ===== events =====
  uploadArea.addEventListener("click", () => fileInput.click());
  uploadArea.addEventListener("dragover", (e) => { e.preventDefault(); uploadArea.classList.add("dragging"); });
  uploadArea.addEventListener("dragleave", () => uploadArea.classList.remove("dragging"));
  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragging");
    const f = e.dataTransfer?.files?.[0];
    if (f) uploadFile(f);
  });
  fileInput.addEventListener("change", () => {
    const f = fileInput.files?.[0];
    if (f) uploadFile(f);
    fileInput.value = "";
  });

  promptBox.addEventListener("input", enableRunIfReady);
  seedInput.addEventListener("input", enableRunIfReady);
  stepsInput.addEventListener("input", enableRunIfReady);
  runBtn.addEventListener("click", runEdit);
  window.addEventListener("resize", redraw);

  return container;
}
