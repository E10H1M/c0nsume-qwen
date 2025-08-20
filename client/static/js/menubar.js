// static/js/menubar.js

export function createMenuBar() {
  const nav = document.createElement("nav");
  nav.className = "menubar";

  // sidebar toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "sidebarToggle";
  toggleBtn.className = "sidebar-toggle";
  toggleBtn.textContent = "☰";
  toggleBtn.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });
  nav.appendChild(toggleBtn);

  const menuList = document.createElement("ul");

  // helper to create dropdowns
  function makeMenu(label, items) {
    const li = document.createElement("li");
    li.textContent = label;
    const ul = document.createElement("ul");
    ul.className = "dropdown";

    items.forEach(item => {
      if (item === "hr") {
        ul.appendChild(document.createElement("hr"));
      } else {
        const li2 = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = item.label;
        if (item.onClick) btn.addEventListener("click", item.onClick);
        li2.appendChild(btn);
        ul.appendChild(li2);
      }
    });

    li.appendChild(ul);
    return li;
  }

  // --- theme logic lives *inside* ---
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    document.querySelectorAll('[id^="theme-"]').forEach(btn =>
      btn.textContent = btn.textContent.replace(" ✓", "")
    );
    const active = document.getElementById(`theme-${theme}`);
    if (active) active.textContent += " ✓";
  }

  // File menu
  menuList.appendChild(makeMenu("File", [
    { label: "New", onClick: () => console.log("new file") },
    { label: "Open…", onClick: () => console.log("open file") },
    { label: "Save", onClick: () => console.log("save file") },
    "hr",
    { label: "Exit", onClick: () => console.log("exit app") }
  ]));

  // Edit menu
  menuList.appendChild(makeMenu("Edit", [
    { label: "Undo", onClick: () => console.log("undo") },
    { label: "Redo", onClick: () => console.log("redo") },
    "hr",
    { label: "Cut", onClick: () => console.log("cut") },
    { label: "Copy", onClick: () => console.log("copy") },
    { label: "Paste", onClick: () => console.log("paste") }
  ]));

  // View menu
  const viewLi = document.createElement("li");
  viewLi.textContent = "View";
  const viewUl = document.createElement("ul");
  viewUl.className = "dropdown";

  // toggle sidebar
  const sidebarBtnLi = document.createElement("li");
  const sidebarBtn = document.createElement("button");
  sidebarBtn.textContent = "Toggle Sidebar";
  sidebarBtn.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });
  sidebarBtnLi.appendChild(sidebarBtn);
  viewUl.appendChild(sidebarBtnLi);

  // theme submenu
  const themeLi = document.createElement("li");
  const themeBtn = document.createElement("button");
  themeBtn.textContent = "Theme";
  themeLi.appendChild(themeBtn);

  const themeUl = document.createElement("ul");
  themeUl.className = "dropdown right";
  ["light", "dark"].forEach(theme => {
    const themeOption = document.createElement("li");
    const themeBtn = document.createElement("button");
    themeBtn.id = `theme-${theme}`;
    themeBtn.textContent = theme[0].toUpperCase() + theme.slice(1);
    themeBtn.addEventListener("click", () => setTheme(theme));
    themeOption.appendChild(themeBtn);
    themeUl.appendChild(themeOption);
  });
  themeLi.appendChild(themeUl);
  viewUl.appendChild(themeLi);

  viewLi.appendChild(viewUl);
  menuList.appendChild(viewLi);

  // Help menu
  menuList.appendChild(makeMenu("Help", [
    { label: "About", onClick: () => alert("Image Generator v1.0") }
  ]));

  nav.appendChild(menuList);

  // --- set initial theme ---
  setTheme(localStorage.getItem("theme") || "light");

  return nav;
}
