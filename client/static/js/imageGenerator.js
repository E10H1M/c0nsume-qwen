// static/js/imageGenerator.js
export function createImageGenerator() {
  const container = document.createElement("div");
  container.className = "image-generator";

  const title = document.createElement("h1");
  title.textContent = "QWEN IMAGE";
  container.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "grid";
  container.appendChild(grid);

  // Prompt
  const promptLabel = document.createElement("label");
  promptLabel.className = "span-all";
  promptLabel.textContent = "Prompt";
  const promptArea = document.createElement("textarea");
  promptArea.id = "prompt";
  promptArea.placeholder = "Describe the image you want…";
  promptLabel.appendChild(promptArea);
  grid.appendChild(promptLabel);

  // Aspect ratio
  const arLabel = document.createElement("label");
  arLabel.textContent = "Aspect ratio";
  const arSelect = document.createElement("select");
  arSelect.id = "aspect_ratio";
  ["16:9","9:16","1:1","4:3","3:4","3:2","2:3"].forEach(r => {
    const opt = document.createElement("option");
    opt.textContent = r;
    if (r === "1:1") opt.selected = true;
    arSelect.appendChild(opt);
  });
  arLabel.appendChild(arSelect);
  grid.appendChild(arLabel);

  // CFG
  const cfgLabel = document.createElement("label");
  cfgLabel.textContent = "CFG (guidance)";
  const cfgInput = document.createElement("input");
  cfgInput.type = "number";
  cfgInput.id = "cfg";
  cfgInput.step = "0.1";
  cfgInput.value = "1.0";
  cfgLabel.appendChild(cfgInput);
  grid.appendChild(cfgLabel);

  // Seed
  const seedLabel = document.createElement("label");
  seedLabel.textContent = "Seed";
  const seedInput = document.createElement("input");
  seedInput.type = "number";
  seedInput.id = "seed";
  seedInput.step = "1";
  seedInput.value = "42";
  seedLabel.appendChild(seedInput);
  grid.appendChild(seedLabel);

  // Controls
  const controls = document.createElement("div");
  controls.className = "controls";
  const genBtn = document.createElement("button");
  genBtn.id = "genBtn";
  genBtn.textContent = "Generate";
  const status = document.createElement("span");
  status.id = "status";
  status.className = "small";
  controls.appendChild(genBtn);
  controls.appendChild(status);
  container.appendChild(controls);

  // Output + image container
  const output = document.createElement("pre");
  output.id = "output";
  container.appendChild(output);

  const imgContainer = document.createElement("div");
  imgContainer.id = "image-container";
  container.appendChild(imgContainer);

  // --- Logic ---
  genBtn.addEventListener("click", async () => {
    genBtn.disabled = true;
    status.textContent = "generating…";

    const body = {
      prompt: promptArea.value,
      aspect_ratio: arSelect.value,
      cfg: parseFloat(cfgInput.value || "1.0"),
      seed: parseInt(seedInput.value || "42", 10),
    };

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      output.textContent = JSON.stringify(data, null, 2);

      imgContainer.innerHTML = "";
      if (data.id) {
        const img = document.createElement("img");
        img.src = `/image/${data.id}`;
        img.alt = "Generated Image";
        imgContainer.appendChild(img);
        status.textContent = "done";

        // 🔥 Dispatch event so app.js can wire history
        container.dispatchEvent(
          new CustomEvent("imageGenerated", { detail: { id: data.id } })
        );
      } else {
        status.textContent = "failed";
      }
    } catch (err) {
      console.error(err);
      status.textContent = "error";
    }

    genBtn.disabled = false;
  });

  return container;
}
