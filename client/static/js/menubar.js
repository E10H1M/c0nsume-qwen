// /static/js/menubar.js
(function loadMenuBarCSS() {
  if (!document.querySelector('link[href="/static/css/menubar.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/static/css/menubar.css";
    document.head.appendChild(link);
  }
})();

/**
 * createMenuBar({ modes })
 * REQUIRED: `modes` = array of { key, label } used to build the “Mode” submenu.
 * We throw if it's missing to keep app.js the single source of truth.
 */
export function createMenuBar(opts = {}) {
  if (!opts || !Array.isArray(opts.modes) || opts.modes.length === 0) {
    throw new Error(
      "createMenuBar: 'modes' is required (array of { key, label }). Pass it from app.js."
    );
  }
  const modes = opts.modes;

  const nav = document.createElement("nav");
  nav.className = "menubar";

  // Sidebar toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "sidebarToggle";
  toggleBtn.className = "sidebar-toggle";
  toggleBtn.textContent = "☰";
  toggleBtn.addEventListener("click", () => {
    document.getElementById("sidebar")?.classList.toggle("open");
  });
  nav.appendChild(toggleBtn);

  const menuList = document.createElement("ul");

  // helper to create dropdowns
  function makeMenu(label, items) {
    const li = document.createElement("li");
    li.textContent = label;
    const ul = document.createElement("ul");
    ul.className = "dropdown";

    items.forEach((item) => {
      if (item === "hr") {
        ul.appendChild(document.createElement("hr"));
        return;
      }
      const li2 = document.createElement("li");
      const btn = document.createElement("button");
      btn.textContent = item.label;

      // mark mode items so we can toggle ✓ via aria-checked
      if (item.mode) {
        btn.dataset.mode = item.mode;
        btn.setAttribute("role", "menuitemradio");
        btn.setAttribute("aria-checked", "false");
      }

      if (item.onClick) btn.addEventListener("click", item.onClick);
      li2.appendChild(btn);
      ul.appendChild(li2);
    });

    li.appendChild(ul);
    return li;
  }

  // Theme (lives here)
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    document.querySelectorAll('[id^="theme-"]').forEach((btn) => {
      btn.textContent = btn.textContent.replace(" ✓", "");
    });
    const active = document.getElementById(`theme-${theme}`);
    if (active) active.textContent += " ✓";
  }

  // File
  menuList.appendChild(
    makeMenu("File", [
      { label: "New", onClick: () => console.log("new file") },
      { label: "Open…", onClick: () => console.log("open file") },
      { label: "Save", onClick: () => console.log("save file") },
      "hr",
      { label: "Exit", onClick: () => console.log("exit app") },
    ])
  );

  // Edit
  menuList.appendChild(
    makeMenu("Edit", [
      { label: "Undo", onClick: () => console.log("undo") },
      { label: "Redo", onClick: () => console.log("redo") },
      "hr",
      { label: "Cut", onClick: () => console.log("cut") },
      { label: "Copy", onClick: () => console.log("copy") },
      { label: "Paste", onClick: () => console.log("paste") },
    ])
  );

  // Mode — built from the passed-in registry
  const modeItems = modes.map(({ key, label }) => ({
    label,
    mode: key,
    onClick: () =>
      window.dispatchEvent(
        new CustomEvent("app:setMode", { detail: { mode: key } })
      ),
  }));
  menuList.appendChild(makeMenu("Mode", modeItems));

  // reflect active mode with aria-checked (✓ styling comes from CSS or text)
  window.addEventListener("app:modeChanged", (e) => {
    const mode = e.detail?.mode;
    const buttons = document.querySelectorAll(
      '.dropdown button[data-mode][role="menuitemradio"]'
    );
    buttons.forEach((btn) => {
      const isActive = btn.dataset.mode === mode;
      btn.setAttribute("aria-checked", String(isActive));
    });
  });

  // View
  const viewLi = document.createElement("li");
  viewLi.textContent = "View";
  const viewUl = document.createElement("ul");
  viewUl.className = "dropdown";

  const sidebarBtnLi = document.createElement("li");
  const sidebarBtn = document.createElement("button");
  sidebarBtn.textContent = "Toggle Sidebar";
  sidebarBtn.addEventListener("click", () => {
    document.getElementById("sidebar")?.classList.toggle("open");
  });
  sidebarBtnLi.appendChild(sidebarBtn);
  viewUl.appendChild(sidebarBtnLi);

  // Theme submenu
  const themeLi = document.createElement("li");
  const themeBtn = document.createElement("button");
  themeBtn.textContent = "Theme";
  themeLi.appendChild(themeBtn);

  const themeUl = document.createElement("ul");
  themeUl.className = "dropdown right";
  ["light", "dark"].forEach((theme) => {
    const themeOption = document.createElement("li");
    const themeBtn2 = document.createElement("button");
    themeBtn2.id = `theme-${theme}`;
    themeBtn2.textContent = theme[0].toUpperCase() + theme.slice(1);
    themeBtn2.addEventListener("click", () => setTheme(theme));
    themeOption.appendChild(themeBtn2);
    themeUl.appendChild(themeOption);
  });
  themeLi.appendChild(themeUl);
  viewUl.appendChild(themeLi);

  viewLi.appendChild(viewUl);
  menuList.appendChild(viewLi);

  // Help
  menuList.appendChild(
    makeMenu("Help", [{ label: "About", onClick: () => alert("Image Generator v1.0") }])
  );

  nav.appendChild(menuList);

  // initial theme
  setTheme(localStorage.getItem("theme") || "light");

  return nav;
}
